using System.ComponentModel.DataAnnotations;

namespace MedicalAppointmentBooking.Api.DTOs.Doctor;

public class DoctorUpdateRequestDto
{
    [Required]
    [StringLength(200, MinimumLength = 2)]
    public string Name { get; set; } = null!;

    [Required]
    public Guid SpecialtyId { get; set; }

    public string? ImageUrl { get; set; }
}

