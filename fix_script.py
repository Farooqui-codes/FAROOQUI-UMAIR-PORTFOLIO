with open('style.css', 'r', encoding='utf-8') as f:
    css = f.read()

# Find .status-ping rule
idx = css.find('.status-ping')
end = css.find(chr(125), idx) + 1

# Original rule block
original = css[idx:end]
print('Original .status-ping block:')
print(repr(original))
