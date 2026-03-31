using System.Security.Claims;
using MedicalAppointmentBooking.Api.DTOs.Appointment;
using MedicalAppointmentBooking.Api.Models.Enums;
using MedicalAppointmentBooking.Api.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MedicalAppointmentBooking.Api.Controllers;

[ApiController]
[Route("api/appointments")]
public class AppointmentsController : ControllerBase
{
    private readonly IAppointmentService _appointmentService;

    public AppointmentsController(IAppointmentService appointmentService)
    {
        _appointmentService = appointmentService;
    }

    [Authorize(Roles = nameof(UserRole.Patient))]
    [HttpGet("me")]
    public async Task<ActionResult<List<AppointmentResponseDto>>> GetMyAppointments(CancellationToken cancellationToken)
    {
        var userId = GetUserIdOrThrow();
        var result = await _appointmentService.GetMyAppointmentsAsync(userId, cancellationToken);
        return Ok(result);
    }

    [Authorize(Roles = nameof(UserRole.Patient))]
    [HttpPost]
    public async Task<ActionResult<AppointmentResponseDto>> Book(
        [FromBody] AppointmentBookRequestDto request,
        CancellationToken cancellationToken)
    {
        var userId = GetUserIdOrThrow();
        var result = await _appointmentService.BookAsync(userId, request, cancellationToken);
        return Ok(result);
    }

    [Authorize(Roles = nameof(UserRole.Patient))]
    [HttpDelete("{appointmentId:guid}")]
    public async Task<IActionResult> Cancel([FromRoute] Guid appointmentId, CancellationToken cancellationToken)
    {
        var userId = GetUserIdOrThrow();
        await _appointmentService.CancelAsync(userId, appointmentId, cancellationToken);
        return NoContent();
    }

    private Guid GetUserIdOrThrow()
    {
        var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdString, out var userId))
            throw new InvalidOperationException("Invalid user id claim in token.");

        return userId;
    }
}

