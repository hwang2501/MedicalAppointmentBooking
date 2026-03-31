using MedicalAppointmentBooking.Api.DTOs.Doctor;
using MedicalAppointmentBooking.Api.Models.Enums;
using MedicalAppointmentBooking.Api.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MedicalAppointmentBooking.Api.Controllers;

[ApiController]
[Route("api/doctors")]
public class DoctorsController : ControllerBase
{
    private readonly IDoctorService _doctorService;

    public DoctorsController(IDoctorService doctorService)
    {
        _doctorService = doctorService;
    }

    // Patient search + admin view (same endpoint).
    [HttpGet]
    public async Task<ActionResult<List<DoctorResponseDto>>> Search(
        [FromQuery] DoctorSearchRequestDto request,
        CancellationToken cancellationToken)
    {
        var result = await _doctorService.SearchAsync(request, cancellationToken);
        return Ok(result);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<DoctorResponseDto>> GetById([FromRoute] Guid id, CancellationToken cancellationToken)
    {
        var result = await _doctorService.GetByIdAsync(id, cancellationToken);
        return Ok(result);
    }

    [HttpGet("{id:guid}/available-slots")]
    public async Task<ActionResult<DoctorAvailabilityResponseDto>> GetAvailableSlots(
        [FromRoute] Guid id,
        [FromQuery] DateOnly date,
        CancellationToken cancellationToken)
    {
        var result = await _doctorService.GetAvailabilityAsync(id, date, cancellationToken);
        return Ok(result);
    }

    [Authorize(Roles = nameof(UserRole.Admin))]
    [HttpPost]
    public async Task<ActionResult<DoctorResponseDto>> Create(
        [FromBody] DoctorCreateRequestDto request,
        CancellationToken cancellationToken)
    {
        var result = await _doctorService.CreateAsync(request, cancellationToken);
        return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
    }

    [Authorize(Roles = nameof(UserRole.Admin))]
    [HttpPut("{id:guid}")]
    public async Task<ActionResult<DoctorResponseDto>> Update(
        [FromRoute] Guid id,
        [FromBody] DoctorUpdateRequestDto request,
        CancellationToken cancellationToken)
    {
        var result = await _doctorService.UpdateAsync(id, request, cancellationToken);
        return Ok(result);
    }

    [Authorize(Roles = nameof(UserRole.Admin))]
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete([FromRoute] Guid id, CancellationToken cancellationToken)
    {
        await _doctorService.DeleteAsync(id, cancellationToken);
        return NoContent();
    }
}

