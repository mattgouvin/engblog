SHELL := bash
MAKEFLAGS += --warn-undefined-variables --no-builtin-rules
.DEFAULT_GOAL := help
.DELETE_ON_ERROR:

ARGS ?=

.PHONY: help install check build run clean

help: ## Show available targets
	@awk 'BEGIN {FS = ":.*## "} /^[a-zA-Z_-]+:.*## / {printf "  \033[36m%-10s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

node_modules: package.json bun.lock
	bun install --frozen-lockfile
	@touch $@

install: node_modules ## Install dependencies from bun.lock

check: node_modules ## Lint, typecheck, and test
	bunx eslint src tst
	bunx tsc --noEmit
	bun test

build: check ## Run checks, then bundle to build/
	bun build ./src/index.ts --outdir ./build --target=node

run: node_modules ## Run the CLI, e.g. make run ARGS="--companies google --daysBack 7"
	bun run src/index.ts list-articles $(ARGS)

clean: ## Remove build output and node_modules
	rm -rf build dist node_modules
