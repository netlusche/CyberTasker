import json
import os
import urllib.request
import urllib.parse
import time

TARGETS = ['uk', 'he']

print("Loading base english strings...")
with open("public/locales/en/translation.json", "r", encoding="utf-8") as f:
    base_data = json.load(f)

def extract_strings(d, strings_list, map_keys, current_path=""):
    for k, v in d.items():
        path = f"{current_path}.{k}" if current_path else k
        if isinstance(v, dict):
            extract_strings(v, strings_list, map_keys, path)
        elif isinstance(v, str):
            strings_list.append(v)
            map_keys.append(path)

strings_to_translate = []
key_map = []
extract_strings(base_data, strings_to_translate, key_map)

print(f"Extracted {len(strings_to_translate)} strings.")

def translate_batch(strings, target_lang):
    text = " ||| ".join(strings)
    # Hebrew code in google translate is 'iw' or 'he', usually 'iw' works for the API reliably
    api_lang = 'iw' if target_lang == 'he' else target_lang
    url = "https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=" + api_lang + "&dt=t&q=" + urllib.parse.quote(text)
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as response:
            res = json.loads(response.read().decode('utf-8'))
            translated_text = "".join([x[0] for x in res[0]])
            return [s.strip() for s in translated_text.split("|||")]
    except Exception as e:
        print(f"Error translating to {target_lang}: {e}")
        return strings

def set_nested_value(d, path, value):
    keys = path.split('.')
    for key in keys[:-1]:
        d = d[key]
    d[keys[-1]] = value.strip() if isinstance(value, str) else value

def process_lang(lang_code, folder_name):
    print(f"Translating to {folder_name} ({lang_code})...")
    translated_strings = []
    chunk_size = 30
    for i in range(0, len(strings_to_translate), chunk_size):
        chunk = strings_to_translate[i:i+chunk_size]
        res = translate_batch(chunk, lang_code)
        if len(res) < len(chunk):
            res += chunk[len(res):]
        elif len(res) > len(chunk):
            res = res[:len(chunk)]
        translated_strings.extend(res)
        time.sleep(1)
    
    import copy
    new_data = copy.deepcopy(base_data)
    for path, val in zip(key_map, translated_strings):
        set_nested_value(new_data, path, val)
        
    os.makedirs(f"public/locales/{folder_name}", exist_ok=True)
    with open(f"public/locales/{folder_name}/translation.json", "w", encoding="utf-8") as f:
        json.dump(new_data, f, ensure_ascii=False, indent=4)
    print(f"Saved {folder_name}.")

for lang in TARGETS:
    process_lang(lang, lang)

print("Translation for UK and HE completed.")
