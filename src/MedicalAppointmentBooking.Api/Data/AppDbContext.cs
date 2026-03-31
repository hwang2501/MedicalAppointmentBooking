using MedicalAppointmentBooking.Api.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace MedicalAppointmentBooking.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();
    public DbSet<Specialty> Specialties => Set<Specialty>();
    public DbSet<Doctor> Doctors => Set<Doctor>();
    public DbSet<Appointment> Appointments => Set<Appointment>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<Specialty>(e =>
        {
            e.ToTable("Specialties");
            e.HasKey(x => x.Id);

            e.Property(x => x.Name)
                .HasMaxLength(200)
                .IsRequired();
        });

        builder.Entity<Doctor>(e =>
        {
            e.ToTable("Doctors");
            e.HasKey(x => x.Id);

            e.Property(x => x.Name)
                .HasMaxLength(200)
                .IsRequired();

            e.HasOne(x => x.Specialty)
                .WithMany(s => s.Doctors)
                .HasForeignKey(x => x.SpecialtyId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        builder.Entity<User>(e =>
        {
            e.ToTable("Users");
            e.HasKey(x => x.Id);

            e.Property(x => x.Username)
                .HasMaxLength(100)
                .IsRequired();

            e.HasIndex(x => x.Username)
                .IsUnique();

            e.Property(x => x.PasswordHash)
                .HasMaxLength(500)
                .IsRequired();
        });

        builder.Entity<Appointment>(e =>
        {
            e.ToTable("Appointments");
            e.HasKey(x => x.Id);

            e.Property(x => x.AppointmentDate)
                .HasColumnType("date")
                .IsRequired();

            e.Property(x => x.TimeSlot)
                .HasMaxLength(50)
                .IsRequired();

            e.Property(x => x.Status)
                .IsRequired();

            e.HasOne(x => x.User)
                .WithMany()
                .HasForeignKey(x => x.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            e.HasOne(x => x.Doctor)
                .WithMany(d => d.Appointments)
                .HasForeignKey(x => x.DoctorId)
                .OnDelete(DeleteBehavior.Restrict);

            // Prevent double booking for active scheduled appointments.
            // AppointmentStatus.Scheduled underlying value = 1
            e.HasIndex(x => new { x.DoctorId, x.AppointmentDate, x.TimeSlot })
                .IsUnique()
                .HasFilter("[Status] = 1");
        });
    }
}

