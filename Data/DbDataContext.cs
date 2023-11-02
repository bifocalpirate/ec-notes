using Microsoft.EntityFrameworkCore;
using Entities;
namespace Data;

public class DbDataContext : DbContext
{
    public DbSet<EncryptedPayload> EncryptedPayloads { get; set; }

    public DbDataContext(DbContextOptions<DbDataContext> options) : base(options)
    {
    }

    // The following configures EF to create a Sqlite database file in the
    // special "local" folder for your platform.
    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        base.OnConfiguring(optionsBuilder);
    }
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<EncryptedPayload>()
        .HasIndex(e => e.PreviousContentHash);
    }
}