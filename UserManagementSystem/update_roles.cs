// สำหรับรันผ่าน dotnet run หรือ dotnet build
// ใส่ code นี้ใน Program.cs ชั่วคราวเพื่ออัพเดท Roles

/*
// เพิ่มใน Program.cs หลัง app.Run();
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    
    // อัพเดท Roles
    var adminRole = context.Roles.FirstOrDefault(r => r.Name == "Admin");
    var userRole = context.Roles.FirstOrDefault(r => r.Name == "User");
    
    if (adminRole != null)
    {
        adminRole.Description = "System Administrator - Can manage all users and settings";
    }
    
    if (userRole != null)
    {
        userRole.Description = "Regular User - Can manage own profile and use basic features";
    }
    
    // ลบผู้ใช้ที่มีปัญหา encoding
    var corruptedUsers = context.Users.Where(u => u.Id > 2).ToList();
    context.Users.RemoveRange(corruptedUsers);
    
    context.SaveChanges();
    Console.WriteLine("Database updated successfully!");
}
*/