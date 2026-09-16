#!/usr/bin/env bash
# Descarcă ultimele postări publice de pe @eternal.beauty_by_cosmina în shared/photos/
# și le redenumește post-01.jpg … post-08.jpg. Necesită Python 3 și acces la instagram.com.
#
#   ./scripts/import-instagram.sh            # ultimele 8 postări
#   ./scripts/import-instagram.sh 12         # ultimele 12
#   IG_LOGIN=contul_tau ./scripts/import-instagram.sh   # dacă Instagram cere autentificare
set -euo pipefail
PROFILE="eternal.beauty_by_cosmina"
COUNT="${1:-8}"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DEST="$ROOT/shared/photos"
TMP="$(mktemp -d)"

python3 -m pip install --quiet --upgrade instaloader

ARGS=(--no-videos --no-video-thumbnails --no-captions --no-metadata-json --no-compress-json --dirname-pattern "$TMP" --filename-pattern "{date_utc}_{shortcode}" --count "$COUNT")
if [[ -n "${IG_LOGIN:-}" ]]; then ARGS+=(--login "$IG_LOGIN"); fi
python3 -m instaloader "${ARGS[@]}" -- "$PROFILE"

i=1
for f in $(ls -1 "$TMP"/*.jpg | sort -r); do
  [[ $i -gt $COUNT ]] && break
  cp "$f" "$DEST/post-$(printf '%02d' "$i").jpg"
  i=$((i+1))
done

# poza de profil devine portret/hero dacă nu există deja
python3 -m instaloader --no-posts --dirname-pattern "$TMP/profile" -- "$PROFILE" >/dev/null 2>&1 || true
pp=$(ls -1 "$TMP"/profile/*profile_pic*.jpg 2>/dev/null | head -1 || true)
if [[ -n "$pp" ]]; then
  [[ -f "$DEST/portrait.jpg" ]] || cp "$pp" "$DEST/portrait.jpg"
fi
[[ -f "$DEST/hero.jpg" ]] || cp "$DEST/post-01.jpg" "$DEST/hero.jpg" 2>/dev/null || true

rm -rf "$TMP"
echo "✓ $(($i-1)) fotografii importate în shared/photos/"
