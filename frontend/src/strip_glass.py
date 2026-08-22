import os
import re

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original = content
    
    # Strip backdropFilter inline styles
    content = re.sub(r'(?i)backdropFilter:\s*[\'\"].*?[\'\"]\s*,?', '', content)
    
    # Strip backdrop-filter css rules inline
    content = re.sub(r'(?i)backdrop-filter:\s*.*?;', '', content)

    # Change background rgba(255, 255, 255, 0.2) and similar to var(--bg-card) or transparent
    content = re.sub(r'backgroundColor:\s*[\'\"]rgba?\(255,\s*255,\s*255,\s*0\.\d+\)[\'\"]', 'backgroundColor: \'var(--bg-card)\'', content)
    content = re.sub(r'background:\s*[\'\"]rgba?\(255,\s*255,\s*255,\s*0\.\d+\)[\'\"]', 'background: \'var(--bg-card)\'', content)
    
    # Also strip out the dark rgba backgrounds from the previous glass design
    content = re.sub(r'backgroundColor:\s*[\'\"]rgba?\(14,\s*14,\s*12,\s*0\.\d+\)[\'\"]', 'backgroundColor: \'var(--bg-card)\'', content)
    content = re.sub(r'background:\s*[\'\"]rgba?\(14,\s*14,\s*12,\s*0\.\d+\)[\'\"]', 'background: \'var(--bg-card)\'', content)

    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f'Updated {filepath}')

src_dir = r'c:\Users\MANAN\OneDrive\Desktop\odooXld\frontend\src'
for root, dirs, files in os.walk(src_dir):
    for file in files:
        if file.endswith('.jsx') or file.endswith('.js'):
            process_file(os.path.join(root, file))
