namespace MedicalAppointmentBooking.Api.DTOs.Doctor;

public class DoctorResponseDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = null!;

    public Guid SpecialtyId { get; set; }
    public string SpecialtyName { get; set; } = null!;
    public string? ImageUrl { get; set; }
}

