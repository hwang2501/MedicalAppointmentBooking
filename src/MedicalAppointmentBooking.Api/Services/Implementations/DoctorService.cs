using MedicalAppointmentBooking.Api.DTOs.Doctor;
using MedicalAppointmentBooking.Api.Helpers;
using MedicalAppointmentBooking.Api.Helpers.Exceptions;
using MedicalAppointmentBooking.Api.Models.Entities;
using MedicalAppointmentBooking.Api.Repositories.Interfaces;
using MedicalAppointmentBooking.Api.Services.Interfaces;

namespace MedicalAppointmentBooking.Api.Services.Implementations;

public class DoctorService : IDoctorService
{
    private readonly IDoctorRepository _doctorRepository;
    private readonly ISpecialtyRepository _specialtyRepository;
    private readonly IAppointmentRepository _appointmentRepository;

    public DoctorService(
        IDoctorRepository doctorRepository,
        ISpecialtyRepository specialtyRepository,
        IAppointmentRepository appointmentRepository)
    {
        _doctorRepository = doctorRepository;
        _specialtyRepository = specialtyRepository;
        _appointmentRepository = appointmentRepository;
    }

    public async Task<List<DoctorResponseDto>> GetAllAsync(CancellationToken cancellationToken)
    {
        var doctors = await _doctorRepository.GetAllAsync(cancellationToken);
        return doctors.Select(MapToDto).ToList();
    }

    public async Task<DoctorResponseDto> GetByIdAsync(Guid id, CancellationToken cancellationToken)
    {
        var doctor = await _doctorRepository.GetByIdAsync(id, cancellationToken);
        if (doctor is null)
            throw new NotFoundException("Doctor not found.");

        return MapToDto(doctor);
    }

    public async Task<List<DoctorResponseDto>> SearchAsync(DoctorSearchRequestDto request, CancellationToken cancellationToken)
    {
        request ??= new DoctorSearchRequestDto();

        var doctors = await _doctorRepository.SearchAsync(request.Query, request.SpecialtyId, cancellationToken);
        return doctors.Select(MapToDto).ToList();
    }

    public async Task<DoctorAvailabilityResponseDto> GetAvailabilityAsync(Guid doctorId, DateOnly date, CancellationToken cancellationToken)
    {
        var doctor = await _doctorRepository.GetByIdAsync(doctorId, cancellationToken);
        if (doctor is null)
            throw new NotFoundException("Doctor not found.");

        var bookedSlots = await _appointmentRepository.GetScheduledTimeSlotsAsync(doctorId, date, cancellationToken);
        var bookedSet = bookedSlots.ToHashSet(StringComparer.Ordinal);

        var available = TimeSlotCatalog.AllowedSlots
            .Where(slot => !bookedSet.Contains(slot))
            .ToList();

        return new DoctorAvailabilityResponseDto
        {
            DoctorId = doctorId,
            Date = date,
            AvailableTimeSlots = available
        };
    }

    public async Task<DoctorResponseDto> CreateAsync(DoctorCreateRequestDto request, CancellationToken cancellationToken)
    {
        var specialty = await _specialtyRepository.GetByIdAsync(request.SpecialtyId, cancellationToken);
        if (specialty is null)
            throw new NotFoundException("Specialty not found.");

        var doctor = new Doctor
        {
            Name = request.Name.Trim(),
            SpecialtyId = request.SpecialtyId,
            ImageUrl = request.ImageUrl
        };

        await _doctorRepository.CreateAsync(doctor, cancellationToken);

        return new DoctorResponseDto
        {
            Id = doctor.Id,
            Name = doctor.Name,
            SpecialtyId = specialty.Id,
            SpecialtyName = specialty.Name,
            ImageUrl = doctor.ImageUrl
        };
    }

    public async Task<DoctorResponseDto> UpdateAsync(Guid id, DoctorUpdateRequestDto request, CancellationToken cancellationToken)
    {
        var specialty = await _specialtyRepository.GetByIdAsync(request.SpecialtyId, cancellationToken);
        if (specialty is null)
            throw new NotFoundException("Specialty not found.");

        var updated = new Doctor
        {
            Id = id,
            Name = request.Name.Trim(),
            SpecialtyId = request.SpecialtyId,
            ImageUrl = request.ImageUrl
        };

        var ok = await _doctorRepository.UpdateAsync(updated, cancellationToken);
        if (!ok)
            throw new NotFoundException("Doctor not found.");

        return new DoctorResponseDto
        {
            Id = id,
            Name = updated.Name,
            SpecialtyId = specialty.Id,
            SpecialtyName = specialty.Name,
            ImageUrl = updated.ImageUrl
        };
    }

    public async Task DeleteAsync(Guid id, CancellationToken cancellationToken)
    {
        var ok = await _doctorRepository.DeleteAsync(id, cancellationToken);
        if (!ok)
            throw new NotFoundException("Doctor not found.");
    }

    private static DoctorResponseDto MapToDto(Doctor doctor)
    {
        // DoctorRepository includes Specialty via Include() so SpecialtyName should be present.
        return new DoctorResponseDto
        {
            Id = doctor.Id,
            Name = doctor.Name,
            SpecialtyId = doctor.SpecialtyId,
            SpecialtyName = doctor.Specialty?.Name ?? string.Empty,
            ImageUrl = doctor.ImageUrl
        };
    }
}

