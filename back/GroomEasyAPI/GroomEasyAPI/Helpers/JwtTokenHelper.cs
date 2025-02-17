using GroomEasyAPI.Models;
using Microsoft.IdentityModel.Tokens;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace GroomEasyAPI.Helpers
{
    public class JwtTokenHelper
    {
        private readonly IConfiguration _configuration;

        public JwtTokenHelper(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public string GenerateToken(User user, string roleName)
        {
            var secretKey = _configuration["JwtSettings:Secret"];

            if (string.IsNullOrEmpty(secretKey))
            {
                throw new ArgumentNullException(nameof(secretKey), "JWT Secret Key is missing in appsettings.json!");
            }

            var keyBytes = Encoding.UTF8.GetBytes(secretKey);

            if (keyBytes.Length < 32)
            {
                throw new ArgumentException("JWT Secret Key is too short! It must be at least 32 characters long.");
            }

            var securityKey = new SymmetricSecurityKey(keyBytes);
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Email),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim("UserId", user.Id.ToString()),
                new Claim("Role", roleName)
            };

            var token = new JwtSecurityToken(
                issuer: _configuration["JwtSettings:Issuer"],
                audience: _configuration["JwtSettings:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(Convert.ToDouble(_configuration["JwtSettings:ExpirationMinutes"])),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}


//using GroomEasyAPI.Models;
//using Microsoft.IdentityModel.Tokens;
//using System;
//using System.IdentityModel.Tokens.Jwt;
//using System.Security.Claims;
//using System.Text;
//using Microsoft.Extensions.Configuration;

//namespace GroomEasyAPI.Helpers
//{
//    public class JwtTokenHelper
//    {
//        private readonly IConfiguration _configuration;

//        public JwtTokenHelper(IConfiguration configuration)
//        {
//            _configuration = configuration ?? throw new ArgumentNullException(nameof(configuration));
//        }

//        public string GenerateToken(User user, string roleName)
//        {
//            if (user == null)
//                throw new ArgumentNullException(nameof(user), "User object cannot be null.");

//            // 🔥 Read JWT settings from configuration
//            string secretKey = _configuration["JwtSettings:Secret"] ?? throw new ArgumentNullException("JwtSettings:Secret is missing in appsettings.json!");
//            string issuer = _configuration["JwtSettings:Issuer"] ?? throw new ArgumentNullException("JwtSettings:Issuer is missing!");
//            string audience = _configuration["JwtSettings:Audience"] ?? throw new ArgumentNullException("JwtSettings:Audience is missing!");

//            if (!double.TryParse(_configuration["JwtSettings:ExpirationMinutes"], out double expirationMinutes))
//                throw new ArgumentException("JwtSettings:ExpirationMinutes is missing or invalid!");

//            // ✅ Ensure secret key length is valid
//            byte[] keyBytes = Encoding.UTF8.GetBytes(secretKey);
//            if (keyBytes.Length < 32)
//                throw new ArgumentException("JWT Secret Key is too short! It must be at least 32 characters long.");

//            var securityKey = new SymmetricSecurityKey(keyBytes);
//            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

//            var claims = new[]
//            {
//                new Claim(JwtRegisteredClaimNames.Sub, user.Email),
//                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
//                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),  // ✅ Standardized UserId claim
//                new Claim(ClaimTypes.Role, roleName)  // ✅ Standardized Role claim
//            };

//            var token = new JwtSecurityToken(
//                issuer: issuer,
//                audience: audience,
//                claims: claims,
//                expires: DateTime.UtcNow.AddMinutes(expirationMinutes),
//                signingCredentials: credentials
//            );

//            return new JwtSecurityTokenHandler().WriteToken(token);
//        }
//    }
//}

