FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["MedicalAppointmentBooking.Api.csproj", "./"]
RUN dotnet restore "./MedicalAppointmentBooking.Api.csproj"
COPY . .
RUN dotnet build "MedicalAppointmentBooking.Api.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "MedicalAppointmentBooking.Api.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "MedicalAppointmentBooking.Api.dll"]
