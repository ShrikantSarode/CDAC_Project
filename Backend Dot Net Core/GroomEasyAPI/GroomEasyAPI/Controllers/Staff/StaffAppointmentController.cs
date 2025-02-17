using GroomEasyAPI.Data;
using GroomEasyAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace GroomEasyAPI.Controllers
{
    [Route("api/staff/appointments")]
    [ApiController]
    //[Authorize(AuthenticationSchemes = "Bearer", Roles = "Staff")] // 🔒 Restrict Access
    public class StaffAppointmentController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public StaffAppointmentController(ApplicationDbContext context)
        {
            _context = context;
        }

        // ✅ GET: Fetch Appointments Assigned to Staff
        [HttpGet("{staffId}")]
        public async Task<IActionResult> GetStaffAppointments(int staffId)
        {
            var appointments = await _context.Appointments
     .Include(a => a.Customer)
     .Include(a => a.AppointmentServices)
     .ThenInclude(asv => asv.Service) // ✅ Fetch multiple services per appointment
     .Where(a => a.StaffId == staffId)
     .OrderByDescending(a => a.AppointmentDate)
     .Select(a => new
     {
         a.Id,
         CustomerId = a.CustomerId,
         CustomerName = a.Customer != null ? a.Customer.Name : "Unknown",
         Services = a.AppointmentServices.Select(asv => new  // ✅ Get all services for each appointment
         {
             ServiceId = asv.Service.Id,
             ServiceName = asv.Service.Name
         }).ToList(),
         a.AppointmentDate,
         a.AppointmentTime,
         a.Status
     })
     .ToListAsync();


            return Ok(appointments);
        }

        // ✅ PATCH: Update Appointment Status by Staff
        [HttpPatch("{id}/status")]
        public async Task<IActionResult> UpdateStaffAppointmentStatus(int id, [FromBody] AppointmentStatusDto request)
        {
            var appointment = await _context.Appointments.FindAsync(id);

            if (appointment == null)
            {
                return NotFound(new { message = "Appointment not found!" });
            }

            // Ensure that only the assigned staff can update the status
            if (appointment.StaffId == null)
            {
                return Unauthorized(new { message = "Unauthorized action!" });
            }

            // Update Status
            if (request.Status.ToLower() == "completed" || request.Status.ToLower() == "cancelled")
            {
                appointment.Status = request.Status;
                await _context.SaveChangesAsync();
                return Ok(new { message = $"Appointment {request.Status} successfully!" });
            }

            return BadRequest(new { message = "Invalid status update!" });
        }
    }

    // ✅ DTO for Updating Status
    public class AppointmentStatusDto
    {
        public string Status { get; set; }
    }
}
