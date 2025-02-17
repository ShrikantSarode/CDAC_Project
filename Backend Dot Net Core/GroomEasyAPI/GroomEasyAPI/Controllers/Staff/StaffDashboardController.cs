using GroomEasyAPI.Data;
using GroomEasyAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;

namespace GroomEasyAPI.Controllers.Staff
{
    [Route("api/staff")]
    [ApiController]
    public class StaffDashboardController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public StaffDashboardController(ApplicationDbContext context)
        {
            _context = context;
        }

        // ✅ GET: Fetch Staff Dashboard Stats
        [HttpGet("dashboard-stats")]
        public async Task<IActionResult> GetDashboardStats([FromQuery] int staffId)
        {
            var staff = await _context.Staff
                .Include(s => s.User)
                .FirstOrDefaultAsync(s => s.Id == staffId);

            if (staff == null)
            {
                return NotFound(new { message = "Staff not found" });
            }

            var statsQuery = await _context.Appointments
                .Where(a => a.StaffId == staffId)
                .GroupBy(a => 1)
                .Select(g => new
                {
                    TotalAppointments = g.Count(),
                    ApprovedAppointments = g.Count(a => a.Status == "confirmed"),
                    PendingAppointments = g.Count(a => a.Status == "pending"),
                    CompletedAppointments = g.Count(a => a.Status == "completed"),
                    Revenue = g.SelectMany(a => a.AppointmentServices)
                               .Sum(asv => (decimal?)asv.Service.Price) ?? 0,
                    Customers = g.Select(a => a.CustomerId).Distinct().Count()
                })
                .FirstOrDefaultAsync();

            var stats = statsQuery ?? new
            {
                TotalAppointments = 0,
                ApprovedAppointments = 0,
                PendingAppointments = 0,
                CompletedAppointments = 0,
                Revenue = 0m,
                Customers = 0
            };

            return Ok(new
            {
                StaffName = staff.User.Name, // ✅ Added Staff Name
                stats.TotalAppointments,
                stats.ApprovedAppointments,
                stats.PendingAppointments,
                stats.CompletedAppointments,
                stats.Revenue,
                stats.Customers
            });
        }

        // ✅ GET: Fetch Staff Appointments
        [HttpGet("appointments")]
        public async Task<IActionResult> GetStaffAppointments([FromQuery] int staffId)
        {
            var staff = await _context.Staff
                .Include(s => s.User)
                .FirstOrDefaultAsync(s => s.Id == staffId);

            if (staff == null)
            {
                return NotFound(new { message = "Staff not found" });
            }

            var appointments = await _context.Appointments
                .Include(a => a.Customer)
                .Include(a => a.AppointmentServices)
                .ThenInclude(asv => asv.Service)
                .Where(a => a.StaffId == staffId)
                .OrderByDescending(a => a.AppointmentDate)
                .Select(a => new
                {
                    a.Id,
                    AppointmentDate = a.AppointmentDate.ToString("yyyy-MM-dd"),
                    CustomerName = a.Customer != null ? a.Customer.Name : "Unknown",
                    StaffName = staff.User.Name, // ✅ Added Staff Name
                    Status = a.Status,
                    PaymentStatus = a.PaymentStatus
                })
                .ToListAsync();

            return Ok(appointments);
        }
    }
}
