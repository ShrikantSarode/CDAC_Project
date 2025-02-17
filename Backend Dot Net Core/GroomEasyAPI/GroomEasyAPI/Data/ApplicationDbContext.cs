using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System;
using GroomEasyAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace GroomEasyAPI.Data
{
    public class ApplicationDbContext : DbContext
    {
        public DbSet<User> Users { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<Staff> Staff { get; set; }
        public DbSet<Service> Services { get; set; }
        public DbSet<Appointment> Appointments { get; set; }
        public DbSet<Payment> Payments { get; set; }
        public DbSet<StaffService> StaffServices { get; set; }
        public DbSet<AppointmentService> AppointmentServices { get; set; }

        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // ✅ Seeding Roles
            modelBuilder.Entity<Role>().HasData(
                new Role { Id = 1, RoleName = "Admin" },
                new Role { Id = 2, RoleName = "Staff" },
                new Role { Id = 3, RoleName = "Customer" }
            );

            // ✅ Seeding Services
            modelBuilder.Entity<Service>().HasData(
                new Service { Id = 301, Name = "Haircut", Price = 500, Duration = 30 },
                new Service { Id = 302, Name = "Facial", Price = 700, Duration = 45 },
                new Service { Id = 303, Name = "Massage", Price = 1000, Duration = 60 }
            );

            // ✅ Seeding Staff
            modelBuilder.Entity<Staff>().HasData(
                new Staff { Id = 102, Name = "Shrikant", Email = "shrikant@gmail.com", Phone = "9876543210", UserId = 102 },
                new Staff { Id = 103, Name = "Rajesh", Email = "rajesh@gmail.com", Phone = "8765432109", UserId = 103 }
            );

            // ✅ Seeding Users
            modelBuilder.Entity<User>().HasData(
                new User { Id = 101, Name = "Ashok", Email = "ashok@gmail.com", Password = "hashedpassword", Mobile = "9123456789", RoleId = 3 },
                new User { Id = 102, Name = "Shrikant", Email = "shrikant@gmail.com", Password = "hashedpassword1", Mobile = "9876543210", RoleId = 2 },
                new User { Id = 103, Name = "Rajesh", Email = "rajesh@gmail.com", Password = "hashedpassword2", Mobile = "8765432109", RoleId = 2 }
            );

            // ✅ Seeding Appointments (Without `ServiceId`)
            modelBuilder.Entity<Appointment>().HasData(
                new Appointment
                {
                    Id = 1,
                    CustomerId = 101,
                    StaffId = 102,
                    AppointmentDate = new DateTime(2024, 02, 15),
                    AppointmentTime = "10:00 AM",
                    Status = "confirmed",
                    PaymentStatus = "paid"
                },
                new Appointment
                {
                    Id = 2,
                    CustomerId = 101,
                    StaffId = 103,
                    AppointmentDate = new DateTime(2024, 02, 16),
                    AppointmentTime = "02:30 PM",
                    Status = "pending",
                    PaymentStatus = "pending"
                }
            );

            // ✅ Relationships
            modelBuilder.Entity<User>()
                .HasMany(u => u.Appointments)
                .WithOne(a => a.Customer)
                .HasForeignKey(a => a.CustomerId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Staff>()
                .HasMany(s => s.Appointments)
                .WithOne(a => a.Staff)
                .HasForeignKey(a => a.StaffId)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<Appointment>()
                .HasOne(a => a.Staff)
                .WithMany(s => s.Appointments)
                .HasForeignKey(a => a.StaffId)
                .OnDelete(DeleteBehavior.SetNull);

            // ✅ Configure Many-to-Many Relationship for Staff and Services
            modelBuilder.Entity<StaffService>()
                .HasKey(ss => new { ss.StaffId, ss.ServiceId });

            modelBuilder.Entity<StaffService>()
                .HasOne(ss => ss.Staff)
                .WithMany(u => u.StaffServices)
                .HasForeignKey(ss => ss.StaffId);

            modelBuilder.Entity<StaffService>()
                .HasOne(ss => ss.Service)
                .WithMany(s => s.StaffServices)
                .HasForeignKey(ss => ss.ServiceId);

            // ✅ Configure Many-to-Many Relationship for Appointment and Services
            modelBuilder.Entity<AppointmentService>()
                .HasKey(asv => new { asv.AppointmentId, asv.ServiceId });

            modelBuilder.Entity<AppointmentService>()
                .HasOne(asv => asv.Appointment)
                .WithMany(a => a.AppointmentServices)
                .HasForeignKey(asv => asv.AppointmentId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<AppointmentService>()
                .HasOne(asv => asv.Service)
                .WithMany(s => s.AppointmentServices)
                .HasForeignKey(asv => asv.ServiceId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }

}