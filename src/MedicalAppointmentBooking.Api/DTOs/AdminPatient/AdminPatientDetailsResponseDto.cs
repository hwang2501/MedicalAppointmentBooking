using MedicalAppointmentBooking.Api.DTOs.Appointment;

namespace MedicalAppointmentBooking.Api.DTOs.AdminPatient;

public class AdminPatientDetailsResponseDto
{
    public Guid Id { get; set; }
    public string Username { get; set; } = null!;
    public List<AppointmentResponseDto> Appointments { get; set; } = new();
}

