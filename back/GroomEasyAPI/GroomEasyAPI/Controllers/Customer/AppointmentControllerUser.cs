using GroomEasyAPI.Data;
using GroomEasyAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Razorpay.Api;
using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using System.Collections.Generic;
using System.Security.Cryptography;
using System.Text;
using GroomEasyAPI.DTOs;

namespace GroomEasyAPI.Controllers.Customer
{
    [Route("api/userappointments")]
    [ApiController]
    public class AppointmentControllerUser : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;

        public AppointmentControllerUser(ApplicationDbContext context, IConfiguration configuration)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
            _configuration = configuration;
        }
        [HttpPost("book")]
        public async Task<IActionResult> BookAppointment([FromBody] AppointmentRequestDTO request)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                if (request == null || request.CustomerId <= 0 || request.StaffId <= 0 ||
                    request.AppointmentDate == default || string.IsNullOrEmpty(request.AppointmentTime) ||
                    request.Services == null || request.Services.Count == 0)
                {
                    return BadRequest(new { message = "Invalid appointment data. Please provide all required fields." });
                }

                var customerExists = await _context.Users.AnyAsync(u => u.Id == request.CustomerId);
                var staffExists = await _context.Staff.AnyAsync(s => s.Id == request.StaffId);
                var services = await _context.Services.Where(s => request.Services.Contains(s.Id)).ToListAsync();

                if (!customerExists || !staffExists || services.Count != request.Services.Count)
                {
                    return NotFound(new { message = "Customer, Staff, or one or more Services not found." });
                }

                decimal totalAmount = services.Sum(s => (decimal)s.Price) * 100; // Convert to paise

                var newAppointment = new Appointment
                {
                    CustomerId = request.CustomerId,
                    StaffId = request.StaffId,
                    AppointmentDate = request.AppointmentDate,
                    AppointmentTime = request.AppointmentTime,
                    Status = "pending",
                    PaymentStatus = "pending",
                    CreatedAt = DateTime.UtcNow
                };

                _context.Appointments.Add(newAppointment);
                await _context.SaveChangesAsync();

                // ✅ Save Services in `appointment_services`
                var appointmentServices = request.Services.Select(serviceId => new AppointmentService
                {
                    AppointmentId = newAppointment.Id,
                    ServiceId = serviceId
                }).ToList();

                _context.AppointmentServices.AddRange(appointmentServices);
                await _context.SaveChangesAsync();

                // ✅ Generate Razorpay Order
                var client = new RazorpayClient(_configuration["Razorpay:Key"], _configuration["Razorpay:Secret"]);
                Dictionary<string, object> options = new Dictionary<string, object>
        {
            { "amount", totalAmount },
            { "currency", "INR" },
            { "receipt", "order_rcptid_" + newAppointment.Id }
        };

                Order order = client.Order.Create(options);
                string orderId = order["id"].ToString(); // ✅ Get Razorpay order ID

                await transaction.CommitAsync();

                Console.WriteLine($"✅ Order Created: AppointmentID={newAppointment.Id}, OrderID={orderId}");

                return Ok(new
                {
                    message = "Appointment booked successfully!",
                    appointmentId = newAppointment.Id,
                    orderId = orderId,
                    key = _configuration["Razorpay:Key"] // ✅ Send Razorpay Key to frontend
                });
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return StatusCode(500, new { message = "An error occurred while booking the appointment.", error = ex.Message });
            }
        }




        [HttpPost("verify-payment")]
        public async Task<IActionResult> VerifyPayment([FromBody] PaymentVerificationDTO request)
        {
            try
            {
                var appointment = await _context.Appointments.FindAsync(request.AppointmentId);
                if (appointment == null)
                {
                    return NotFound(new { message = "Appointment not found." });
                }

                // ✅ Log incoming request data
                Console.WriteLine($"🔵 Received Payment Data: OrderID={request.OrderId}, PaymentID={request.PaymentId}, Signature={request.Signature}");

                string secret = _configuration["Razorpay:Secret"];

                bool isValidSignature = VerifyPaymentSignature(request.OrderId, request.PaymentId, request.Signature, secret);

                if (!isValidSignature)
                {
                    Console.WriteLine("🔴 Payment verification failed due to invalid signature.");
                    return BadRequest(new { message = "Invalid payment signature. Verification failed." });
                }

                // ✅ Update payment status upon successful verification
                appointment.PaymentStatus = "Paid";
                appointment.Status = "pending";
                await _context.SaveChangesAsync();

                Console.WriteLine("✅ Payment verified successfully!");
                return Ok(new { message = "Payment verified successfully!" });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"🔴 Payment verification error: {ex.Message}");
                return StatusCode(500, new { message = "Payment verification failed.", error = ex.InnerException?.Message ?? ex.Message });
            }
        }

        private bool VerifyPaymentSignature(string orderId, string paymentId, string razorpaySignature, string secret)
        {
            string payload = $"{orderId}|{paymentId}";
            using (HMACSHA256 hmac = new HMACSHA256(Encoding.UTF8.GetBytes(secret)))
            {
                byte[] hash = hmac.ComputeHash(Encoding.UTF8.GetBytes(payload));
                string expectedSignature = BitConverter.ToString(hash).Replace("-", "").ToLower();

                return expectedSignature == razorpaySignature;
            }
        }
    }
}
