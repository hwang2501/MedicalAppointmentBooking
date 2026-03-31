using System.ComponentModel.DataAnnotations;

namespace MedicalAppointmentBooking.Api.DTOs.Specialty;

public class SpecialtyCreateRequestDto
{
    [Required]
    [StringLength(200, MinimumLength = 2)]
    public string Name { get; set; } = null!;
}

