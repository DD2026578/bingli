/* =====================================================
   生命律动 心电图叙事开场页 (magic intro - 方案①：临床监护仪真实动态光扫流)
   纯原生 JS + Canvas + CSS：
   1. 全屏单一标准正常窦性心搏波段 (Single Standard Sinus Beat - Lead II)；
   2. 左右两翼为平整等电位基线，中央标准 P-Q-R-S-T 心搏波段精准对齐蛇杖；
   3. 四角分置 内科 / 外科 / 妇产科 / 儿科 专属医学徽章微卡片；
   4. 真实临床级红色示波器扫描头 (Phosphor Glow Head) + 5mm 医学心电网格；
   5. 扫过中央 R 峰尖顶时触发蛇杖高亮脉冲心跳；点击/按键跳过，退场平滑进入主系统。
   ===================================================== */
(function () {
  'use strict';

  var SEEN_KEY = 'magic_intro_seen';
  var overlay = document.getElementById('magicIntro');
  if (!overlay) return;

  var reduced = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  function hasSeen() {
    try { return !!sessionStorage.getItem(SEEN_KEY); } catch (e) { return false; }
  }
  function markSeen() {
    try { sessionStorage.setItem(SEEN_KEY, '1'); } catch (e) {}
  }

  // 本会话已看过 → 立即移除遮罩，主界面照常渲染
  if (hasSeen()) {
    document.body.classList.add('magic-revealed');
    if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
    return;
  }

  var startBtn = document.getElementById('magicStart');
  var canvas = document.getElementById('miEcgCanvas');
  var emblem = overlay.querySelector('.mi-emblem');
  var emblemSvg = overlay.querySelector('.mi-emblem svg');
  var orbGlow = overlay.querySelector('.mi-orb-glow');
  var aurora = overlay.querySelector('.mi-aurora');
  var deptCorners = overlay.querySelectorAll('.mi-dept-corner');

  var finished = false;
  var exited = false;
  var parallaxRaf = 0;
  var ecgRaf = 0;

  var ctx = canvas ? canvas.getContext('2d') : null;
  var cw = 0, ch = 0, dpr = 1;
  var sweepX = 0;
  var sweepSpeed = 0.0035;
  var time = 0;
  var centerY = 0;
  var amp = 75;

  function getSingleEcgSample(xNorm) {
    var d = xNorm - 0.5;

    var p = 0.14 * Math.exp(-Math.pow((d + 0.082) / 0.017, 2));

    var q = -0.09 * Math.exp(-Math.pow((d + 0.016) / 0.0048, 2));

    var r = 1.15 * Math.exp(-Math.pow(d / 0.0062, 2));

    var s = -0.22 * Math.exp(-Math.pow((d - 0.0145) / 0.0058, 2));

    var tDiff = d - 0.088;
    var tShape = 0.25 * Math.exp(-Math.pow(tDiff / 0.026, 2));
    if (tDiff > 0) {
      tShape *= Math.max(0, 1 - tDiff * 7.5);
    }

    return p + q + r + s + tShape;
  }

  function getSweepSpeedMultiplier(xNorm) {
    var d = Math.abs(xNorm - 0.5);
    if (d >= 0.16) {
      return 2.2;
    }
    var t = d / 0.16;
    var smooth = t * t * (3 - 2 * t);
    return 0.48 + (2.2 - 0.48) * smooth;
  }

  // ---- 调整 Canvas 分辨率与基线位置 ----
  function resizeCanvas() {
    if (!canvas || !ctx) return;
    dpr = window.devicePixelRatio || 1;
    var rect = canvas.getBoundingClientRect();
    cw = canvas.width = Math.ceil(rect.width * dpr);
    ch = canvas.height = Math.ceil(rect.height * dpr);

    // 确定心电基线 Y 坐标（精准穿过蛇杖中心）
    if (emblemSvg) {
      try {
        var r = emblemSvg.getBoundingClientRect();
        if (r.height > 0) {
          centerY = (r.top + r.height * 0.45) * dpr;
          overlay.style.setProperty('--mi-ecg-y', (r.top + r.height * 0.45) + 'px');
        } else {
          centerY = ch * 0.38;
        }
      } catch (e) {
        centerY = ch * 0.38;
      }
    } else {
      centerY = ch * 0.38;
    }

    // 标准 R 峰高度（像素）
    amp = Math.max(Math.min(ch * 0.18, 120 * dpr), 46 * dpr);
  }

  // ---- 绘制微弱 5mm 医学心电坐标网格纸 ----
  function drawMedicalGrid() {
    if (!ctx || cw <= 0 || ch <= 0) return;
    ctx.save();
    ctx.strokeStyle = "rgba(148, 163, 184, 0.07)";
    ctx.lineWidth = 1;

    var step = Math.max(18 * dpr, 14);
    ctx.beginPath();
    for (var x = 0; x < cw; x += step) {
      ctx.moveTo(x, 0); ctx.lineTo(x, ch);
    }
    for (var y = 0; y < ch; y += step) {
      ctx.moveTo(0, y); ctx.lineTo(cw, y);
    }
    ctx.stroke();
    ctx.restore();
  }

  // ---- Canvas 渲染循环：红色光扫 + 真实荧光余辉 + 徽章心跳联动 ----
  function renderEcgLoop() {
    if (!ctx || exited) return;
    time += 0.016;
    ctx.clearRect(0, 0, cw, ch);

    drawMedicalGrid();

    if (!finished && !reduced) {
      var currentNorm = cw > 0 ? (sweepX / cw) : 0;
      var mult = getSweepSpeedMultiplier(currentNorm);
      sweepX = (sweepX + (cw * sweepSpeed * mult)) % cw;
    } else {
      sweepX = (sweepX + (cw * 0.0028)) % cw;
    }

    // 徽章光球脉冲联动：扫描头经过中央主 R 峰时触发心跳
    var midPx = cw * 0.5;
    var distToMid = Math.abs(sweepX - midPx);
    if (distToMid < 32 * dpr) {
      var pulse = 1 - distToMid / (32 * dpr);
      if (orbGlow) {
        orbGlow.style.transform = 'scale(' + (1 + pulse * 0.8) + ')';
        orbGlow.style.opacity = (0.6 + pulse * 0.4).toFixed(2);
      }
    } else if (orbGlow) {
      orbGlow.style.transform = 'scale(1)';
      orbGlow.style.opacity = '0.5';
    }

    // 绘制全宽衰减心电轨迹 (采样步长为 2 像素)
    var stepPx = Math.max(2, Math.floor(dpr * 1.5));
    ctx.lineWidth = 2.4 * dpr;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    for (var i = 0; i < cw; i += stepPx) {
      var xNorm = i / cw;
      var val = getSingleEcgSample(xNorm);
      var y = centerY - val * amp;

      var prevNorm = Math.max(0, (i - stepPx) / cw);
      var prevY = centerY - getSingleEcgSample(prevNorm) * amp;

      // 计算距离扫描头的物理距离，生成指数级余辉衰减 (Afterglow Decay)
      var age = (sweepX - i + cw) % cw;
      var alpha = Math.max(0, 1 - (age / (cw * 0.92)));
      alpha = Math.pow(alpha, 1.4); // 柔和非线性衰减

      ctx.beginPath();
      ctx.moveTo(i - stepPx, prevY);
      ctx.lineTo(i, y);

      if (age < 20 * dpr) {
        // 扫描头尖端：高白透红高光
        ctx.strokeStyle = "rgba(254, 226, 226, " + Math.min(1, alpha + 0.3) + ")";
        ctx.shadowColor = "rgba(239, 68, 68, 0.9)";
        ctx.shadowBlur = 10 * dpr;
      } else {
        // 余辉段：经典医用鲜红 → 柔和暗红
        ctx.strokeStyle = "rgba(220, 38, 38, " + (alpha * 0.92) + ")";
        ctx.shadowColor = "rgba(220, 38, 38, " + (alpha * 0.5) + ")";
        ctx.shadowBlur = 4 * dpr;
      }
      ctx.stroke();
    }
    ctx.shadowBlur = 0;

    // 绘制扫描头顶端发光光斑
    var curNorm = sweepX / cw;
    var curVal = getSingleEcgSample(curNorm);
    var headY = centerY - curVal * amp;
    var spotRadius = 12 * dpr;

    var grad = ctx.createRadialGradient(sweepX, headY, 0, sweepX, headY, spotRadius);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    grad.addColorStop(0.35, 'rgba(248, 113, 113, 0.9)');
    grad.addColorStop(0.7, 'rgba(220, 38, 38, 0.4)');
    grad.addColorStop(1, 'rgba(220, 38, 38, 0)');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(sweepX, headY, spotRadius, 0, Math.PI * 2);
    ctx.fill();

    ecgRaf = requestAnimationFrame(renderEcgLoop);
  }

  // ---- 鼠标视差微动：极光 ±10px，徽章反向 ±4px，四角科室轻微层叠 ----
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

  // ---- 启动系统开场 ----
  function begin() {
    resizeCanvas();
    overlay.classList.add('play');
    renderEcgLoop();
    if (!reduced) {
      overlay.addEventListener('mousemove', onMouseMove);
      parallaxRaf = requestAnimationFrame(parallaxLoop);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      setTimeout(begin, 0);
    }, { once: true });
  } else {
    requestAnimationFrame(begin);
  }

  window.addEventListener('resize', function () {
    resizeCanvas();
  });

  // ---- 跳过：立即进入完成态 ----
  function skip() {
    if (finished || exited) return;
    finished = true;
    unbindKeys();
    overlay.classList.add('skip', 'play');
  }

  // ---- 退出：写标记 → 最后一拍脉冲 → 遮罩淡出 → 移除 DOM ----
  function exit() {
    if (exited) return;
    exited = true;
    markSeen();
    unbindKeys();
    unbindMouse();
    stopParallax();
    if (ecgRaf) cancelAnimationFrame(ecgRaf);

    document.body.classList.add('magic-revealed');
    overlay.classList.add('beat');
    setTimeout(function () {
      overlay.classList.add('exiting');
    }, 230);
    setTimeout(function () {
      if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
    }, 700);
  }

  function onKeyDown(e) {
    if (exited) return;
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
    if (!finished) skip();
  });
  document.addEventListener('keydown', onKeyDown);
})();
