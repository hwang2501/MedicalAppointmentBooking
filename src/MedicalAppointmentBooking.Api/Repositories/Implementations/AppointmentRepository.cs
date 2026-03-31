using MedicalAppointmentBooking.Api.Data;
using MedicalAppointmentBooking.Api.Models.Entities;
using MedicalAppointmentBooking.Api.Models.Enums;
using MedicalAppointmentBooking.Api.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace MedicalAppointmentBooking.Api.Repositories.Implementations;

public class AppointmentRepository : IAppointmentRepository
{
    private readonly AppDbContext _dbContext;

    public AppointmentRepository(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public Task<bool> HasScheduledAppointmentAsync(
        Guid doctorId,
        DateOnly appointmentDate,
        string timeSlot,
        CancellationToken cancellationToken)
    {
        return _dbContext.Appointments
            .AsNoTracking()
            .AnyAsync(a =>
                a.DoctorId == doctorId &&
                a.AppointmentDate == appointmentDate &&
                a.TimeSlot == timeSlot &&
                a.Status == AppointmentStatus.Scheduled,
                cancellationToken);
    }

    public Task<Appointment?> GetByIdAsync(Guid id, CancellationToken cancellationToken)
        => _dbContext.Appointments
            .AsNoTracking()
            .Include(a => a.Doctor)
            .Include(a => a.User)
            .FirstOrDefaultAsync(a => a.Id == id, cancellationToken);

    public async Task<List<Appointment>> GetAppointmentsForUserAsync(Guid userId, CancellationToken cancellationToken)
    {
        return await _dbContext.Appointments
            .AsNoTracking()
            .Include(a => a.Doctor)
                .ThenInclude(d => d.Specialty)
            .Where(a => a.UserId == userId)
            .OrderByDescending(a => a.AppointmentDate)
            .ThenBy(a => a.TimeSlot)
            .ToListAsync(cancellationToken);
    }

    public async Task<List<string>> GetScheduledTimeSlotsAsync(Guid doctorId, DateOnly date, CancellationToken cancellationToken)
    {
        return await _dbContext.Appointments
            .AsNoTracking()
            .Where(a =>
                a.DoctorId == doctorId &&
                a.AppointmentDate == date &&
                a.Status == AppointmentStatus.Scheduled)
            .Select(a => a.TimeSlot)
            .ToListAsync(cancellationToken);
    }

    public async Task CreateAsync(Appointment appointment, CancellationToken cancellationToken)
    {
        _dbContext.Appointments.Add(appointment);
        await _dbContext.SaveChangesAsync(cancellationToken);
    }

    public async Task<bool> UpdateStatusByAdminAsync(Guid appointmentId, AppointmentStatus status, CancellationToken cancellationToken)
    {
        var entity = await _dbContext.Appointments
            .FirstOrDefaultAsync(a => a.Id == appointmentId, cancellationToken);

        if (entity is null) return false;

        entity.Status = status;
        await _dbContext.SaveChangesAsync(cancellationToken);
        return true;
    }

    public async Task<bool> CancelAsync(Guid appointmentId, Guid userId, CancellationToken cancellationToken)
    {
        var entity = await _dbContext.Appointments
            .FirstOrDefaultAsync(a => a.Id == appointmentId && a.UserId == userId, cancellationToken);

        if (entity is null) return false;

        if (entity.Status != AppointmentStatus.Cancelled)
        {
            entity.Status = AppointmentStatus.Cancelled;
            await _dbContext.SaveChangesAsync(cancellationToken);
        }

        return true;
    }
}

