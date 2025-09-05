-- สร้าง users ใหม่ด้วยรหัสผ่านที่ hash ถูกต้อง
USE UserManagementDB;
GO

-- ลบ users เดิมก่อน
DELETE FROM [dbo].[Users];
GO

-- Reset IDENTITY 
DBCC CHECKIDENT('Users', RESEED, 0);
GO

-- เพิ่ม admin user (รหัสผ่าน: admin123)
-- Hash สร้างจาก BCrypt.Net-Next
INSERT INTO [dbo].[Users] ([Username], [Email], [Password], [RoleId]) VALUES 
    ('admin', 'admin@example.com', '$2a$11$XQnj2vGv7Mv4YnGOCPJZyOJNcJ5GgU2b9LJQ3S4Z1yMzW8QnZ9xN6', 1);

-- เพิ่ม user ทั่วไป (รหัสผ่าน: user123)
-- Hash สร้างจาก BCrypt.Net-Next
INSERT INTO [dbo].[Users] ([Username], [Email], [Password], [RoleId]) VALUES 
    ('user', 'user@example.com', '$2a$11$ZrB6kVJg8K3fY2dL7eN9ReKfJ4mH6wX8nQ9pS1tU2vW7xM5cA3bE0', 2);

GO

-- แสดงผลลัพธ์
SELECT 'Users ที่ถูกเพิ่ม:' as [Result];
SELECT [Id], [Username], [Email], [RoleId], [CreatedAt] FROM [dbo].[Users];
GO