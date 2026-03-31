using System.Net;
using MedicalAppointmentBooking.Api.Helpers.Exceptions;
using Microsoft.AspNetCore.Mvc;

namespace MedicalAppointmentBooking.Api.Middleware;

public class ExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionHandlingMiddleware> _logger;

    public ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task Invoke(HttpContext httpContext)
    {
        try
        {
            await _next(httpContext);
        }
        catch (ApiException apiEx)
        {
            _logger.LogWarning(apiEx, "API error: {Message}", apiEx.Message);

            var problem = new ProblemDetails
            {
                Status = apiEx.StatusCode,
                Title = "Request error",
                Detail = apiEx.Message
            };

            httpContext.Response.ContentType = "application/json";
            httpContext.Response.StatusCode = apiEx.StatusCode;
            await httpContext.Response.WriteAsJsonAsync(problem);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unhandled exception");

            var problem = new ProblemDetails
            {
                Status = (int)HttpStatusCode.InternalServerError,
                Title = "Internal server error",
                Detail = "An unexpected error occurred."
            };

            httpContext.Response.ContentType = "application/json";
            httpContext.Response.StatusCode = problem.Status ?? 500;
            await httpContext.Response.WriteAsJsonAsync(problem);
        }
    }
}

