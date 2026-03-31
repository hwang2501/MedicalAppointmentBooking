using System.ComponentModel.DataAnnotations;

namespace MedicalAppointmentBooking.Api.DTOs.Auth;

public class LoginRequestDto
{
    [Required]
    [StringLength(50, MinimumLength = 3)]
    public string Username { get; set; } = null!;

    [Required]
    [StringLength(100, MinimumLength = 6)]
    public string Password { get; set; } = null!;
}

