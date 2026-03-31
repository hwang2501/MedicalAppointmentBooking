using MedicalAppointmentBooking.Api.DTOs.Appointment;
using MedicalAppointmentBooking.Api.Helpers;
using MedicalAppointmentBooking.Api.Helpers.Exceptions;
using MedicalAppointmentBooking.Api.Models.Entities;
using MedicalAppointmentBooking.Api.Models.Enums;
using MedicalAppointmentBooking.Api.Repositories.Interfaces;
using MedicalAppointmentBooking.Api.Services.Interfaces;

namespace MedicalAppointmentBooking.Api.Services.Implementations;

public class AppointmentService : IAppointmentService
{
    private readonly IDoctorRepository _doctorRepository;
    private readonly IAppointmentRepository _appointmentRepository;

    public AppointmentService(IDoctorRepository doctorRepository, IAppointmentRepository appointmentRepository)
    {
        _doctorRepository = doctorRepository;
        _appointmentRepository = appointmentRepository;
    }

    public async Task<List<AppointmentResponseDto>> GetMyAppointmentsAsync(Guid userId, CancellationToken cancellationToken)
    {
        var appointments = await _appointmentRepository.GetAppointmentsForUserAsync(userId, cancellationToken);

        return appointments.Select(a => new AppointmentResponseDto
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
        }).ToList();
    }

    public async Task<AppointmentResponseDto> BookAsync(Guid userId, AppointmentBookRequestDto request, CancellationToken cancellationToken)
    {
        if (request.AppointmentDate < DateOnly.FromDateTime(DateTime.Today))
            throw new ConflictException("Không thể đặt lịch cho ngày đã qua.");

        if (!TimeSlotCatalog.IsValid(request.TimeSlot))
            throw new ConflictException("Khung giờ không hợp lệ. Vui lòng chọn khung giờ cố định của hệ thống.");

        var doctor = await _doctorRepository.GetByIdAsync(request.DoctorId, cancellationToken);
        if (doctor is null)
            throw new NotFoundException("Doctor not found.");

        var alreadyBooked = await _appointmentRepository.HasScheduledAppointmentAsync(
            doctorId: request.DoctorId,
            appointmentDate: request.AppointmentDate,
            timeSlot: request.TimeSlot,
            cancellationToken: cancellationToken);

        if (alreadyBooked)
            throw new ConflictException("This slot is already booked for the selected doctor.");

        var appointment = new Appointment
        {
            UserId = userId,
            DoctorId = request.DoctorId,
            AppointmentDate = request.AppointmentDate,
            TimeSlot = request.TimeSlot,
            Status = AppointmentStatus.Scheduled
        };

        await _appointmentRepository.CreateAsync(appointment, cancellationToken);

        return new AppointmentResponseDto
        {
            Id = appointment.Id,
            UserId = userId,
            DoctorId = doctor.Id,
            DoctorName = doctor.Name,
            SpecialtyId = doctor.SpecialtyId,
            SpecialtyName = doctor.Specialty?.Name ?? string.Empty,
            AppointmentDate = appointment.AppointmentDate,
            TimeSlot = appointment.TimeSlot,
            Status = appointment.Status
        };
    }

    public async Task CancelAsync(Guid userId, Guid appointmentId, CancellationToken cancellationToken)
    {
        var ok = await _appointmentRepository.CancelAsync(appointmentId, userId, cancellationToken);
        if (!ok)
            throw new NotFoundException("Appointment not found.");
    }
}

