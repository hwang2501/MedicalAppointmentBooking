namespace MedicalAppointmentBooking.Api.DTOs.AdminPatient;

public class AdminPatientListItemResponseDto
{
    public Guid Id { get; set; }
    public string Username { get; set; } = null!;
    public int TotalAppointments { get; set; }
}

