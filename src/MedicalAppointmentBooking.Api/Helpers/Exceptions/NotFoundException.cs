using Microsoft.AspNetCore.Http;

namespace MedicalAppointmentBooking.Api.Helpers.Exceptions;

public sealed class NotFoundException : ApiException
{
    public NotFoundException(string message)
        : base(message, StatusCodes.Status404NotFound)
    {
    }
}

