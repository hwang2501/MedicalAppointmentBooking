using System.ComponentModel.DataAnnotations;

namespace MedicalAppointmentBooking.Api.DTOs.Doctor;

public class DoctorSearchRequestDto
{
    [StringLength(100)]
    public string? Query { get; set; }

    public Guid? SpecialtyId { get; set; }
}

