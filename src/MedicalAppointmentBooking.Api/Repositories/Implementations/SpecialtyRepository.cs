using MedicalAppointmentBooking.Api.Data;
using MedicalAppointmentBooking.Api.Models.Entities;
using MedicalAppointmentBooking.Api.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace MedicalAppointmentBooking.Api.Repositories.Implementations;

public class SpecialtyRepository : ISpecialtyRepository
{
    private readonly AppDbContext _dbContext;

    public SpecialtyRepository(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public Task<List<Specialty>> GetAllAsync(CancellationToken cancellationToken)
        => _dbContext.Specialties
            .AsNoTracking()
            .OrderBy(x => x.Name)
            .ToListAsync(cancellationToken);

    public Task<Specialty?> GetByIdAsync(Guid id, CancellationToken cancellationToken)
        => _dbContext.Specialties
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.Id == id, cancellationToken);

    public async Task CreateAsync(Specialty specialty, CancellationToken cancellationToken)
    {
        _dbContext.Specialties.Add(specialty);
        await _dbContext.SaveChangesAsync(cancellationToken);
    }

    public async Task<bool> UpdateAsync(Specialty specialty, CancellationToken cancellationToken)
    {
        var exists = await _dbContext.Specialties
            .AnyAsync(x => x.Id == specialty.Id, cancellationToken);

        if (!exists) return false;

        _dbContext.Specialties.Update(specialty);
        await _dbContext.SaveChangesAsync(cancellationToken);
        return true;
    }

    public async Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken)
    {
        var entity = await _dbContext.Specialties
            .FirstOrDefaultAsync(x => x.Id == id, cancellationToken);

        if (entity is null) return false;

        _dbContext.Specialties.Remove(entity);
        await _dbContext.SaveChangesAsync(cancellationToken);
        return true;
    }
}

