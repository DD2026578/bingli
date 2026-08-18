import re

with open('../js/data/obgyn.js', 'r', encoding='utf-8') as f:
    content = f.read()

names = re.findall(r'"name":\s*"(.*?)"', content)
print("Diseases:", names)

import json
# Actually the file is JS, not pure JSON. We need to parse the peConfig part.
