#!/usr/bin/env bash

set -exo pipefail

if [[ ! -f ~/.claude.json ]]; then
  echo '{}' > ~/.claude.json
fi
