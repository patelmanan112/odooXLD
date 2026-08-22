import os
import re

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original = content
    
    # Fix old terracotta
    content = re.sub(r'[\'\"]#c8622a[\'\"]', "'var(--accent-terracotta)'", content)
    
    # Fix dark text color '#022c22' which might be invisible on dark mode, change to var(--text-main)
    content = re.sub(r'[\'\"]#022c22[\'\"]', "'var(--text-main)'", content)
    
    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f'Updated {filepath}')

src_dir = r'c:\Users\MANAN\OneDrive\Desktop\odooXld\frontend\src'
for root, dirs, files in os.walk(src_dir):
    for file in files:
        if file.endswith('.jsx') or file.endswith('.js'):
            process_file(os.path.join(root, file))
