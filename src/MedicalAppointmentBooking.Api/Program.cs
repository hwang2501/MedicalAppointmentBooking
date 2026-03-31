using System.Text;
using MedicalAppointmentBooking.Api.Data;
using MedicalAppointmentBooking.Api.Middleware;
using MedicalAppointmentBooking.Api.Repositories.Implementations;
using MedicalAppointmentBooking.Api.Repositories.Interfaces;
using MedicalAppointmentBooking.Api.Security.Jwt;
using MedicalAppointmentBooking.Api.Services.Implementations;
using MedicalAppointmentBooking.Api.Services.Interfaces;
using MedicalAppointmentBooking.Api.Helpers;
using MedicalAppointmentBooking.Api.Models.Entities;
using MedicalAppointmentBooking.Api.Models.Enums;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactDev", policy =>
    {
        policy.WithOrigins("http://localhost:5173", "http://localhost:5174", "http://localhost:3000", "http://127.0.0.1:3000")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Phòng Khám Đa Khoa Huỳnh Hoàng API",
        Version = "v1"
    });

    var bearerScheme = new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Description = "Enter JWT as: Bearer {token}",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT"
    };

    c.AddSecurityDefinition("Bearer", bearerScheme);
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

builder.Services.AddDbContext<AppDbContext>(options =>
{
    var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
    options.UseSqlServer(connectionString);
});

builder.Services.Configure<JwtSettings>(builder.Configuration.GetSection("Jwt"));

// Repositories
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<ISpecialtyRepository, SpecialtyRepository>();
builder.Services.AddScoped<IDoctorRepository, DoctorRepository>();
builder.Services.AddScoped<IAppointmentRepository, AppointmentRepository>();

// Services
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<ISpecialtyService, SpecialtyService>();
builder.Services.AddScoped<IDoctorService, DoctorService>();
builder.Services.AddScoped<IAppointmentService, AppointmentService>();
builder.Services.AddScoped<IAdminPatientService, AdminPatientService>();

// JWT token generator
builder.Services.AddScoped<IJwtTokenGenerator, JwtTokenGenerator>();

var jwtSection = builder.Configuration.GetSection("Jwt");
var issuer = jwtSection["Issuer"];
var audience = jwtSection["Audience"];
var key = jwtSection["Key"];

if (string.IsNullOrWhiteSpace(issuer) || string.IsNullOrWhiteSpace(audience) || string.IsNullOrWhiteSpace(key))
{
    throw new InvalidOperationException("JWT configuration is missing. Please set Jwt:Issuer, Jwt:Audience, Jwt:Key in appsettings.json.");
}

var keyBytes = Encoding.UTF8.GetBytes(key);

builder.Services
    .AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(options =>
    {
        options.RequireHttpsMetadata = !builder.Environment.IsDevelopment();
        options.SaveToken = true;
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(keyBytes),

            ValidateIssuer = true,
            ValidIssuer = issuer,

            ValidateAudience = true,
            ValidAudience = audience,

            ValidateLifetime = true,
            ClockSkew = TimeSpan.FromSeconds(30)
        };
    });

builder.Services.AddAuthorization();

var app = builder.Build();

app.UseMiddleware<ExceptionHandlingMiddleware>();
app.UseCors("AllowReactDev");
app.UseStaticFiles();

// Development seed data to make the demo usable quickly.
if (app.Environment.IsDevelopment())
{
    using var scope = app.Services.CreateScope();
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

    db.Database.EnsureCreated();

    var adminUser = db.Users.FirstOrDefault(u => u.Role == UserRole.Admin);
    if (adminUser is null)
    {
        db.Users.Add(new User
        {
            Username = "admin",
            PasswordHash = PasswordHasher.HashPassword("Admin123!"),
            Role = UserRole.Admin
        });
    }
    else
    {
        // Keep demo credentials stable in Development.
        adminUser.Username = "admin";
        adminUser.PasswordHash = PasswordHasher.HashPassword("Admin123!");
        db.Users.Update(adminUser);
    }
    db.SaveChanges();

    if (!db.Specialties.Any())
    {
        var cardiology = new Specialty { Name = "Nội tim mạch" };
        var dermatology = new Specialty { Name = "Da liễu" };
        var pediatrics = new Specialty { Name = "Nhi khoa" };

        db.Specialties.AddRange(cardiology, dermatology, pediatrics);
        db.SaveChanges();

        db.Doctors.AddRange(
            new Doctor { Name = "BS. Nguyễn Văn A", SpecialtyId = cardiology.Id },
            new Doctor { Name = "BS. Trần Thị B", SpecialtyId = dermatology.Id },
            new Doctor { Name = "BS. Lê Văn C", SpecialtyId = pediatrics.Id }
        );

    }
}

app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "Medical Appointment Booking API v1");
});

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
