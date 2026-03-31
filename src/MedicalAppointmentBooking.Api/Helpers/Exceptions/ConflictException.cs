using Microsoft.AspNetCore.Http;

namespace MedicalAppointmentBooking.Api.Helpers.Exceptions;

public sealed class ConflictException : ApiException
{
    public ConflictException(string message)
        : base(message, StatusCodes.Status409Conflict)
    {
    }
}

