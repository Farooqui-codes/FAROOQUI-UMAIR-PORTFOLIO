
with open('style.css', 'r') as f:
    css = f.read()

# Fix 1: Add .status-env rule after .status-ping
status_env_rule = chr(10) + '.status-env {' + chr(10)
status_env_rule += '  opacity: 0.75;' + chr(10)
status_env_rule += '  font-size: 0.68rem;' + chr(10)
status_env_rule += '  margin-left: 2px;' + chr(10)
status_env_rule += '}' + chr(10)

idx = css.find('.status-ping')
end_idx = css.find('}', idx)
print('status-ping found at', idx, 'end at', end_idx)

print('Has .status-ping:', '.status-ping' in css)
print('Has .status-env:', '.status-env' in css)

with open('style.css', 'w') as f:
    f.write(css)
print('Done')
