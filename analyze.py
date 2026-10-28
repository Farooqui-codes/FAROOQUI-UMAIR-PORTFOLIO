
import re
css = open('style.css').read()
lines = css.split('\n')
print('Total lines:', len(lines))
print('Total chars:', len(css))
# Find all cursor usages
print('--- cursor usages ---')
for i, line in enumerate(lines, 1):
    if 'cursor' in line.lower():
        print(i, line.strip())
print('--- all color values (non-variable) ---')
for i, line in enumerate(lines, 1):
    # find hex/rgb colors not inside var()
    if re.search(r'#([0-9a-fA-F]{3,8}|[0-9a-fA-F]{6})', line) or re.search(r'rgb\(', line):
        print(i, line.strip())
