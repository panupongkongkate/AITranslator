# User Management API

ระบบ User Management API ที่สร้างด้วย ASP.NET Core Web API พร้อมระบบ JWT Authentication

## ข้อมูลเบื้องต้น

- **Framework**: ASP.NET Core Web API (.NET 9.0)
- **Database**: SQLite
- **Authentication**: JWT (JSON Web Token)
- **Password Hashing**: BCrypt
- **CORS**: รองรับ React frontend

## คุณสมบัติ

- ✅ Login/Register ปกติ
- ✅ Fast Login สำหรับทดสอบ (Admin/User)
- ✅ JWT Authentication
- ✅ Role-based Access Control (Admin/User)
- ✅ User CRUD Operations
- ✅ Password Hashing (BCrypt)
- ✅ CORS Support

## ข้อมูล Default Users

### Admin User
- **Username**: admin
- **Password**: admin123
- **Email**: admin@example.com
- **Role**: Admin

### Demo User
- **Username**: user
- **Password**: user123
- **Email**: user@example.com
- **Role**: User

## API Endpoints

### Authentication Endpoints

#### 1. Login ปกติ
```http
POST /api/auth/login
Content-Type: application/json

{
    "username": "admin",
    "password": "admin123"
}
```

#### 2. Register User ใหม่
```http
POST /api/auth/register
Content-Type: application/json

{
    "username": "newuser",
    "email": "newuser@example.com",
    "password": "password123",
    "role": "User"
}
```

#### 3. Fast Login (สำหรับทดสอบ)
```http
POST /api/auth/fast-login
Content-Type: application/json

{
    "userType": "admin"  // หรือ "user"
}
```

#### 4. Verify Token
```http
GET /api/auth/verify
Authorization: Bearer YOUR_JWT_TOKEN
```

### User Management Endpoints

#### 1. ดู Users ทั้งหมด (Admin only)
```http
GET /api/users
Authorization: Bearer ADMIN_JWT_TOKEN
```

#### 2. ดู User เฉพาะ (Admin หรือ own profile)
```http
GET /api/users/{id}
Authorization: Bearer JWT_TOKEN
```

#### 3. ดู Profile ตัวเอง
```http
GET /api/users/profile
Authorization: Bearer JWT_TOKEN
```

#### 4. อัปเดท User (Admin หรือ own profile)
```http
PUT /api/users/{id}
Authorization: Bearer JWT_TOKEN
Content-Type: application/json

{
    "username": "newusername",
    "email": "newemail@example.com",
    "password": "newpassword123",
    "role": "User"
}
```

#### 5. ลบ User (Admin only)
```http
DELETE /api/users/{id}
Authorization: Bearer ADMIN_JWT_TOKEN
```

## การรันโปรเจ็ค

1. **Clone/Download โปรเจ็ค**

2. **ติดตั้ง Dependencies**
   ```bash
   dotnet restore
   ```

3. **รันโปรเจ็ค**
   ```bash
   dotnet run
   ```

4. **เข้าถึง API**
   - URL: http://localhost:5245
   - API Documentation: http://localhost:5245/openapi/v1.json

## การใช้งานกับ Frontend

### CORS Configuration
API รองรับ CORS สำหรับ origins ต่อไปนี้:
- http://localhost:3000 (Create React App)
- http://localhost:5173 (Vite)
- http://127.0.0.1:3000
- http://127.0.0.1:5173

### JWT Token Usage
1. เรียก API Login/Register/Fast-Login เพื่อรับ JWT token
2. ใส่ token ใน Authorization header: `Bearer YOUR_JWT_TOKEN`
3. Token มีอายุ 24 ชั่วโมง

## Database

- ใช้ SQLite database (`usermanagement.db`)
- Database จะถูกสร้างอัตโนมัติเมื่อรันโปรเจ็คครั้งแรก
- มี default users 2 คน (admin และ user) พร้อมใช้งาน

## ตัวอย่างการใช้งานด้วย curl

### Fast Login Admin
```bash
curl -X POST "http://localhost:5245/api/auth/fast-login" \
     -H "Content-Type: application/json" \
     -d '{"userType": "admin"}'
```

### ดู Users ทั้งหมด (ต้องใช้ Admin token)
```bash
curl -X GET "http://localhost:5245/api/users" \
     -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

### Register User ใหม่
```bash
curl -X POST "http://localhost:5245/api/auth/register" \
     -H "Content-Type: application/json" \
     -d '{
         "username": "testuser",
         "email": "test@example.com",
         "password": "password123",
         "role": "User"
     }'
```

## Security Features

- ✅ Password hashing ด้วย BCrypt
- ✅ JWT Token validation
- ✅ Role-based authorization
- ✅ Input validation
- ✅ Unique username/email constraints
- ✅ Safe error handling

## โครงสร้างโปรเจ็ค

```
UserManagementAPI/
├── Controllers/
│   ├── AuthController.cs      # Login, Register, Fast Login
│   └── UsersController.cs     # CRUD operations
├── Data/
│   └── ApplicationDbContext.cs # Entity Framework Context
├── Models/
│   ├── User.cs               # User entity
│   ├── LoginRequest.cs       # Login request model
│   ├── RegisterRequest.cs    # Register request model
│   ├── AuthResponse.cs       # Auth response model
│   └── FastLoginRequest.cs   # Fast login request model
├── Services/
│   ├── IAuthService.cs       # Auth service interface
│   └── AuthService.cs        # Auth service implementation
├── Program.cs                # Application configuration
├── appsettings.json          # Configuration settings
└── UserManagementAPI.csproj  # Project file
```

---

🎉 **API พร้อมใช้งานแล้ว!** สามารถเชื่อมต่อกับ React frontend ได้ทันที