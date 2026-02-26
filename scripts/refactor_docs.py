import os

readme_path = 'README.md'
changelog_path = 'CHANGELOG.md'

with open(readme_path, 'r', encoding='utf-8') as f:
    readme_lines = f.readlines()

start_idx = -1
end_idx = -1

for i, line in enumerate(readme_lines):
    if line.startswith('## 📁 New in Version 2.6.0'):
        start_idx = i
    if line.startswith('## 📦 Installation & Deployment'):
        end_idx = i
        break

if start_idx != -1 and end_idx != -1:
    release_notes = readme_lines[start_idx:end_idx]
    
    feature_overview = """## 🌟 Key Features

*   **Gamified Task Management**: Earn XP, level up, and unlock scalable Cyber-Badges as you complete directives.
*   **Advanced Sub-Routines**: Break complex directives into smaller tasks with drag-and-drop prioritization.
*   **Global Calendar & Scheduling**: Create recurring directives with automated future "Holo-Projections".
*   **Database-Driven Localization**: Multilingual support (7 languages) synced directly to your operative profile, seamlessly carrying over from desktop to mobile.
*   **Multi-Theme Architecture**: Eight distinctive visual matrices including Cyberpunk, LCARS, Matrix, and corporate aesthetics, applied instantly without reload.
*   **Deep Security Protocols**: Enforced Two-Factor Authentication (TOTP or Email Emergency), brute-force rate-limiting, and strict Zero-Config installer lockdown.
*   **Deployment Agnosticism**: Runs via Vanilla PHP and MySQL/MariaDB or zero-config SQLite, installable anywhere from subdirectories on shared HTTP hosting to robust corporate intranets.

---

"""
    
    new_readme = "".join(readme_lines[:start_idx]) + feature_overview + "".join(readme_lines[end_idx:])
    
    with open(readme_path, 'w', encoding='utf-8') as f:
        f.write(new_readme)
        
    changelog_header = "# Changelog\n\nAll notable changes to this project will be documented in this file. The format is based on the system's aesthetic release history.\n\n"
    
    formatted_notes = []
    for line in release_notes:
        if line.startswith('## 📁 New in Version '):
            formatted_notes.append(line.replace('## 📁 New in Version', '# CyberTasker'))
        elif line.startswith('## 🆕 New in Version '):
             formatted_notes.append(line.replace('## 🆕 New in Version', '# CyberTasker'))
        elif line.startswith('## 🛡️ New in Version '):
             formatted_notes.append(line.replace('## 🛡️ New in Version', '# CyberTasker'))
        else:
            formatted_notes.append(line)
            
    with open(changelog_path, 'w', encoding='utf-8') as f:
        f.write(changelog_header + "".join(formatted_notes))

    print("Successfully refactored README.md and CHANGELOG.md")
else:
    print("Could not find start/end indices in README.md")

