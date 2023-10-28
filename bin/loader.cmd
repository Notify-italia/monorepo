git status
git pull

@echo off
set /p update=Do you want to update the dependencies? (y/n)
if %update%==y (
    call update-deps.cmd
)

start ./server.cmd
start ./agent.cmd