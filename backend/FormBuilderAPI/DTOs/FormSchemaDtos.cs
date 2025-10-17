namespace FormBuilderAPI.DTOs;

public class CreateFormSchemaDto
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string JsonSchema { get; set; } = string.Empty;
}

public class UpdateFormSchemaDto
{
    public string? Name { get; set; }
    public string? Description { get; set; }
    public string? JsonSchema { get; set; }
}

public class FormSchemaDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string JsonSchema { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
