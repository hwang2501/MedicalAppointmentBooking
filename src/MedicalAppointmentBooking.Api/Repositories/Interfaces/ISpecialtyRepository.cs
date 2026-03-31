using MedicalAppointmentBooking.Api.Models.Entities;

namespace MedicalAppointmentBooking.Api.Repositories.Interfaces;

public interface ISpecialtyRepository
{
    Task<List<Specialty>> GetAllAsync(CancellationToken cancellationToken);
    Task<Specialty?> GetByIdAsync(Guid id, CancellationToken cancellationToken);

    Task CreateAsync(Specialty specialty, CancellationToken cancellationToken);
    Task<bool> UpdateAsync(Specialty specialty, CancellationToken cancellationToken);
    Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken);
}

