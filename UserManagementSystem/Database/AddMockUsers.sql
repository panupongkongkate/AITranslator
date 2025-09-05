-- เพิ่ม mock users 5 คน
USE UserManagementDB;
GO

-- Mock User: นักพัฒนา (รหัสผ่าน: somchai123)
INSERT INTO [dbo].[Users] ([Username], [Email], [Password], [RoleId]) VALUES
    (N'somchai', 'somchai@example.com', '$2a$12$v0KD8HuCkwLRPl/S8swqPOrcD3Rq./gJGM3dHBjQy5shEzXbu.O1K', 2);

-- Mock User: ผู้จัดการโครงการ (รหัสผ่าน: somying123)
INSERT INTO [dbo].[Users] ([Username], [Email], [Password], [RoleId]) VALUES
    (N'สมหญิง', 'somying@example.com', '$2a$12$DYCejwcF4DqzGDDT/zJ6MODKwCfswD.eMk.KaJYMM2TXYIYzJZnS2', 1);

-- Mock User: นักออกแบบ (รหัสผ่าน: design123)
INSERT INTO [dbo].[Users] ([Username], [Email], [Password], [RoleId]) VALUES
    (N'designer01', 'designer@example.com', '$2a$12$2YuDpfGY9K8vyOLFalvWLuRv2wL.RaRF7vYzew2foc0ZJDyLsXSE6', 2);

-- Mock User: ทดสอบระบบ (รหัสผ่าน: test123)
INSERT INTO [dbo].[Users] ([Username], [Email], [Password], [RoleId]) VALUES
    (N'tester_qa', 'tester@example.com', '$2a$12$ge4sz/NBBT4NGULsaYnTpO2HnE6qx4xzQ8UjylU77UUxzLIwT5Zcm', 2);

-- Mock User: ผู้ดูแลระบบ (รหัสผ่าน: natt123)
INSERT INTO [dbo].[Users] ([Username], [Email], [Password], [RoleId]) VALUES
    (N'ณัฐพล', 'nattapon@example.com', '$2a$12$yHbIF.GJOjo0wUsUY2PGvurmbtbDDdxeGTgiwiRu.oLzZ7AJ5d00G', 1);

GO

-- แสดงผลลัพธ์
SELECT 'Mock Users ที่ถูกเพิ่ม:' as [Result];
SELECT [Id], [Username], [Email],
       CASE [RoleId]
           WHEN 1 THEN 'Admin'
           WHEN 2 THEN 'User'
       END as [Role],
       [CreatedAt]
FROM [dbo].[Users]
ORDER BY [Id] DESC;
GO
