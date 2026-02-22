import json
import glob
import sys
import os

import re

def flatten_keys(d, parent_key=''):
    keys = set()
    for k, v in d.items():
        new_key = f"{parent_key}.{k}" if parent_key else k
        if isinstance(v, dict):
            keys.update(flatten_keys(v, new_key))
        else:
            keys.add(new_key)
    return keys

def extract_backend_themes():
    auth_path = 'api/controllers/AuthController.php'
    if not os.path.exists(auth_path):
        print(f"Error: {auth_path} not found.")
        return []
    
    with open(auth_path, 'r', encoding='utf-8') as f:
        content = f.read()
        
    match = re.search(r'\$allowedThemes\s*=\s*\[(.*?)\];', content)
    if not match:
        return []
        
    themes = [t.strip().strip("'").strip('"') for t in match.group(1).split(',')]
    return themes

def main():
    en_path = 'public/locales/en/translation.json'
    if not os.path.exists(en_path):
        print(f"Error: {en_path} not found. Run this from the project root.")
        sys.exit(1)

    with open(en_path, 'r', encoding='utf-8') as f:
        en_data = json.load(f)
    
    # Verify Theme Completeness
    backend_themes = extract_backend_themes()
    missing_themes = []
    
    if backend_themes:
        visual_interface = en_data.get('help', {}).get('sections', {}).get('visual_interface', {})
        for theme in backend_themes:
            expected_key = f"theme_{theme}"
            if expected_key not in visual_interface:
                missing_themes.append(theme)
                
    if missing_themes:
        print("❌ CRITICAL: The following themes are missing descriptions in the English translation file!")
        for t in missing_themes:
            print(f"   - theme_{t}")
        print("\nPlease fix the English source file before checking locale synchronisation.")
        sys.exit(1)
    else:
        print(f"✅ All {len(backend_themes)} backend themes are documented in the English Help Manual.")

    en_keys = flatten_keys(en_data)
    locales = glob.glob('public/locales/*/translation.json')
    
    missing_found = False
    
    for locale_path in locales:
        if locale_path == en_path:
            continue
            
        with open(locale_path, 'r', encoding='utf-8') as f:
            try:
                locale_data = json.load(f)
            except json.JSONDecodeError as e:
                print(f"❌ Error parsing {locale_path}: {e}")
                missing_found = True
                continue
            
        locale_keys = flatten_keys(locale_data)
        
        missing_keys = en_keys - locale_keys
        if missing_keys:
            print(f"❌ Missing translations in {locale_path}:")
            for k in sorted(missing_keys):
                print(f"   - {k}")
            missing_found = True
        else:
            print(f"✅ {locale_path} is complete.")
            
    if missing_found:
        print("\nTranslation check failed. Please update missing keys.")
        sys.exit(1)
    else:
        print("\nAll translations are fully synchronized!")
        sys.exit(0)

if __name__ == "__main__":
    main()
