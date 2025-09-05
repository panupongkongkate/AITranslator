using Microsoft.AspNetCore.Mvc;
using UserManagementAPI.Models;
using UserManagementAPI.Services;

namespace UserManagementAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly ILogger<AuthController> _logger;

        public AuthController(IAuthService authService, ILogger<AuthController> logger)
        {
            _authService = authService;
            _logger = logger;
        }

        [HttpPost("login")]
        public async Task<ActionResult<AuthResponse>> Login([FromBody] LoginRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var user = await _authService.AuthenticateAsync(request.Username, request.Password);
                
                if (user == null)
                {
                    return Unauthorized(new { message = "Invalid username or password" });
                }

                var token = _authService.GenerateJwtToken(user);
                var response = new
                {
                    Id = user.Id,
                    Username = user.Username,
                    Email = user.Email,
                    Role = new 
                    {
                        Id = user.Role.Id,
                        Name = user.Role.Name,
                        Description = user.Role.Description
                    },
                    Token = token,
                    ExpiresAt = DateTime.UtcNow.AddHours(24)
                };

                _logger.LogInformation($"User {user.Username} logged in successfully");
                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during login");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        [HttpPost("register")]
        public async Task<ActionResult<AuthResponse>> Register([FromBody] RegisterRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                // Only allow Admin role registration by existing Admins
                // For now, allow any role for demo purposes
                if (request.RoleId == 0)
                {
                    request.RoleId = 2; // Default to User role
                }

                var user = await _authService.RegisterAsync(request);
                if (user == null)
                {
                    return BadRequest(new { message = "Registration failed" });
                }
                var token = _authService.GenerateJwtToken(user);

                var response = new
                {
                    Id = user.Id,
                    Username = user.Username,
                    Email = user.Email,
                    Role = new 
                    {
                        Id = user.Role.Id,
                        Name = user.Role.Name,
                        Description = user.Role.Description
                    },
                    Token = token,
                    ExpiresAt = DateTime.UtcNow.AddHours(24)
                };

                _logger.LogInformation($"User {user.Username} registered successfully");
                return CreatedAtAction(nameof(Register), new { id = user.Id }, response);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during registration");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }


        [HttpGet("verify")]
        public IActionResult VerifyToken()
        {
            // This endpoint can be used to verify if the current JWT token is valid
            // The JWT middleware will automatically validate the token
            var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            var usernameClaim = User.FindFirst(System.Security.Claims.ClaimTypes.Name)?.Value;
            var roleClaim = User.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value;

            if (string.IsNullOrEmpty(userIdClaim))
            {
                return Unauthorized();
            }

            return Ok(new 
            { 
                message = "Token is valid",
                userId = userIdClaim,
                username = usernameClaim,
                role = roleClaim
            });
        }
    }
}