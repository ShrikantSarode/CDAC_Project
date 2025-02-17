using GroomEasyAPI.Data;
using GroomEasyAPI.DTOs;
using GroomEasyAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace GroomEasyAPI.Controllers
{
    [Route("api/appointments")]
    [ApiController]
    //[Authorize(AuthenticationSchemes = "Bearer", Roles = "Admin,Staff")] // 🔒 Restrict Access
    public class AppointmentControllerUser : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AppointmentControllerUser(ApplicationDbContext context)
        {
            _context = context;
        }

        // ✅ GET: Fetch All Appointments
        [HttpGet]
        public async Task<IActionResult> GetAppointments()
        {
            var appointmentData = await _context.Appointments
     .Include(a => a.Customer)
     .Include(a => a.Staff)
     .Include(a => a.AppointmentServices)
     .ThenInclude(asv => asv.Service)
     .OrderByDescending(a => a.AppointmentDate)
     .Select(a => new
     {
         a.Id,
         Date = a.AppointmentDate.ToString("yyyy-MM-dd"),
         AppointmentTime = a.AppointmentTime,
         Customer = a.Customer != null ? a.Customer.Name : "N/A",
         Staff = a.Staff != null ? a.Staff.Name : "Not Assigned",
         Services = a.AppointmentServices != null && a.AppointmentServices.Any()
             ? a.AppointmentServices.Select(asv => (dynamic)new
             {
                 Name = asv.Service.Name,
                 Duration = $"{asv.Service.Duration} minutes"
             }).ToList()
             : new List<dynamic>(), // ✅ Ensures type consistency
         a.Status,
         a.PaymentStatus
     })
     .ToListAsync();


            if (!appointmentData.Any())
            {
                return NotFound(new { message = "No appointments found!" });
            }

            return Ok(appointmentData);
        }

        // ✅ PATCH: Update Appointment Status
        [HttpPatch("{id}/status")]
        public async Task<IActionResult> UpdateAppointmentStatus(int id, [FromBody] AppointmentStatusDto request)
        {
            if (request == null || string.IsNullOrEmpty(request.Status))
            {
                return BadRequest(new { message = "Invalid request data!" });
            }

            var appointment = await _context.Appointments.FindAsync(id);
            if (appointment == null)
            {
                return NotFound(new { message = "Appointment not found!" });
            }

            string[] validStatuses = { "confirmed", "cancelled", "pending" };
            string normalizedStatus = request.Status.Trim().ToLower();

            if (!validStatuses.Contains(normalizedStatus))
            {
                return BadRequest(new { message = "Invalid status update! Allowed values: confirmed, cancelled, pending." });
            }

            appointment.Status = normalizedStatus;
            await _context.SaveChangesAsync();

            return Ok(new { message = $"Appointment status updated to {normalizedStatus} successfully!" });
        }
    }
}
