using Microsoft.EntityFrameworkCore;

namespace ImageAPI.Models;

public class EncodeContext : DbContext
{
    public EncodeContext(DbContextOptions<EncodeContext> options) : base(options)
    { }

    public DbSet<EncodeString> EncodeStrings { get; set; } = null!;
}
