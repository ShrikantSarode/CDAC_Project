using GroomEasyAPI.Data;
using GroomEasyAPI.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[Route("api/userprofile")]
[ApiController]
public class UserProfileController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public UserProfileController(ApplicationDbContext context)
    {
        _context = context;
    }

    // ✅ GET: Fetch Customer Profile by ID
    [HttpGet("profile/{customerId}")]
    public async Task<IActionResult> GetCustomerProfile(int customerId)
    {
        var customer = await _context.Users
            .Where(u => u.Id == customerId && u.RoleId == 3) // RoleId = 3 → Customer
            .FirstOrDefaultAsync(); // ✅ Fetch the entity first

        if (customer == null)
        {
            return NotFound(new { message = "Customer not found!" });
        }

        var userProfile = new UserProfileDTO
        {
            Name = customer.Name,
            Mobile = customer.Mobile,
            Email = customer.Email
        };

        return Ok(userProfile);
    }


    // ✅ PUT: Update Customer Profile
    [HttpPut("{customerId}")]
    public async Task<IActionResult> UpdateCustomerProfile(int customerId, [FromBody] UserProfileDTO request)
    {
        var customer = await _context.Users.FindAsync(customerId);
        if (customer == null || customer.RoleId != 3)
        {
            return NotFound(new { message = "Customer not found!" });
        }

        // Update Details
        customer.Name = request.Name;
        customer.Mobile = request.Mobile;
        

        await _context.SaveChangesAsync();
        return Ok(new { message = "Profile updated successfully!" });
    }

    // ✅ GET: Fetch Recent Orders for a Customer
    [HttpGet("orders/{customerId}")]
    public async Task<IActionResult> GetCustomerOrders(int customerId)
    {
        var orders = await _context.Appointments
            .Include(a => a.AppointmentServices)
            .ThenInclude(asv => asv.Service)
            .Where(a => a.CustomerId == customerId)
            .OrderByDescending(a => a.AppointmentDate)
            .Select(a => new
            {
                a.Id,
                Date = a.AppointmentDate.ToString("yyyy-MM-dd"),
                Services = a.AppointmentServices.Select(asv => asv.Service.Name).ToList(),
                a.Status,
                a.PaymentStatus
            })
            .ToListAsync();

        if (orders == null || orders.Count == 0)
        {
            return NotFound(new { message = "No recent orders found!" });
        }

        return Ok(orders);
    }

}
