using GroomEasyAPI.Data;
using GroomEasyAPI.Helpers;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// ✅ Load Configuration
var configuration = builder.Configuration ?? throw new ArgumentNullException(nameof(builder.Configuration), "Configuration is missing!");

// ✅ Register ApplicationDbContext
var connectionString = configuration.GetConnectionString("DefaultConnection")
    ?? throw new ArgumentNullException("DefaultConnection", "Database connection string is missing!");

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));

// ✅ Configure JWT Authentication
var jwtSecret = configuration["JwtSettings:Secret"]
    ?? throw new ArgumentNullException("JwtSettings:Secret", "JWT Secret Key is missing in appsettings.json!");

var key = Encoding.UTF8.GetBytes(jwtSecret);

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.RequireHttpsMetadata = false;
        options.SaveToken = true;
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = configuration["JwtSettings:Issuer"] ?? throw new ArgumentNullException("JwtSettings:Issuer"),
            ValidAudience = configuration["JwtSettings:Audience"] ?? throw new ArgumentNullException("JwtSettings:Audience"),
            IssuerSigningKey = new SymmetricSecurityKey(key)
        };
    });

// ✅ Register JWT Helper as Scoped (Better DI Practice)
builder.Services.AddScoped<JwtTokenHelper>();

// ✅ Add CORS Configuration
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowLocalhost", policy =>
    {
        policy.WithOrigins("http://localhost:3000")  // ✅ Allow frontend React app
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials();
    });
});

// ✅ Add Controllers and Swagger
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// ✅ Configure Middleware

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("AllowLocalhost"); // ✅ Fix: Move before Authentication

app.UseAuthentication();  // ✅ Enable Authentication Middleware
app.UseAuthorization();   // ✅ Enable Authorization Middleware

app.MapControllers();

app.Run();



//using GroomEasyAPI.Data;
//using GroomEasyAPI.Helpers;
//using Microsoft.AspNetCore.Authentication.JwtBearer;
//using Microsoft.EntityFrameworkCore;
//using Microsoft.IdentityModel.Tokens;
//using System.Text;

//var builder = WebApplication.CreateBuilder(args);

//// ✅ Load Configuration
//var configuration = builder.Configuration;

//// ✅ Register ApplicationDbContext
//builder.Services.AddDbContext<ApplicationDbContext>(options =>
//    options.UseMySql(configuration.GetConnectionString("DefaultConnection"),
//        ServerVersion.AutoDetect(configuration.GetConnectionString("DefaultConnection"))));

//// ✅ Configure JWT Authentication
//var key = Encoding.UTF8.GetBytes(configuration["JwtSettings:Secret"]);
//builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
//    .AddJwtBearer(options =>
//    {
//        options.RequireHttpsMetadata = false;
//        options.SaveToken = true;
//        options.TokenValidationParameters = new TokenValidationParameters
//        {
//            ValidateIssuer = true,
//            ValidateAudience = true,
//            ValidateLifetime = true,
//            ValidateIssuerSigningKey = true,
//            ValidIssuer = configuration["JwtSettings:Issuer"],
//            ValidAudience = configuration["JwtSettings:Audience"],
//            IssuerSigningKey = new SymmetricSecurityKey(key)
//        };
//    });

//// ✅ Register JWT Helper
//builder.Services.AddSingleton<JwtTokenHelper>();

//// ✅ Add CORS Configuration
//builder.Services.AddCors(options =>
//{
//    options.AddPolicy("AllowLocalhost", policy =>
//    {
//        policy.WithOrigins("http://localhost:3000")  // Allow frontend React app
//              .AllowAnyMethod()  // Allow all HTTP methods
//              .AllowAnyHeader()  // Allow all headers
//              .AllowCredentials(); // Allow cookies/auth headers
//    });
//});

//// ✅ Add Controllers and Swagger
//builder.Services.AddControllers();
//builder.Services.AddEndpointsApiExplorer();
//builder.Services.AddSwaggerGen();

//var app = builder.Build();

//// ✅ Configure Middleware

//if (app.Environment.IsDevelopment())
//{
//    app.UseSwagger();
//    app.UseSwaggerUI();
//}

//app.UseHttpsRedirection();
//app.UseCors("AllowLocalhost");

//app.UseAuthentication();  // ✅ Enable Authentication Middleware
//app.UseAuthorization();   // ✅ Enable Authorization Middleware

//app.MapControllers();

//app.Run();
