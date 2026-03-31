using MedicalAppointmentBooking.Api.DTOs.AdminPatient;
using MedicalAppointmentBooking.Api.Models.Enums;
using MedicalAppointmentBooking.Api.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MedicalAppointmentBooking.Api.Controllers;

[ApiController]
[Authorize(Roles = nameof(UserRole.Admin))]
[Route("api/admin/patients")]
public class AdminPatientsController : ControllerBase
{
    private readonly IAdminPatientService _adminPatientService;

    public AdminPatientsController(IAdminPatientService adminPatientService)
    {
        _adminPatientService = adminPatientService;
    }

    [HttpGet]
    public async Task<ActionResult<List<AdminPatientListItemResponseDto>>> GetPatients(
        [FromQuery] string? search,
        CancellationToken cancellationToken)
    {
        var result = await _adminPatientService.GetPatientsAsync(search, cancellationToken);
        return Ok(result);
    }

    [HttpGet("{patientId:guid}")]
    public async Task<ActionResult<AdminPatientDetailsResponseDto>> GetPatientDetails(
        [FromRoute] Guid patientId,
        CancellationToken cancellationToken)
    {
        var result = await _adminPatientService.GetPatientDetailsAsync(patientId, cancellationToken);
        return Ok(result);
    }

    [HttpPut("appointments/{appointmentId:guid}/status")]
    public async Task<IActionResult> UpdateAppointmentStatus(
        [FromRoute] Guid appointmentId,
        [FromBody] AdminAppointmentStatusUpdateRequestDto request,
        CancellationToken cancellationToken)
    {
        await _adminPatientService.UpdateAppointmentStatusAsync(appointmentId, request.Status, cancellationToken);
        return NoContent();
    }
}

