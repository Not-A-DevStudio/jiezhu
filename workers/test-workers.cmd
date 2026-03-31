@echo off
setlocal

REM 1) 改成你的 Workers 对外地址（必须包含 /chat/completion）
set WORKER_URL=https://jiezhu.3024826049.workers.dev/chat/completion
REM 2) 伪装前端来源：Origin + Referer
set FRONTEND_ORIGIN=https://not-a-devstudio.github.io
set FRONTEND_REFERER=https://not-a-devstudio.github.io/jiezhu/#/demo

echo Calling: %WORKER_URL%
echo Origin: %FRONTEND_ORIGIN%
echo Referer: %FRONTEND_REFERER%
echo.

curl -i -X POST "%WORKER_URL%" ^
  -H "Origin: %FRONTEND_ORIGIN%" ^
  -H "Referer: %FRONTEND_REFERER%" ^
  -H "Content-Type: application/json" ^
  --data "{\"model\":\"@cf/meta/llama-3.1-8b-instruct\",\"messages\":[{\"role\":\"system\",\"content\":\"this will be replaced by worker\"},{\"role\":\"user\",\"content\":\"你好，帮我做个测试\"}]}"

echo.
echo Done.
pause
endlocal


curl -v -X OPTIONS "https://jiezhu.3024826049.workers.dev/chat/completions" -H "Origin: https://not-a-devstudio.github.io" -H "Referer: https://not-a-devstudio.github.io/jiezhu/#/demo"