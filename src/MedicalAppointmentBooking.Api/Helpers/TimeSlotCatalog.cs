namespace MedicalAppointmentBooking.Api.Helpers;

public static class TimeSlotCatalog
{
    public static readonly IReadOnlyList<string> AllowedSlots = new[]
    {
        "09:00-09:30",
        "09:30-10:00",
        "10:00-10:30",
        "10:30-11:00",
        "13:00-13:30",
        "13:30-14:00",
        "14:00-14:30",
        "14:30-15:00"
    };

    public static bool IsValid(string? slot)
    {
        if (string.IsNullOrWhiteSpace(slot)) return false;
        return AllowedSlots.Contains(slot.Trim(), StringComparer.Ordinal);
    }
}

