using MedicalAppointmentBooking.Api.DTOs.Appointment;

namespace MedicalAppointmentBooking.Api.Services.Interfaces;

public interface IAppointmentService
{
    Task<List<AppointmentResponseDto>> GetMyAppointmentsAsync(Guid userId, CancellationToken cancellationToken);
    Task<AppointmentResponseDto> BookAsync(Guid userId, AppointmentBookRequestDto request, CancellationToken cancellationToken);
    Task CancelAsync(Guid userId, Guid appointmentId, CancellationToken cancellationToken);
}

