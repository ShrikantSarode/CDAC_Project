using GroomEasyAPI.Data;
using GroomEasyAPI.DTOs;
using GroomEasyAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;

namespace GroomEasyAPI.Controllers.Admin
{
    [Route("api/staff")]
    [ApiController]
    public class StaffManagementController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public StaffManagementController(ApplicationDbContext context)
        {
            _context = context;
        }

        // ✅ GET: Fetch All Staff Members
        [HttpGet]
        public async Task<IActionResult> GetAllStaff()
        {
            var staffList = await _context.Staff
                .Include(s => s.User) // ✅ Ensure User details are fetched
                .Select(s => new StaffDTO
                {
                    Id = s.Id,
                    Name = s.Name,
                    Email = s.Email,
                    Phone = s.Phone
                })
                .ToListAsync();

            return Ok(staffList);
        }

        // ✅ POST: Add Staff Member
        [HttpPost]
        public async Task<IActionResult> AddStaff([FromBody] StaffCreateDTO staffDto)
        {
            if (staffDto == null || staffDto.UserId == 0 || string.IsNullOrEmpty(staffDto.Name) ||
                string.IsNullOrEmpty(staffDto.Email) || string.IsNullOrEmpty(staffDto.PhoneNumber))
            {
                return BadRequest(new { message = "Invalid staff data: Name, Email, Phone, and UserId are required." });
            }

            // ✅ Ensure User Exists
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == staffDto.UserId);
            if (user == null)
            {
                return BadRequest(new { message = "User does not exist!" });
            }

            // ✅ Ensure Staff doesn't already exist
            bool staffExists = await _context.Staff.AnyAsync(s => s.UserId == staffDto.UserId);
            if (staffExists)
            {
                return Conflict(new { message = "Staff member already exists!" });
            }

            // ✅ Fix: Explicitly use GroomEasyAPI.Models.Staff
            var staff = new GroomEasyAPI.Models.Staff
            {
                Name = staffDto.Name,
                Email = staffDto.Email,
                Phone = staffDto.PhoneNumber,
                UserId = staffDto.UserId
            };

            _context.Staff.Add(staff);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Staff member added successfully!", staff });
        }


        // ✅ DELETE: Remove Staff Member
        [HttpDelete("{staffId}")]
        public async Task<IActionResult> RemoveStaff(int staffId)
        {
            var staff = await _context.Staff
                .Include(s => s.Appointments)
                .FirstOrDefaultAsync(s => s.Id == staffId);

            if (staff == null)
                return NotFound(new { message = "Staff member not found!" });

            var hasPendingAppointments = staff.Appointments?.Any(a => a.Status == "pending") ?? false;
            if (hasPendingAppointments)
            {
                return BadRequest(new { message = "Cannot delete staff with pending appointments!" });
            }

            _context.Staff.Remove(staff);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Staff member removed successfully!" });
        }
    }
}
