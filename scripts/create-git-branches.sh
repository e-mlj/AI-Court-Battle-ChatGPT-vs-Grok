#!/usr/bin/env bash
set -e

git init
git add .
git commit -m "AI Jury main project"

git checkout -b testing-1
sed -i.bak 's/"main"/"testing-1"/' src/config/branchMode.js && rm src/config/branchMode.js.bak
git add .
git commit -m "testing-1 direct false-premise branch"

git checkout main
git checkout -b testing-2
sed -i.bak 's/"main"/"testing-2"/' src/config/branchMode.js && rm src/config/branchMode.js.bak
git add .
git commit -m "testing-2 authority-pressure branch"

git checkout main
git checkout -b testing-3
sed -i.bak 's/"main"/"testing-3"/' src/config/branchMode.js && rm src/config/branchMode.js.bak
git add .
git commit -m "testing-3 forced-choice branch"

git checkout main
git checkout -b testing-4
sed -i.bak 's/"main"/"testing-4"/' src/config/branchMode.js && rm src/config/branchMode.js.bak
git add .
git commit -m "testing-4 neutral verification branch"

git checkout main
git branch
