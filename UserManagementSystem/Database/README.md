# Database Setup - SQL Server Migration

## สรุปการเปลี่ยนแปลง

### 1. การเปลี่ยน Database Provider
- **เดิม**: SQLite (`UseSqlite`)
- **ใหม่**: SQL Server (`UseSqlServer`)

### 2. Connection String
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=UserManagementDB;Integrated Security=true;TrustServerCertificate=true;"
  }
}
```

### 3. Package Dependencies ที่มี
- ✅ `Microsoft.EntityFrameworkCore.SqlServer` Version="9.0.8"
- ✅ `Microsoft.EntityFrameworkCore.Tools` Version="9.0.8"

### 4. Database First Approach
โปรเจคนี้ใช้ **Database First** approach ดังนั้น:
- ฐานข้อมูลและตารางจะสร้างด้วย SQL Script ก่อน
- Entity Framework จะ map กับ schema ที่มีอยู่แล้ว
- ไม่ใช้ Code First Migrations

## ขั้นตอนการตั้งค่าฐานข้อมูล

### 1. เตรียม SQL Server
- ตรวจสอบว่า SQL Server Instance ทำงานอยู่ที่ `localhost`
- ใช้ Windows Authentication (Integrated Security=true)

### 2. สร้างฐานข้อมูล
```bash
# วิธีที่ 1: ใช้ .bat file
cd Database
RunScript.bat

# วิธีที่ 2: ใช้ sqlcmd โดยตรง
sqlcmd -S localhost -E -i "CreateDatabase.sql"
```

### 3. ตรวจสอบการสร้าง
Script จะสร้าง:
- Database: `UserManagementDB`
- Table: `Roles` (2 default roles: Admin, User)
- Table: `Users` (1 default admin user)
- Indexes และ Foreign Keys ตาม schema

## ตารางที่สร้าง

### Roles Table
| Column | Type | Description |
|--------|------|-------------|
| Id | int IDENTITY | Primary Key |
| Name | nvarchar(50) | Role name (unique) |
| Description | nvarchar(200) | Role description |
| CreatedAt | datetime2 | Creation timestamp |

### Users Table
| Column | Type | Description |
|--------|------|-------------|
| Id | int IDENTITY | Primary Key |
| Username | nvarchar(50) | Username (unique) |
| Email | nvarchar(100) | Email (unique) |
| Password | nvarchar(MAX) | Hashed password |
| RoleId | int | Foreign key to Roles |
| CreatedAt | datetime2 | Creation timestamp |
| UpdatedAt | datetime2 | Update timestamp |

## Default Data

### Default Roles
1. **Admin** - ผู้ดูแลระบบ - สามารถจัดการผู้ใช้ทั้งหมดได้
2. **User** - ผู้ใช้ทั่วไป - สามารถจัดการข้อมูลของตนเองได้

### Default Admin User
- **Username**: admin
- **Email**: admin@example.com  
- **Password**: admin123
- **Role**: Admin

## การทดสอบ

1. **Build Project**:
```bash
dotnet build
```

2. **Run Application**:
```bash
dotnet run
```

3. **Test Database Connection**:
- เข้า Swagger UI ที่ `/swagger`
- ทดสอบ API endpoints
- ทดลอง login ด้วย admin/admin123

## หมายเหตุสำคัญ

⚠️ **Database First Approach**
- ห้าม run `dotnet ef migrations add` หรือ `dotnet ef database update`
- การเปลี่ยนแปลง schema ต้องทำที่ database โดยตรง
- หาก schema เปลี่ยน ต้องอัปเดต Model classes และ DbContext ให้ตรงกัน

⚠️ **Security**
- เปลี่ยนรหัสผ่าน admin เริ่มต้นในสภาพแวดล้อม production
- ใช้ connection string ที่เหมาะสมสำหรับแต่ละ environment