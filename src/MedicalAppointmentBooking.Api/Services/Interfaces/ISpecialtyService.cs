using MedicalAppointmentBooking.Api.DTOs.Specialty;

namespace MedicalAppointmentBooking.Api.Services.Interfaces;

public interface ISpecialtyService
{
    Task<List<SpecialtyResponseDto>> GetAllAsync(CancellationToken cancellationToken);
    Task<SpecialtyResponseDto> GetByIdAsync(Guid id, CancellationToken cancellationToken);

    Task<SpecialtyResponseDto> CreateAsync(SpecialtyCreateRequestDto request, CancellationToken cancellationToken);
    Task<SpecialtyResponseDto> UpdateAsync(Guid id, SpecialtyUpdateRequestDto request, CancellationToken cancellationToken);
    Task DeleteAsync(Guid id, CancellationToken cancellationToken);
}

