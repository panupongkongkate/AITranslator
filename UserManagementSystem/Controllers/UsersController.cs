using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using UserManagementAPI.Data;
using UserManagementAPI.Models;
using UserManagementAPI.Services;

namespace UserManagementAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class UsersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IAuthService _authService;
        private readonly ILogger<UsersController> _logger;

        public UsersController(ApplicationDbContext context, IAuthService authService, ILogger<UsersController> logger)
        {
            _context = context;
            _authService = authService;
            _logger = logger;
        }

        // GET: api/users - Admin only
        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<object>>> GetUsers()
        {
            try
            {
                var users = await _context.Users
                    .Select(u => new
                    {
                        u.Id,
                        u.Username,
                        u.Email,
                        u.Role,
                        u.CreatedAt,
                        u.UpdatedAt
                    })
                    .ToListAsync();

                return Ok(users);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving users");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        // GET: api/users/{id} - Admin or own profile
        [HttpGet("{id}")]
        public async Task<ActionResult<object>> GetUser(int id)
        {
            try
            {
                var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
                var currentUserRole = User.FindFirst(ClaimTypes.Role)?.Value;

                // Allow access if user is admin or accessing their own profile
                if (currentUserRole != "Admin" && currentUserId != id)
                {
                    return Forbid();
                }

                var user = await _context.Users.FindAsync(id);
                
                if (user == null)
                {
                    return NotFound();
                }

                var userResponse = new
                {
                    user.Id,
                    user.Username,
                    user.Email,
                    user.Role,
                    user.CreatedAt,
                    user.UpdatedAt
                };

                return Ok(userResponse);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving user {UserId}", id);
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        // PUT: api/users/{id} - Admin or own profile
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, [FromBody] UpdateUserRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
                var currentUserRole = User.FindFirst(ClaimTypes.Role)?.Value;

                // Allow access if user is admin or updating their own profile
                if (currentUserRole != "Admin" && currentUserId != id)
                {
                    return Forbid();
                }

                var user = await _context.Users.FindAsync(id);
                
                if (user == null)
                {
                    return NotFound();
                }

                // Prevent editing default system users' core properties (id 1 = admin, id 2 = user)
                if (id == 1 || id == 2)
                {
                    // For default users, only allow password changes if it's their own profile
                    if (currentUserId == id && !string.IsNullOrEmpty(request.Password))
                    {
                        user.Password = _authService.HashPassword(request.Password);
                        user.UpdatedAt = DateTime.UtcNow;
                        await _context.SaveChangesAsync();
                        _logger.LogInformation($"Password updated for default user {user.Username}");
                        return NoContent();
                    }
                    else
                    {
                        return BadRequest(new { message = "Cannot modify default system users" });
                    }
                }

                // Check if username is taken by another user
                if (!string.IsNullOrEmpty(request.Username) && request.Username != user.Username)
                {
                    var existingUser = await _context.Users
                        .FirstOrDefaultAsync(u => u.Username == request.Username && u.Id != id);
                    if (existingUser != null)
                    {
                        return BadRequest(new { message = "Username already exists" });
                    }
                    user.Username = request.Username;
                }

                // Check if email is taken by another user
                if (!string.IsNullOrEmpty(request.Email) && request.Email != user.Email)
                {
                    var existingUser = await _context.Users
                        .FirstOrDefaultAsync(u => u.Email == request.Email && u.Id != id);
                    if (existingUser != null)
                    {
                        return BadRequest(new { message = "Email already exists" });
                    }
                    user.Email = request.Email;
                }

                // Update password if provided
                if (!string.IsNullOrEmpty(request.Password))
                {
                    user.Password = _authService.HashPassword(request.Password);
                }

                // Only admins can change roles
                if (!string.IsNullOrEmpty(request.Role) && currentUserRole == "Admin")
                {
                    user.Role = request.Role;
                }

                user.UpdatedAt = DateTime.UtcNow;
                await _context.SaveChangesAsync();

                _logger.LogInformation($"User {user.Username} updated successfully");
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating user {UserId}", id);
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        // DELETE: api/users/{id} - Admin only
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            try
            {
                var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
                
                // Prevent admin from deleting themselves
                if (currentUserId == id)
                {
                    return BadRequest(new { message = "Cannot delete your own account" });
                }

                var user = await _context.Users.FindAsync(id);
                
                if (user == null)
                {
                    return NotFound();
                }

                // Prevent deleting default system users (id 1 = admin, id 2 = user)
                if (id == 1 || id == 2)
                {
                    return BadRequest(new { message = "Cannot delete default system users" });
                }

                _context.Users.Remove(user);
                await _context.SaveChangesAsync();

                _logger.LogInformation($"User {user.Username} deleted successfully");
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting user {UserId}", id);
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        // GET: api/users/profile - Get current user profile
        [HttpGet("profile")]
        public async Task<ActionResult<object>> GetProfile()
        {
            try
            {
                var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
                
                var user = await _context.Users.FindAsync(currentUserId);
                
                if (user == null)
                {
                    return NotFound();
                }

                var userResponse = new
                {
                    user.Id,
                    user.Username,
                    user.Email,
                    user.Role,
                    user.CreatedAt,
                    user.UpdatedAt
                };

                return Ok(userResponse);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving user profile");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }
    }

    public class UpdateUserRequest
    {
        public string? Username { get; set; }
        public string? Email { get; set; }
        public string? Password { get; set; }
        public string? Role { get; set; }
    }
}