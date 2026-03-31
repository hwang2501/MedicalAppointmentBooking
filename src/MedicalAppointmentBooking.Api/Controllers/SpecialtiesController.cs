using MedicalAppointmentBooking.Api.DTOs.Specialty;
using MedicalAppointmentBooking.Api.Models.Enums;
using MedicalAppointmentBooking.Api.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MedicalAppointmentBooking.Api.Controllers;

[ApiController]
[Route("api/specialties")]
public class SpecialtiesController : ControllerBase
{
    private readonly ISpecialtyService _specialtyService;

    public SpecialtiesController(ISpecialtyService specialtyService)
    {
        _specialtyService = specialtyService;
    }

    [HttpGet]
    public async Task<ActionResult<List<SpecialtyResponseDto>>> GetAll(CancellationToken cancellationToken)
    {
        var result = await _specialtyService.GetAllAsync(cancellationToken);
        return Ok(result);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<SpecialtyResponseDto>> GetById([FromRoute] Guid id, CancellationToken cancellationToken)
    {
        var result = await _specialtyService.GetByIdAsync(id, cancellationToken);
        return Ok(result);
    }

    [Authorize(Roles = nameof(UserRole.Admin))]
    [HttpPost]
    public async Task<ActionResult<SpecialtyResponseDto>> Create(
        [FromBody] SpecialtyCreateRequestDto request,
        CancellationToken cancellationToken)
    {
        var result = await _specialtyService.CreateAsync(request, cancellationToken);
        return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
    }

    [Authorize(Roles = nameof(UserRole.Admin))]
    [HttpPut("{id:guid}")]
    public async Task<ActionResult<SpecialtyResponseDto>> Update(
        [FromRoute] Guid id,
        [FromBody] SpecialtyUpdateRequestDto request,
        CancellationToken cancellationToken)
    {
        var result = await _specialtyService.UpdateAsync(id, request, cancellationToken);
        return Ok(result);
    }

    [Authorize(Roles = nameof(UserRole.Admin))]
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete([FromRoute] Guid id, CancellationToken cancellationToken)
    {
        await _specialtyService.DeleteAsync(id, cancellationToken);
        return NoContent();
    }
}

