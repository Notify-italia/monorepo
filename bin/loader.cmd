git status
git pull

REM write a question to update the dependencies and if the user says yes, then run update-deps.cmd
REM if the user says no, then continue

@echo off
set /p update=Do you want to update the dependencies? (y/n)
if %update%==y (
    call ./update-deps.cmd
) else (
    echo "Skipping dependency update"
)

start ./server.cmd
start ./agent.cmd