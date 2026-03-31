using MedicalAppointmentBooking.Api.Models.Entities;

namespace MedicalAppointmentBooking.Api.Repositories.Interfaces;

public interface IUserRepository
{
    Task<User?> GetByIdAsync(Guid id, CancellationToken cancellationToken);
    Task<User?> GetByUsernameAsync(string username, CancellationToken cancellationToken);
    Task<List<User>> GetPatientsAsync(string? search, CancellationToken cancellationToken);
    Task CreateAsync(User user, CancellationToken cancellationToken);
}

