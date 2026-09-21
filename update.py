import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

old_str = '<i class="fa-regular fa-star fav-icon"></i>'
new_str = '<div class="fav-icon-container" style="position: absolute; top: 1rem; right: 1rem; cursor: pointer; z-index: 10; font-size: 0.85rem; background: rgba(0,0,0,0.5); padding: 0.4rem 0.8rem; border-radius: 12px; border: 1px solid var(--primary); display: flex; align-items: center; gap: 5px; color: white;"><i class="fa-regular fa-star fav-icon" style="position: static; font-size: 1rem;"></i> <span>Add to Favorites</span></div>'

content = content.replace(old_str, new_str)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print('Updated index.html successfully')
