# Mock Users สำหรับทดสอบระบบ

## รายชื่อ Users ทั้งหมด (8 users)

### Admin Users (3 คน)
| Username | Email | Password | Role | คำอธิบาย |
|----------|-------|----------|------|----------|
| admin | admin@example.com | admin123 | Admin | ผู้ดูแลระบบหลัก |
| สมหญิง | somying@example.com | somying123 | Admin | ผู้จัดการโครงการ |
| ณัฐพล | nattapon@example.com | natt123 | Admin | ผู้ดูแลระบบ |

### Regular Users (5 คน)
| Username | Email | Password | Role | คำอธิบาย |
|----------|-------|----------|------|----------|
| user | user@example.com | user123 | User | ผู้ใช้ทั่วไป |
| somchai | somchai@example.com | somchai123 | User | นักพัฒนา |
| designer01 | designer@example.com | design123 | User | นักออกแบบ |
| tester_qa | tester@example.com | test123 | User | ทดสอบระบบ |
| ผู้ใช้ทดสอบ | thai@example.com | ทดสอบ123 | User | ทดสอบภาษาไทย |

## วิธีทดสอบ Login

### ทดสอบผ่าน curl
```bash
# Admin login
curl -X POST http://localhost:5245/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"admin\",\"password\":\"admin123\"}"

# User login  
curl -X POST http://localhost:5245/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"somchai\",\"password\":\"somchai123\"}"
```

### ทดสอบผ่าน Swagger UI
1. เปิด browser ไปที่ `http://localhost:5245/swagger`
2. ไปที่ section **Auth**
3. คลิก **POST /api/auth/login**
4. คลิก **Try it out**
5. ใส่ username และ password
6. คลิก **Execute**

## สิทธิ์การเข้าถึง

### Admin สามารถ:
- ดูข้อมูลผู้ใช้ทั้งหมด (GET /api/users)
- แก้ไขข้อมูลผู้ใช้ทุกคน (PUT /api/users/{id})
- ลบผู้ใช้ (DELETE /api/users/{id})
- จัดการ roles

### User สามารถ:
- ดูข้อมูลตนเอง (GET /api/users/profile)
- แก้ไขข้อมูลตนเอง (PUT /api/users/{id})
- ไม่สามารถดูข้อมูลผู้อื่น

## หมายเหตุ
- รหัสผ่านทั้งหมดถูก hash ด้วย BCrypt (12 rounds)
- ระบบรองรับภาษาไทย (UTF-8, Thai_CI_AS collation)
- JWT token หมดอายุใน 24 ชั่วโมง