using MedicalAppointmentBooking.Api.Models.Entities;

namespace MedicalAppointmentBooking.Api.Repositories.Interfaces;

public interface IDoctorRepository
{
    Task<List<Doctor>> GetAllAsync(CancellationToken cancellationToken);
    Task<Doctor?> GetByIdAsync(Guid id, CancellationToken cancellationToken);

    Task<List<Doctor>> SearchAsync(string? query, Guid? specialtyId, CancellationToken cancellationToken);

    Task CreateAsync(Doctor doctor, CancellationToken cancellationToken);
    Task<bool> UpdateAsync(Doctor doctor, CancellationToken cancellationToken);
    Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken);
}

