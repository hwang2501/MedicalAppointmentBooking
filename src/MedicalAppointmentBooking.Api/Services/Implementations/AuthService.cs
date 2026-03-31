using MedicalAppointmentBooking.Api.DTOs.Auth;
using MedicalAppointmentBooking.Api.Helpers;
using MedicalAppointmentBooking.Api.Helpers.Exceptions;
using MedicalAppointmentBooking.Api.Models.Enums;
using MedicalAppointmentBooking.Api.Repositories.Interfaces;
using MedicalAppointmentBooking.Api.Security.Jwt;
using MedicalAppointmentBooking.Api.Services.Interfaces;
using MedicalAppointmentBooking.Api.Models.Entities;

namespace MedicalAppointmentBooking.Api.Services.Implementations;

public class AuthService : IAuthService
{
    private readonly IUserRepository _userRepository;
    private readonly IJwtTokenGenerator _jwtTokenGenerator;

    public AuthService(IUserRepository userRepository, IJwtTokenGenerator jwtTokenGenerator)
    {
        _userRepository = userRepository;
        _jwtTokenGenerator = jwtTokenGenerator;
    }

    public async Task<AuthResponseDto> RegisterAsync(RegisterRequestDto request, CancellationToken cancellationToken)
    {
        var username = request.Username.Trim();

        var existing = await _userRepository.GetByUsernameAsync(username, cancellationToken);
        if (existing is not null)
            throw new ConflictException("Username is already taken.");

        var user = new User
        {
            Username = username,
            PasswordHash = PasswordHasher.HashPassword(request.Password),
            Role = UserRole.Patient
        };

        await _userRepository.CreateAsync(user, cancellationToken);

        return CreateAuthResponse(user);
    }

    public async Task<AuthResponseDto> LoginAsync(LoginRequestDto request, CancellationToken cancellationToken)
    {
        var username = request.Username.Trim();

        var user = await _userRepository.GetByUsernameAsync(username, cancellationToken);
        if (user is null)
            throw new UnauthorizedException("Invalid username or password.");

        var isValid = PasswordHasher.VerifyPassword(request.Password, user.PasswordHash);
        if (!isValid)
            throw new UnauthorizedException("Invalid username or password.");

        return CreateAuthResponse(user);
    }

    private AuthResponseDto CreateAuthResponse(User user)
    {
        var tokenResult = _jwtTokenGenerator.GenerateToken(user.Id, user.Username, user.Role);

        return new AuthResponseDto
        {
            AccessToken = tokenResult.Token,
            ExpiresAt = tokenResult.ExpiresAt,
            Username = user.Username,
            Role = user.Role
        };
    }
}

