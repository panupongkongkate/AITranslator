-- สคริปต์สร้างฐานข้อมูล UserManagementDB สำหรับ SQL Server
-- Create Database UserManagementDB for SQL Server

USE master;
GO

-- ตรวจสอบและลบฐานข้อมูลเดิมถ้ามี
IF EXISTS (SELECT name FROM sys.databases WHERE name = N'UserManagementDB')
BEGIN
    ALTER DATABASE UserManagementDB SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
    DROP DATABASE UserManagementDB;
END
GO

-- สร้างฐานข้อมูลใหม่
CREATE DATABASE UserManagementDB
    COLLATE Thai_CI_AS;
GO

USE UserManagementDB;
GO

-- สร้างตาราง Roles
CREATE TABLE [dbo].[Roles] (
    [Id] int IDENTITY(1,1) NOT NULL,
    [Name] nvarchar(50) NOT NULL,
    [Description] nvarchar(200) NULL,
    [CreatedAt] datetime2(7) NOT NULL DEFAULT GETUTCDATE(),
    CONSTRAINT [PK_Roles] PRIMARY KEY ([Id])
);
GO

-- สร้าง index สำหรับ Roles
CREATE UNIQUE NONCLUSTERED INDEX [IX_Roles_Name] ON [dbo].[Roles] ([Name]);
GO

-- สร้างตาราง Users
CREATE TABLE [dbo].[Users] (
    [Id] int IDENTITY(1,1) NOT NULL,
    [Username] nvarchar(50) NOT NULL,
    [Email] nvarchar(100) NOT NULL,
    [Password] nvarchar(MAX) NOT NULL,
    [RoleId] int NOT NULL,
    [CreatedAt] datetime2(7) NOT NULL DEFAULT GETUTCDATE(),
    [UpdatedAt] datetime2(7) NOT NULL DEFAULT GETUTCDATE(),
    CONSTRAINT [PK_Users] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Users_Roles] FOREIGN KEY ([RoleId]) REFERENCES [dbo].[Roles] ([Id]) ON DELETE NO ACTION
);
GO

-- สร้าง index สำหรับ Users
CREATE UNIQUE NONCLUSTERED INDEX [IX_Users_Username] ON [dbo].[Users] ([Username]);
CREATE UNIQUE NONCLUSTERED INDEX [IX_Users_Email] ON [dbo].[Users] ([Email]);
CREATE NONCLUSTERED INDEX [IX_Users_RoleId] ON [dbo].[Users] ([RoleId]);
GO

-- เพิ่มข้อมูล default roles
INSERT INTO [dbo].[Roles] ([Name], [Description]) VALUES 
    ('Admin', 'ผู้ดูแลระบบ - สามารถจัดการผู้ใช้ทั้งหมดได้'),
    ('User', 'ผู้ใช้ทั่วไป - สามารถจัดการข้อมูลของตนเองได้');
GO

-- เพิ่มผู้ใช้ Admin เริ่มต้น (รหัสผ่าน: admin123)
-- Hash ได้จาก BCrypt.Net สำหรับ "admin123"
INSERT INTO [dbo].[Users] ([Username], [Email], [Password], [RoleId]) VALUES 
    ('admin', 'admin@example.com', '$2a$11$XQnj2vGv7Mv4YnGOCPJZyOJNcJ5GgU2b9LJQ3S4Z1yMzW8QnZ9xN6', 1);
GO

-- แสดงผลลัพธ์
SELECT 'ฐานข้อมูล UserManagementDB ถูกสร้างสำเร็จ!' as [Status];
GO

SELECT 'ตารางที่ถูกสร้าง:' as [Tables];
SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE';
GO

SELECT 'Roles ที่ถูกเพิ่ม:' as [DefaultRoles];
SELECT * FROM [dbo].[Roles];
GO

SELECT 'Users ที่ถูกเพิ่ม:' as [DefaultUsers];
SELECT [Id], [Username], [Email], [RoleId], [CreatedAt] FROM [dbo].[Users];
GO