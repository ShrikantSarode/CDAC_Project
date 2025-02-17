using GroomEasyAPI.Data;
using GroomEasyAPI.Models;
using GroomEasyAPI.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GroomEasyAPI.Controllers.Admin
{
    [Route("api/AssignServices")]
    [ApiController]
    //[Authorize(AuthenticationSchemes = "Bearer", Roles = "Admin")] // 🔒 Secure API for Admins
    public class AssignServicesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AssignServicesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // ✅ GET: Fetch All Staff with Assigned Services
        [HttpGet("staff")]
        public async Task<IActionResult> GetAllStaffWithServices()
        {
            var staffList = await _context.Users
                .Where(u => u.RoleId == 2) // RoleId = 2 for Staff
                .Select(u => new
                {
                    u.Id,
                    u.Name,
                    Expertise = _context.StaffServices
                        .Where(ss => ss.StaffId == u.Id)
                        .Select(ss => ss.Service.Name) // Ensure Service Name is retrieved
                        .ToList()
                })
                .ToListAsync();

            return Ok(staffList);
        }

        // ✅ GET: Fetch All Services
        [HttpGet("services")]
        public async Task<IActionResult> GetAllServices()
        {
            var services = await _context.Services
                .Select(s => new { s.Id, s.Name, s.Duration, s.Price })
                .ToListAsync();

            return Ok(services);
        }

        // ✅ POST: Assign Services to Staff
        [HttpPost("assign")]
        public async Task<IActionResult> AssignServicesToStaff([FromBody] AssignServiceDto assignServiceDto)
        {
            if (assignServiceDto == null || assignServiceDto.StaffId == 0 || assignServiceDto.ServiceIds.Count == 0)
                return BadRequest(new { message = "Invalid input data. StaffId and ServiceIds are required." });

            var staff = await _context.Users.FindAsync(assignServiceDto.StaffId);
            if (staff == null || staff.RoleId != 2) // Ensure the user is a staff member
                return NotFound(new { message = "Staff member not found." });

            // ✅ Fetch existing assignments
            var existingServiceIds = await _context.StaffServices
                .Where(ss => ss.StaffId == assignServiceDto.StaffId)
                .Select(ss => ss.ServiceId)
                .ToListAsync();

            // ✅ Add only new services (skip existing ones)
            var newServiceIds = assignServiceDto.ServiceIds.Except(existingServiceIds).ToList();

            if (newServiceIds.Count == 0)
                return Ok(new { message = "No new services assigned. All services already exist." });

            foreach (var serviceId in newServiceIds)
            {
                var service = await _context.Services.FindAsync(serviceId);
                if (service != null)
                {
                    _context.StaffServices.Add(new StaffService
                    {
                        StaffId = assignServiceDto.StaffId,
                        ServiceId = serviceId
                    });
                }
            }

            await _context.SaveChangesAsync();
            return Ok(new { message = "New services assigned successfully!" });
        }


        // ✅ DELETE: Remove Assigned Service from Staff
        [HttpDelete("remove")]
        public async Task<IActionResult> RemoveAssignedService([FromBody] RemoveServiceDto removeServiceDto)
        {
            if (removeServiceDto == null || removeServiceDto.StaffId <= 0 || removeServiceDto.ServiceId <= 0)
                return BadRequest(new { message = "Invalid request data." });

            var assignment = await _context.StaffServices
                .FirstOrDefaultAsync(ss => ss.StaffId == removeServiceDto.StaffId && ss.ServiceId == removeServiceDto.ServiceId);

            if (assignment == null)
                return NotFound(new { message = "Service assignment not found." });

            _context.StaffServices.Remove(assignment);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Service removed successfully!" });
        }
    }
}
