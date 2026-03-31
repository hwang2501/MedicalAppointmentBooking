using MedicalAppointmentBooking.Api.Models.Entities;
using MedicalAppointmentBooking.Api.Models.Enums;

namespace MedicalAppointmentBooking.Api.Repositories.Interfaces;

public interface IAppointmentRepository
{
    Task<bool> HasScheduledAppointmentAsync(
        Guid doctorId,
        DateOnly appointmentDate,
        string timeSlot,
        CancellationToken cancellationToken);

    Task<Appointment?> GetByIdAsync(Guid id, CancellationToken cancellationToken);

    Task<List<Appointment>> GetAppointmentsForUserAsync(Guid userId, CancellationToken cancellationToken);
    Task<List<string>> GetScheduledTimeSlotsAsync(Guid doctorId, DateOnly date, CancellationToken cancellationToken);

    Task CreateAsync(Appointment appointment, CancellationToken cancellationToken);
    Task<bool> UpdateStatusByAdminAsync(Guid appointmentId, AppointmentStatus status, CancellationToken cancellationToken);

    Task<bool> CancelAsync(Guid appointmentId, Guid userId, CancellationToken cancellationToken);
}

