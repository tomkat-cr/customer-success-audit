# .DEFAULT_GOAL := local
.PHONY: tests venv
SHELL := /bin/bash

# General Commands
help:
	cat Makefile

pre-deploy:
	if [ -f .env ]; then set -o allexport; source .env; set +o allexport; fi; sh ./scripts/set_api_base_in_index.sh "$${VITE_APP_API_BASE_URL:-}" "$${VITE_APP_DEBUG:-}"

install:
	npm install

run: pre-deploy
	npm run dev

build: pre-deploy
	npm run build

deploy: pre-deploy
	npm run deploy
