using System.ComponentModel.DataAnnotations;

public abstract class BaseEntity
{
    [Key]
    public long Id { get; set; }
    public DateTime DateCreated { get; set; }
    public DateTime DateUpdated { get; set; }
}