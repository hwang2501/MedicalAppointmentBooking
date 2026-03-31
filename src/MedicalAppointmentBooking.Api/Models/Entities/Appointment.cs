using MedicalAppointmentBooking.Api.Models.Enums;

namespace MedicalAppointmentBooking.Api.Models.Entities;

public class Appointment
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid UserId { get; set; }
    public User User { get; set; } = null!;

    public Guid DoctorId { get; set; }
    public Doctor Doctor { get; set; } = null!;

    public DateOnly AppointmentDate { get; set; }

    public string TimeSlot { get; set; } = null!;

    public AppointmentStatus Status { get; set; } = AppointmentStatus.Scheduled;
}

