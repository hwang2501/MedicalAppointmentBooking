using MedicalAppointmentBooking.Api.Data;
using MedicalAppointmentBooking.Api.Models.Entities;
using MedicalAppointmentBooking.Api.Models.Enums;
using MedicalAppointmentBooking.Api.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace MedicalAppointmentBooking.Api.Repositories.Implementations;

public class UserRepository : IUserRepository
{
    private readonly AppDbContext _dbContext;

    public UserRepository(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public Task<User?> GetByIdAsync(Guid id, CancellationToken cancellationToken)
        => _dbContext.Users
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.Id == id, cancellationToken);

    public Task<User?> GetByUsernameAsync(string username, CancellationToken cancellationToken)
        => _dbContext.Users
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.Username == username, cancellationToken);

    public async Task<List<User>> GetPatientsAsync(string? search, CancellationToken cancellationToken)
    {
        IQueryable<User> query = _dbContext.Users
            .AsNoTracking()
            .Where(x => x.Role == UserRole.Patient);

        if (!string.IsNullOrWhiteSpace(search))
        {
            var term = search.Trim();
            query = query.Where(x => x.Username.Contains(term));
        }

        return await query
            .OrderBy(x => x.Username)
            .ToListAsync(cancellationToken);
    }

    public async Task CreateAsync(User user, CancellationToken cancellationToken)
    {
        _dbContext.Users.Add(user);
        await _dbContext.SaveChangesAsync(cancellationToken);
    }
}

