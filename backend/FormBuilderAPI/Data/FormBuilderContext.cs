using Microsoft.EntityFrameworkCore;
using FormBuilderAPI.Models;

namespace FormBuilderAPI.Data;

public class FormBuilderContext : DbContext
{
    public FormBuilderContext(DbContextOptions<FormBuilderContext> options) : base(options)
    {
    }

    public DbSet<FormSchema> FormSchemas { get; set; }
    public DbSet<FormField> FormFields { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<FormSchema>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Description).HasMaxLength(1000);
            entity.Property(e => e.JsonSchema).IsRequired();
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("GETUTCDATE()");
            entity.Property(e => e.UpdatedAt).HasDefaultValueSql("GETUTCDATE()");
        });

        modelBuilder.Entity<FormField>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.FieldName).IsRequired().HasMaxLength(100);
            entity.Property(e => e.FieldLabel).IsRequired().HasMaxLength(200);
            entity.Property(e => e.InputType).IsRequired().HasMaxLength(50);
            
            entity.HasOne(e => e.FormSchema)
                .WithMany()
                .HasForeignKey(e => e.FormSchemaId)
                .OnDelete(DeleteBehavior.Cascade);
        });
    }
}
