/* =====================================================
   生命律动 心电图叙事开场页 (magic intro)
   纯原生 JS + CSS：会话内播放一次（sessionStorage 记忆）、
   ECG 全宽自绘 → 心跳一拍徽章爆发 → 标题落定 → 按钮入场。
   点击/任意键跳过至完成态；退出时统一解绑监听与清理 rAF。
   ===================================================== */
(function () {
  'use strict';

  var SEEN_KEY = 'magic_intro_seen';
  var overlay = document.getElementById('magicIntro');
  if (!overlay) return;

  // 尊重系统的减弱动态效果偏好
  var reduced = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  function hasSeen() {
    try { return !!sessionStorage.getItem(SEEN_KEY); } catch (e) { return false; }
  }
  function markSeen() {
    try { sessionStorage.setItem(SEEN_KEY, '1'); } catch (e) { /* 隐私模式等场景兜底 */ }
  }

  // 本会话已看过 → 立即移除遮罩，主界面照常渲染
  if (hasSeen()) {
    document.body.classList.add('magic-revealed');
    if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
    return;
  }

  var startBtn = document.getElementById('magicStart');
  var ecgSvg = overlay.querySelector('.mi-ecg');
  var ecgPath = overlay.querySelector('.mi-ecg-path');
  var emblem = overlay.querySelector('.mi-emblem');
  var emblemSvg = overlay.querySelector('.mi-emblem svg');
  var aurora = overlay.querySelector('.mi-aurora');
  var bpmEl = document.getElementById('miBpm');
  var dotEl = document.getElementById('miHudDot');

  var finished = false; // 入场是否已到完成态（自然播完或跳过）
  var exited = false;
  var hudRaf = 0;
  var parallaxRaf = 0;

  // ---- ECG 描边长度校准（JS 用 getTotalLength 精确写入 CSS 变量） ----
  var pathLen = 1500;
  if (ecgPath && ecgPath.getTotalLength) {
    try {
      var L = ecgPath.getTotalLength();
      if (L > 0) pathLen = L;
    } catch (e) { /* 极老浏览器兜底 */ }
  }
  if (ecgPath) {
    overlay.style.setProperty('--mi-len', pathLen);
    ecgPath.style.strokeDasharray = pathLen + ' ' + pathLen;
    ecgPath.style.strokeDashoffset = pathLen;
  }

  // ---- ECG 线垂直对齐蛇杖徽章中心（QRS 尖峰从徽章中心迸发） ----
  function alignEcg() {
    if (!ecgSvg || !emblemSvg) return;
    try {
      var r = emblemSvg.getBoundingClientRect();
      if (r.height > 0) {
        var cy = r.top + r.height / 2;
        ecgSvg.style.top = cy + 'px';
        overlay.style.setProperty('--mi-ecg-y', cy + 'px');
      }
    } catch (e) { /* 保持 CSS 默认 38% 兜底 */ }
  }

  // ---- HUD：BPM 计数(0→72, 1.2s) 与心跳圆点闪烁(~0.83s) 同一 rAF 管理 ----
  var BPM = 72, COUNT_MS = 1200, BEAT_MS = 833, BEAT_ON_MS = 160;
  function startHud() {
    if (reduced) { if (bpmEl) bpmEl.textContent = BPM; return; }
    var t0 = null, counted = false;
    function frame(now) {
      if (t0 === null) t0 = now;
      var t = now - t0;
      if (t < COUNT_MS) {
        var eased = 1 - Math.pow(1 - t / COUNT_MS, 3);
        if (bpmEl) bpmEl.textContent = Math.round(eased * BPM);
      } else {
        if (!counted) { counted = true; if (bpmEl) bpmEl.textContent = BPM; } // 只在跨过计数期那一帧写一次
        if (dotEl) dotEl.classList.toggle('on', ((t - COUNT_MS) % BEAT_MS) < BEAT_ON_MS);
      }
      hudRaf = requestAnimationFrame(frame);
    }
    hudRaf = requestAnimationFrame(frame);
  }
  function stopHud() {
    if (hudRaf) cancelAnimationFrame(hudRaf);
    hudRaf = 0;
    if (dotEl) dotEl.classList.remove('on');
  }

  // ---- 鼠标视差：极光 ±10px，徽章反向 ±4px，rAF 平滑 ----
  var tx = 0, ty = 0, ax = 0, ay = 0;
  function onMouseMove(e) {
    var w = window.innerWidth || 1, h = window.innerHeight || 1;
    tx = ((e.clientX / w) * 2 - 1) * 10;
    ty = ((e.clientY / h) * 2 - 1) * 10;
  }
  function parallaxLoop() {
    ax += (tx - ax) * 0.08;
    ay += (ty - ay) * 0.08;
    if (aurora) aurora.style.transform = 'translate3d(' + ax.toFixed(2) + 'px,' + ay.toFixed(2) + 'px,0)';
    if (emblem) emblem.style.transform = 'translate3d(' + (-ax * 0.4).toFixed(2) + 'px,' + (-ay * 0.4).toFixed(2) + 'px,0)';
    parallaxRaf = requestAnimationFrame(parallaxLoop);
  }
  function stopParallax() {
    if (parallaxRaf) cancelAnimationFrame(parallaxRaf);
    parallaxRaf = 0;
  }

  // ---- 启动：等 app.js 的 initTheme（DOMContentLoaded 内）应用 data-theme 后再播 ----
  function begin() {
    alignEcg();
    overlay.classList.add('play');
    startHud();
    if (!reduced) {
      overlay.addEventListener('mousemove', onMouseMove);
      parallaxRaf = requestAnimationFrame(parallaxLoop);
    }
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      setTimeout(begin, 0); // 让 app.js 的 DOMContentLoaded 初始化先完成
    }, { once: true });
  } else {
    requestAnimationFrame(begin);
  }

  // ---- 跳过：立即进入完成态（所有元素就位、无动画等待） ----
  function skip() {
    if (finished || exited) return;
    finished = true;
    unbindKeys();
    overlay.classList.add('skip', 'play');
    if (bpmEl) bpmEl.textContent = BPM;
  }

  // ---- 退出：写标记 → 最后一拍脉冲 → 遮罩放大淡出 → 移除 DOM ----
  function exit() {
    if (exited) return;
    exited = true;
    markSeen();
    unbindKeys();
    unbindMouse();
    stopHud();
    stopParallax();

    document.body.classList.add('magic-revealed'); // 主界面各区块依次入场
    overlay.classList.add('beat');                 // 内容 1.02 快速回弹 + 极光提亮 (~0.25s)
    setTimeout(function () {
      overlay.classList.add('exiting');            // 遮罩 scale(1.04)+淡出 (~0.4s)
    }, 230);
    setTimeout(function () {
      if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
    }, 700);
  }

  // ---- 监听统一管理（退出/跳过后解绑，修旧版遗留） ----
  function onKeyDown(e) {
    if (exited) return;
    // 焦点在按钮上时，Enter/Space 交给按钮原生行为直接进入系统
    if (startBtn && document.activeElement === startBtn && (e.key === 'Enter' || e.key === ' ')) return;
    if (!finished) skip();
  }
  function unbindKeys() { document.removeEventListener('keydown', onKeyDown); }
  function unbindMouse() { overlay.removeEventListener('mousemove', onMouseMove); }

  if (startBtn) {
    startBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      exit();
    });
  }
  overlay.addEventListener('click', function (e) {
    if (exited) return;
    if (startBtn && (e.target === startBtn || (startBtn.contains && startBtn.contains(e.target)))) return;
    if (!finished) skip(); // 播放中点击任意处 → 完成态；完成态再点交给按钮
  });
  document.addEventListener('keydown', onKeyDown);
})();
