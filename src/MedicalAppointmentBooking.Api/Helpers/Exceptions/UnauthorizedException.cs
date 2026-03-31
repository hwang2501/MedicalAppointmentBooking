using Microsoft.AspNetCore.Http;

namespace MedicalAppointmentBooking.Api.Helpers.Exceptions;

public sealed class UnauthorizedException : ApiException
{
    public UnauthorizedException(string message)
        : base(message, StatusCodes.Status401Unauthorized)
    {
    }
}

