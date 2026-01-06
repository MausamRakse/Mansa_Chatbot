#!/usr/bin/env bash
# Exit on error
set -o errexit

# Install Backend Dependencies
pip install -r backend/requirements.txt

# Build Frontend
cd frontend
npm install
npm run build
cd ..

# Move files if necessary or ensure backend can find them
# (We already configured main.py to look in frontend/dist)
