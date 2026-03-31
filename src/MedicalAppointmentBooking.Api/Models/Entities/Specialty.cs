namespace MedicalAppointmentBooking.Api.Models.Entities;

public class Specialty
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public string Name { get; set; } = null!;

    public ICollection<Doctor> Doctors { get; set; } = new List<Doctor>();
}

