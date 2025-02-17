using GroomEasyAPI.Data;
using GroomEasyAPI.DTOs;
using GroomEasyAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GroomEasyAPI.Controllers.Admin
{
    [Route("api/admin")]
    [ApiController]
    public class AdminDashboardController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AdminDashboardController(ApplicationDbContext context)
        {
            _context = context;
        }

        // ✅ GET: Fetch Admin Details by Email
        [HttpGet("admin-details/{email}")]
        public async Task<IActionResult> GetAdminDetails(string email)
        {
            var admin = await _context.Users
                .Where(u => u.Email == email && u.RoleId == 1) // RoleId = 1 → Admin
                .Select(u => new { u.Id, u.Name, u.Email })
                .FirstOrDefaultAsync();

            if (admin == null)
            {
                return NotFound(new { message = "Admin not found" });
            }

            return Ok(admin);
        }

        // ✅ GET: Fetch Dashboard Statistics
        [HttpGet("dashboard-stats")]
        public async Task<IActionResult> GetDashboardStats()
        {
            var totalAppointments = await _context.Appointments.CountAsync();
            var totalStaff = await _context.Users.CountAsync(u => u.RoleId == 2); // Staff RoleId = 2
            var totalCustomers = await _context.Users.CountAsync(u => u.RoleId == 3); // Customer RoleId = 3

            var totalRevenue = await _context.Payments
                .Where(p => p.PaymentStatus == "completed")
                .SumAsync(p => (decimal?)p.Amount) ?? 0;

            var pendingPayments = await _context.Payments
                .Where(p => p.PaymentStatus == "pending")
                .SumAsync(p => (decimal?)p.Amount) ?? 0;

            var dashboardStats = new
            {
                totalAppointments,
                totalStaff,
                totalCustomers,
                totalRevenue,
                pendingPayments
            };

            return Ok(dashboardStats);
        }

        // ✅ GET: Fetch Recent Appointments
        [HttpGet("appointments")]
        public async Task<IActionResult> GetAppointments()
        {
            var appointments = await _context.Appointments
                .Include(a => a.Customer)
                .Include(a => a.Staff)
                .Include(a => a.AppointmentServices) // ✅ Fetch services
                .ThenInclude(asv => asv.Service)
                .OrderByDescending(a => a.AppointmentDate)
                .Select(a => new
                {
                    a.Id,
                    Date = a.AppointmentDate.ToString("yyyy-MM-dd"),
                    Customer = a.Customer != null ? a.Customer.Name : "N/A",
                    Staff = a.Staff != null ? a.Staff.Name : "Not Assigned",
                    Services = a.AppointmentServices.Select(asv => new
                    {
                        asv.Service.Name,
                        Duration = $"{asv.Service.Duration} minutes"
                    }).ToList(), // ✅ Return list of services
                    a.Status,
                    a.PaymentStatus
                })
                .ToListAsync();

            return Ok(appointments);
        }

    }

}
