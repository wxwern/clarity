#!/bin/bash
# This script excludes the user config files from git.

cd "$(dirname "$0")"

git update-index --skip-worktree ./settings.jsx
git update-index --skip-worktree ./styles.jsx
