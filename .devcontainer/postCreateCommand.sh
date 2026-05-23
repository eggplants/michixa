#!/usr/bin/env zsh

set -exo pipefail

if ! grep -q mise ~/.zshrc; then
  # shellcheck disable=SC2016
  echo 'eval "$(mise activate zsh)"' >> ~/.zshrc
fi

if ! grep -q vite-plus ~/.zshrc; then
  # shellcheck disable=SC2016
  echo '. "$HOME/.vite-plus/env"' >> ~/.zshrc
fi

if ! grep -q vite-plus ~/.profile; then
  # shellcheck disable=SC2016
  echo '. "$HOME/.vite-plus/env"' >> ~/.profile
fi

mise self-update -y
mise trust
mise install
mise generate git-pre-commit -w
mise generate git-pre-commit -t pre-push --hook pre-push -w
eval "$(mise activate zsh)"

vp env setup

sed -i ~/.zshrc -e 's/^ZSH_THEME=.*/ZSH_THEME="refined"/'

vp env on
vp install
