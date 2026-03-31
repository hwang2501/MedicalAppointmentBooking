using MedicalAppointmentBooking.Api.DTOs.AdminPatient;
using MedicalAppointmentBooking.Api.DTOs.Appointment;
using MedicalAppointmentBooking.Api.Helpers.Exceptions;
using MedicalAppointmentBooking.Api.Models.Enums;
using MedicalAppointmentBooking.Api.Repositories.Interfaces;
using MedicalAppointmentBooking.Api.Services.Interfaces;

namespace MedicalAppointmentBooking.Api.Services.Implementations;

public class AdminPatientService : IAdminPatientService
{
    private readonly IUserRepository _userRepository;
    private readonly IAppointmentRepository _appointmentRepository;

    public AdminPatientService(IUserRepository userRepository, IAppointmentRepository appointmentRepository)
    {
        _userRepository = userRepository;
        _appointmentRepository = appointmentRepository;
    }

    public async Task<List<AdminPatientListItemResponseDto>> GetPatientsAsync(string? search, CancellationToken cancellationToken)
    {
        var patients = await _userRepository.GetPatientsAsync(search, cancellationToken);

        var results = new List<AdminPatientListItemResponseDto>(patients.Count);
        foreach (var p in patients)
        {
            var appointments = await _appointmentRepository.GetAppointmentsForUserAsync(p.Id, cancellationToken);
            results.Add(new AdminPatientListItemResponseDto
            {
                Id = p.Id,
                Username = p.Username,
                TotalAppointments = appointments.Count
            });
        }

        return results;
    }

    public async Task<AdminPatientDetailsResponseDto> GetPatientDetailsAsync(Guid patientId, CancellationToken cancellationToken)
    {
        var user = await _userRepository.GetByIdAsync(patientId, cancellationToken);
        if (user is null || user.Role != UserRole.Patient)
            throw new NotFoundException("Patient not found.");

        var appointments = await _appointmentRepository.GetAppointmentsForUserAsync(patientId, cancellationToken);

        return new AdminPatientDetailsResponseDto
        {
            Id = user.Id,
            Username = user.Username,
            Appointments = appointments.Select(a => new AppointmentResponseDto
            {
                Id = a.Id,
                UserId = a.UserId,
                DoctorId = a.DoctorId,
                DoctorName = a.Doctor?.Name ?? string.Empty,
                SpecialtyId = a.Doctor?.SpecialtyId ?? Guid.Empty,
                SpecialtyName = a.Doctor?.Specialty?.Name ?? string.Empty,
                AppointmentDate = a.AppointmentDate,
                TimeSlot = a.TimeSlot,
                Status = a.Status
            }).ToList()
        };
    }

    public async Task UpdateAppointmentStatusAsync(Guid appointmentId, AppointmentStatus status, CancellationToken cancellationToken)
    {
        if (status is not AppointmentStatus.Confirmed and not AppointmentStatus.Cancelled)
            throw new ConflictException("Admin chỉ được đổi trạng thái sang: Confirmed hoặc Cancelled.");

        var ok = await _appointmentRepository.UpdateStatusByAdminAsync(appointmentId, status, cancellationToken);
        if (!ok)
            throw new NotFoundException("Appointment not found.");
    }
}

