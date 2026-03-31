using System.ComponentModel.DataAnnotations;

namespace MedicalAppointmentBooking.Api.DTOs.Appointment;

public class AppointmentBookRequestDto
{
    [Required]
    public Guid DoctorId { get; set; }

    [Required]
    public DateOnly AppointmentDate { get; set; }

    // Format: "HH:mm-HH:mm" (24h), e.g. "09:00-09:30"
    [Required]
    [RegularExpression(@"^\d{2}:\d{2}-\d{2}:\d{2}$")]
    public string TimeSlot { get; set; } = null!;
}

