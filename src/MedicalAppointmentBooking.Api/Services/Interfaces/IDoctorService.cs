using MedicalAppointmentBooking.Api.DTOs.Doctor;

namespace MedicalAppointmentBooking.Api.Services.Interfaces;

public interface IDoctorService
{
    Task<List<DoctorResponseDto>> GetAllAsync(CancellationToken cancellationToken);
    Task<DoctorResponseDto> GetByIdAsync(Guid id, CancellationToken cancellationToken);

    Task<List<DoctorResponseDto>> SearchAsync(DoctorSearchRequestDto request, CancellationToken cancellationToken);
    Task<DoctorAvailabilityResponseDto> GetAvailabilityAsync(Guid doctorId, DateOnly date, CancellationToken cancellationToken);

    Task<DoctorResponseDto> CreateAsync(DoctorCreateRequestDto request, CancellationToken cancellationToken);
    Task<DoctorResponseDto> UpdateAsync(Guid id, DoctorUpdateRequestDto request, CancellationToken cancellationToken);
    Task DeleteAsync(Guid id, CancellationToken cancellationToken);
}

