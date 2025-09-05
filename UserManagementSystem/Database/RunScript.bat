@echo off
echo สร้างฐานข้อมูล UserManagementDB...
sqlcmd -S localhost -E -i "CreateDatabase.sql"
if %ERRORLEVEL% == 0 (
    echo ฐานข้อมูลถูกสร้างสำเร็จ!
) else (
    echo เกิดข้อผิดพลาดในการสร้างฐานข้อมูล
)
pause