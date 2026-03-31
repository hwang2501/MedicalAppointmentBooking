using MedicalAppointmentBooking.Api.Models.Enums;

namespace MedicalAppointmentBooking.Api.Security.Jwt;

public record JwtTokenResult(string Token, DateTime ExpiresAt);

public interface IJwtTokenGenerator
{
    JwtTokenResult GenerateToken(Guid userId, string username, UserRole role);
}

