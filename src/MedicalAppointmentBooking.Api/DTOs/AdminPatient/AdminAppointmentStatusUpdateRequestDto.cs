using MedicalAppointmentBooking.Api.Models.Enums;

namespace MedicalAppointmentBooking.Api.DTOs.AdminPatient;

public class AdminAppointmentStatusUpdateRequestDto
{
    public AppointmentStatus Status { get; set; }
}

