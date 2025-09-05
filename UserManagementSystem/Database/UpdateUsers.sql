-- SQL สำหรับ insert users ด้วยรหัสผ่านที่ hash ถูกต้อง
USE UserManagementDB;
GO

-- ลบ users เดิมก่อน
DELETE FROM [dbo].[Users];
GO

-- Reset IDENTITY
DBCC CHECKIDENT('Users', RESEED, 0);
GO

-- Admin user (รหัสผ่าน: admin123)
INSERT INTO [dbo].[Users] ([Username], [Email], [Password], [RoleId]) VALUES
    ('admin', 'admin@example.com', '$2a$12$owCpzMYdmbbG4z1dJbx6deX/J12IGLvB0EioT5bJqO98LwADqkpFu', 1);

-- User ทั่วไป (รหัสผ่าน: user123)
INSERT INTO [dbo].[Users] ([Username], [Email], [Password], [RoleId]) VALUES
    ('user', 'user@example.com', '$2a$12$ZvBxRJ0Eal8ktcP0Azw7FOPWIi5jZO6Ceea8wi.jv8u4XwbhmI24K', 2);

-- ทดสอบภาษาไทย - เพิ่ม user ที่มีชื่อภาษาไทย
-- User ภาษาไทย (รหัสผ่าน: ทดสอบ123)
INSERT INTO [dbo].[Users] ([Username], [Email], [Password], [RoleId]) VALUES
    (N'ผู้ใช้ทดสอบ', 'thai@example.com', '$2a$12$ra3Bf2DQX3MEjBfv4NaFG.sPm7wEQivn5QjWD/DXb1FhEfySExn3K', 2);
GO

SELECT 'Users ที่ถูกเพิ่ม:' as [Result];
SELECT [Id], [Username], [Email], [RoleId], [CreatedAt] FROM [dbo].[Users];
GO
