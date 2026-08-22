import os
import re

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original = content
    
    # Replace background color logic
    content = re.sub(r'backgroundColor:\s*[\'\"]rgba?\(\d+,\s*\d+,\s*\d+,\s*0\.\d+\)[\'\"]', 'backgroundColor: \'var(--bg-card)\'', content)
    content = re.sub(r'background:\s*[\'\"]rgba?\(\d+,\s*\d+,\s*\d+,\s*0\.\d+\)[\'\"]', 'background: \'var(--bg-card)\'', content)
    
    # Update text colors
    content = re.sub(r'color:\s*[\'\"]#1a1714[\'\"]', 'color: \'var(--text-main)\'', content)
    content = re.sub(r'color:\s*[\'\"]#7a7065[\'\"]', 'color: \'var(--text-muted)\'', content)

    # Some old white backgrounds
    content = re.sub(r'backgroundColor:\s*[\'\"]#ffffff[\'\"]', 'backgroundColor: \'var(--bg-card)\'', content)
    content = re.sub(r'background:\s*[\'\"]#ffffff[\'\"]', 'background: \'var(--bg-card)\'', content)
    
    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f'Updated {filepath}')

src_dir = r'c:\Users\MANAN\OneDrive\Desktop\odooXld\frontend\src'
for root, dirs, files in os.walk(src_dir):
    for file in files:
        if file.endswith('.jsx') or file.endswith('.js'):
            process_file(os.path.join(root, file))
