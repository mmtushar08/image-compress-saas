@echo off
setlocal
set "API_URL=http://localhost:5000"
set "TEST_IMAGE=test_quality_90.jpg"

echo === Starting API Tests with cURL ===
curl --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [FAIL] cURL is not found in PATH.
    exit /b 1
)

echo.
echo === Testing Check Limit Endpoint ===
curl -s "%API_URL%/api/check-limit"
echo.
if %ERRORLEVEL% EQU 0 (
    echo [PASS] Check Limit request sent
) else (
    echo [FAIL] Check Limit request failed
)

echo.
echo === Testing Image Compression ===
if not exist "%TEST_IMAGE%" (
    echo [FAIL] Test image not found: %TEST_IMAGE%
    exit /b 1
)

curl -s -X POST "%API_URL%/api/compress" ^
  -F "image=@%TEST_IMAGE%" ^
  -F "quality=80" ^
  -o compressed_curl_test.jpg ^
  -v 2> temp_curl_output.txt

if %ERRORLEVEL% EQU 0 (
    echo [PASS] Compression request sent
    echo [INFO] Check temp_curl_output.txt for headers
    findstr "X-Original-Size" temp_curl_output.txt
    findstr "X-Compressed-Size" temp_curl_output.txt
    findstr "X-Saved-Percent" temp_curl_output.txt
    del temp_curl_output.txt
) else (
    echo [FAIL] Compression request failed
)

echo.
echo === Tests Complete ===
