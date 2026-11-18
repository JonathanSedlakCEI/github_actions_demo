namespace DocumentApi.Models;

public sealed class Document
{
    public int Id { get; init; }
    public string Name { get; init; } = string.Empty;
    public string Description { get; init; } = string.Empty;
    public string Category { get; init; } = string.Empty;
    public string FileType { get; init; } = string.Empty;
    public DateTime LastModified { get; init; }
}
