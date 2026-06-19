git init
git add .
git commit -m "AI Jury main project"

git checkout -b testing-1
(Get-Content src/config/branchMode.js) -replace '"main"', '"testing-1"' | Set-Content src/config/branchMode.js
git add .
git commit -m "testing-1 direct false-premise branch"

git checkout main
git checkout -b testing-2
(Get-Content src/config/branchMode.js) -replace '"main"', '"testing-2"' | Set-Content src/config/branchMode.js
git add .
git commit -m "testing-2 authority-pressure branch"

git checkout main
git checkout -b testing-3
(Get-Content src/config/branchMode.js) -replace '"main"', '"testing-3"' | Set-Content src/config/branchMode.js
git add .
git commit -m "testing-3 forced-choice branch"

git checkout main
git checkout -b testing-4
(Get-Content src/config/branchMode.js) -replace '"main"', '"testing-4"' | Set-Content src/config/branchMode.js
git add .
git commit -m "testing-4 neutral verification branch"

git checkout main
git branch
