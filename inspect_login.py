from pathlib import Path
lines = Path('pages/Login.tsx').read_text(encoding='utf-8').splitlines()
for i in range(140, 220):
    print(f"{i+1}: {lines[i]}")
