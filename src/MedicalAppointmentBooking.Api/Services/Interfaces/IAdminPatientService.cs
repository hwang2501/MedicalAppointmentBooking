using MedicalAppointmentBooking.Api.DTOs.AdminPatient;
using MedicalAppointmentBooking.Api.Models.Enums;

namespace MedicalAppointmentBooking.Api.Services.Interfaces;

public interface IAdminPatientService
{
    Task<List<AdminPatientListItemResponseDto>> GetPatientsAsync(string? search, CancellationToken cancellationToken);
    Task<AdminPatientDetailsResponseDto> GetPatientDetailsAsync(Guid patientId, CancellationToken cancellationToken);
    Task UpdateAppointmentStatusAsync(Guid appointmentId, AppointmentStatus status, CancellationToken cancellationToken);
}

