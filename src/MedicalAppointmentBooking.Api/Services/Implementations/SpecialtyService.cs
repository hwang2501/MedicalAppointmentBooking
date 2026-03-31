using MedicalAppointmentBooking.Api.DTOs.Specialty;
using MedicalAppointmentBooking.Api.Helpers.Exceptions;
using MedicalAppointmentBooking.Api.Models.Entities;
using MedicalAppointmentBooking.Api.Repositories.Interfaces;
using MedicalAppointmentBooking.Api.Services.Interfaces;

namespace MedicalAppointmentBooking.Api.Services.Implementations;

public class SpecialtyService : ISpecialtyService
{
    private readonly ISpecialtyRepository _specialtyRepository;

    public SpecialtyService(ISpecialtyRepository specialtyRepository)
    {
        _specialtyRepository = specialtyRepository;
    }

    public async Task<List<SpecialtyResponseDto>> GetAllAsync(CancellationToken cancellationToken)
    {
        var specialties = await _specialtyRepository.GetAllAsync(cancellationToken);

        return specialties
            .Select(x => new SpecialtyResponseDto { Id = x.Id, Name = x.Name })
            .ToList();
    }

    public async Task<SpecialtyResponseDto> GetByIdAsync(Guid id, CancellationToken cancellationToken)
    {
        var specialty = await _specialtyRepository.GetByIdAsync(id, cancellationToken);
        if (specialty is null)
            throw new NotFoundException("Specialty not found.");

        return new SpecialtyResponseDto { Id = specialty.Id, Name = specialty.Name };
    }

    public async Task<SpecialtyResponseDto> CreateAsync(SpecialtyCreateRequestDto request, CancellationToken cancellationToken)
    {
        var specialty = new Specialty
        {
            Name = request.Name.Trim()
        };

        await _specialtyRepository.CreateAsync(specialty, cancellationToken);

        return new SpecialtyResponseDto { Id = specialty.Id, Name = specialty.Name };
    }

    public async Task<SpecialtyResponseDto> UpdateAsync(Guid id, SpecialtyUpdateRequestDto request, CancellationToken cancellationToken)
    {
        var updated = new Specialty
        {
            Id = id,
            Name = request.Name.Trim()
        };

        var ok = await _specialtyRepository.UpdateAsync(updated, cancellationToken);
        if (!ok)
            throw new NotFoundException("Specialty not found.");

        return new SpecialtyResponseDto { Id = id, Name = updated.Name };
    }

    public async Task DeleteAsync(Guid id, CancellationToken cancellationToken)
    {
        var ok = await _specialtyRepository.DeleteAsync(id, cancellationToken);
        if (!ok)
            throw new NotFoundException("Specialty not found.");
    }
}

