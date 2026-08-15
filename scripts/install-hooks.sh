#!/bin/sh
# Instala el hook de pre-commit de MacroLab en el clon local.
# Los hooks viven en .git/hooks/, que no se versiona: cada persona
# que clone el repo debe correr este script una vez.
set -e
DIR="$(cd "$(dirname "$0")/.." && pwd)"
[ -d "$DIR/.git" ] || { echo "✘ $DIR no es un clon de git."; exit 1; }
cp "$DIR/scripts/pre-commit" "$DIR/.git/hooks/pre-commit"
chmod +x "$DIR/.git/hooks/pre-commit"
echo "✔ Hook instalado en .git/hooks/pre-commit"
echo "  Pruébalo con:  sh .git/hooks/pre-commit"
