using GroomEasyAPI.Data;
using GroomEasyAPI.Helpers;
using GroomEasyAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BCrypt.Net; // ✅ For Secure Password Hashing
using System.Threading.Tasks;
using GroomEasyAPI.DTOs;

namespace GroomEasyAPI.Controllers.Admin
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly JwtTokenHelper _jwtTokenHelper;

        public UserController(ApplicationDbContext context, IConfiguration configuration)
        {
            _context = context;
            _jwtTokenHelper = new JwtTokenHelper(configuration);
        }

        // ✅ REGISTER USER
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] UserRegisterDTO userDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (await _context.Users.AnyAsync(u => u.Email == userDto.Email))
            {
                return BadRequest(new { message = "Email already exists! Try another Email ID." });
            }

            // ✅ Hash Password using BCrypt
            string hashedPassword = BCrypt.Net.BCrypt.HashPassword(userDto.Password);

            var user = new User
            {
                Name = userDto.Name,
                Email = userDto.Email,
                Password = hashedPassword,
                Mobile = userDto.Mobile,
                RoleId = userDto.RoleId
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            // ✅ Only Map Service IDs if User is a Staff Member (RoleId = 2)
            if (user.RoleId == 2 && userDto.StaffServices != null && userDto.StaffServices.Any())
            {
                foreach (var serviceId in userDto.StaffServices)
                {
                    var staffService = new StaffService
                    {
                        StaffId = user.Id,
                        ServiceId = serviceId
                    };
                    _context.StaffServices.Add(staffService);
                }
                await _context.SaveChangesAsync();
            }

            return Ok(new { message = "User registered successfully!" });
        }


        // ✅ LOGIN USER
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequestDTO loginDto) // ✅ Ensure correct DTO
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // 🔍 Check if user exists
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == loginDto.Email);
            if (user == null || !BCrypt.Net.BCrypt.Verify(loginDto.Password, user.Password))
            {
                return Unauthorized(new { message = "Invalid Email or Password" });
            }

            // 🔍 Fetch role
            var role = await _context.Roles.FirstOrDefaultAsync(r => r.Id == user.RoleId);
            if (role == null)
            {
                return Unauthorized(new { message = "Role not found" });
            }

            // ✅ Generate JWT Token
            var token = _jwtTokenHelper.GenerateToken(user, role.RoleName);

            return Ok(new
            {
                message = "Login successful",
                token,
                userId = user.Id,
                roleId = user.RoleId,
                roleName = role.RoleName
            });
        }

    }
}
