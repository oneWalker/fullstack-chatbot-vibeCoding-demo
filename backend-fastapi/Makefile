# Makefile for FastAPI Chatbot Backend

# Variables
PYTHON := python3
PIP := pip
UV := uv
UVICORN := uvicorn
HOST := 0.0.0.0
PORT := 3000
# Default target
.PHONY: help
help:
	@echo "FastAPI Chatbot Backend - Makefile Commands"
	@echo ""
	@echo "Usage:"
	@echo "  make install          Install dependencies with pip"
	@echo "  make install-uv       Install dependencies with uv (recommended)"
	@echo "  make dev             Start development server"
	@echo "  make prod            Start production server"
	@echo "  make test            Run tests"
	@echo "  make format          Format code with black and isort"
	@echo "  make clean           Clean Python cache files"
	@echo "  make help            Show this help message"
# Install dependencies with pip
.PHONY: install
install:
	$(PIP) install -e .

# Install dependencies with uv (recommended)
.PHONY: install-uv
install-uv:
	$(UV) sync
# Start development server
.PHONY: dev
dev:
	$(UVICORN) app.main:app --host $(HOST) --port $(PORT) --reload

# Start production server
.PHONY: prod
prod:
	$(UVICORN) app.main:app --host $(HOST) --port $(PORT) --workers 4

# Run tests
.PHONY: test
test:
	$(PYTHON) -m pytest

# Format code
.PHONY: format
format:
	black .
	isort .

# Clean Python cache files
.PHONY: clean
clean:
	find . -type f -name "*.pyc" -delete
	find . -type d -name "__pycache__" -delete
	rm -rf .pytest_cache/
	rm -rf htmlcov/
	rm -f .coverage

# Setup environment (copy .env.example to .env)
.PHONY: setup-env
setup-env:
	cp .env.example .env