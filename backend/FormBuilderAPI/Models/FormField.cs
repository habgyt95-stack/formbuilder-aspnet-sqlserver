namespace FormBuilderAPI.Models;

public class FormField
{
    public int Id { get; set; }
    public int FormSchemaId { get; set; }
    public string FieldName { get; set; } = string.Empty;
    public string FieldLabel { get; set; } = string.Empty;
    public string InputType { get; set; } = string.Empty;
    public bool IsRequired { get; set; }
    public string? Placeholder { get; set; }
    public string? DefaultValue { get; set; }
    public string? ValidationRules { get; set; }
    public int Order { get; set; }
    
    public FormSchema? FormSchema { get; set; }
}
