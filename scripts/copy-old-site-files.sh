#!/usr/bin/env bash
# Copies every image and the CV that the new site uses from the old Columbia
# site into src/assets/, so the new site no longer depends on the old one.
# Run once from the project folder:   bash scripts/copy-old-site-files.sh
set -u
cd "$(dirname "$0")/.."
OLD="https://www.columbia.edu/~as1038/img"

names=$(grep -hoE '"[^"]+\.(jpg|jpeg|png|gif|JPG|PNG)"' src/_data/*.yml src/*.njk src/*.md | tr -d '"' | sort -u)
mkdir -p src/assets/img src/assets/files
ok=0; fail=0
while IFS= read -r f; do
  [ -z "$f" ] && continue
  [ -f "src/assets/img/$f" ] && continue
  if curl -fsSL "$OLD/${f// /%20}" -o "src/assets/img/$f"; then ok=$((ok+1)); else echo "  could not download: $f"; rm -f "src/assets/img/$f"; fail=$((fail+1)); fi
done <<< "$names"

cv=$(grep -oE '^cv: "[^"]+"' src/_data/site.yml | sed 's/cv: "//; s/"$//')
if [ -n "$cv" ] && [ ! -f "src/assets/files/$cv" ]; then
  curl -fsSL "$OLD/$cv" -o "src/assets/files/$cv" && echo "Copied CV: $cv" || echo "  could not download CV: $cv"
fi
echo "Copied $ok images ($fail failed). Now commit them:  git add src/assets && git commit -m 'Copy images from old site' && git push"
