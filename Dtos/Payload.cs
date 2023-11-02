using System.ComponentModel.DataAnnotations;

namespace Dtos;

public class Payload
{
    public Payload() { }    
    public string initialHashContent { get; set; } = string.Empty; 
    [Required]
    public string currentHashContent { get; set; } = string.Empty;
    [Required]
    public string encryptedContent { get; set; } = string.Empty;
}