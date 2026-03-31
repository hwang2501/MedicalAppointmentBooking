using MedicalAppointmentBooking.Api.Models.Enums;

namespace MedicalAppointmentBooking.Api.DTOs.Auth;

public class AuthResponseDto
{
    public string AccessToken { get; set; } = null!;
    public DateTime ExpiresAt { get; set; }
    public string Username { get; set; } = null!;
    public UserRole Role { get; set; }
}

