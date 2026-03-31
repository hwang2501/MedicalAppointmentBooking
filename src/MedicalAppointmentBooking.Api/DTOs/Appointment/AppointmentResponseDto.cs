using MedicalAppointmentBooking.Api.Models.Enums;

namespace MedicalAppointmentBooking.Api.DTOs.Appointment;

public class AppointmentResponseDto
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }

    public Guid DoctorId { get; set; }
    public string DoctorName { get; set; } = null!;

    public Guid SpecialtyId { get; set; }
    public string SpecialtyName { get; set; } = null!;

    public DateOnly AppointmentDate { get; set; }
    public string TimeSlot { get; set; } = null!;

    public AppointmentStatus Status { get; set; }
}

