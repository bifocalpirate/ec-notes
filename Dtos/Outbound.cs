using System.Text.Json.Serialization;

namespace Dtos;

public class Outbound
{
    public int DbVersion { get; set; } = 1;
    public string Data { get; set; } = string.Empty;
    public string Website { get; set; } = string.Empty;
    public string? PreviousContentHash { get; set; } = null;
}