namespace MedicalAppointmentBooking.Api.DTOs.Doctor;

public class DoctorAvailabilityResponseDto
{
    public Guid DoctorId { get; set; }
    public DateOnly Date { get; set; }
    public List<string> AvailableTimeSlots { get; set; } = new();
}

