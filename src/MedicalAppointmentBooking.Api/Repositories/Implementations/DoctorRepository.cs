using MedicalAppointmentBooking.Api.Data;
using MedicalAppointmentBooking.Api.Models.Entities;
using MedicalAppointmentBooking.Api.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace MedicalAppointmentBooking.Api.Repositories.Implementations;

public class DoctorRepository : IDoctorRepository
{
    private readonly AppDbContext _dbContext;

    public DoctorRepository(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<List<Doctor>> GetAllAsync(CancellationToken cancellationToken)
    {
        return await _dbContext.Doctors
            .AsNoTracking()
            .Include(x => x.Specialty)
            .OrderBy(x => x.Name)
            .ToListAsync(cancellationToken);
    }

    public Task<Doctor?> GetByIdAsync(Guid id, CancellationToken cancellationToken)
        => _dbContext.Doctors
            .AsNoTracking()
            .Include(x => x.Specialty)
            .FirstOrDefaultAsync(x => x.Id == id, cancellationToken);

    public async Task<List<Doctor>> SearchAsync(string? query, Guid? specialtyId, CancellationToken cancellationToken)
    {
        IQueryable<Doctor> q = _dbContext.Doctors
            .AsNoTracking()
            .Include(x => x.Specialty);

        if (!string.IsNullOrWhiteSpace(query))
        {
            var trimmed = query.Trim();
            q = q.Where(x => x.Name.Contains(trimmed));
        }

        if (specialtyId.HasValue)
        {
            q = q.Where(x => x.SpecialtyId == specialtyId.Value);
        }

        return await q
            .OrderBy(x => x.Name)
            .ToListAsync(cancellationToken);
    }

    public async Task CreateAsync(Doctor doctor, CancellationToken cancellationToken)
    {
        _dbContext.Doctors.Add(doctor);
        await _dbContext.SaveChangesAsync(cancellationToken);
    }

    public async Task<bool> UpdateAsync(Doctor doctor, CancellationToken cancellationToken)
    {
        var exists = await _dbContext.Doctors.AnyAsync(x => x.Id == doctor.Id, cancellationToken);
        if (!exists) return false;

        _dbContext.Doctors.Update(doctor);
        await _dbContext.SaveChangesAsync(cancellationToken);
        return true;
    }

    public async Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken)
    {
        var entity = await _dbContext.Doctors.FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
        if (entity is null) return false;

        _dbContext.Doctors.Remove(entity);
        await _dbContext.SaveChangesAsync(cancellationToken);
        return true;
    }
}

