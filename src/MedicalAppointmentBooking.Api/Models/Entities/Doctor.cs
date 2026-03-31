namespace MedicalAppointmentBooking.Api.Models.Entities;

public class Doctor
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public string Name { get; set; } = null!;

    public Guid SpecialtyId { get; set; }

    public Specialty Specialty { get; set; } = null!;

    public string? ImageUrl { get; set; }

    public ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();
}

