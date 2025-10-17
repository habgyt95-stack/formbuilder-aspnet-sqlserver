using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FormBuilderAPI.Data;
using FormBuilderAPI.Models;
using FormBuilderAPI.DTOs;
using System.Text.Json;

namespace FormBuilderAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class FormSchemasController : ControllerBase
{
    private readonly FormBuilderContext _context;
    private readonly ILogger<FormSchemasController> _logger;

    public FormSchemasController(FormBuilderContext context, ILogger<FormSchemasController> logger)
    {
        _context = context;
        _logger = logger;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<FormSchemaDto>>> GetFormSchemas()
    {
        var schemas = await _context.FormSchemas
            .OrderByDescending(s => s.UpdatedAt)
            .ToListAsync();

        return Ok(schemas.Select(s => new FormSchemaDto
        {
            Id = s.Id,
            Name = s.Name,
            Description = s.Description,
            JsonSchema = s.JsonSchema,
            CreatedAt = s.CreatedAt,
            UpdatedAt = s.UpdatedAt
        }));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<FormSchemaDto>> GetFormSchema(int id)
    {
        var schema = await _context.FormSchemas.FindAsync(id);

        if (schema == null)
        {
            return NotFound();
        }

        return Ok(new FormSchemaDto
        {
            Id = schema.Id,
            Name = schema.Name,
            Description = schema.Description,
            JsonSchema = schema.JsonSchema,
            CreatedAt = schema.CreatedAt,
            UpdatedAt = schema.UpdatedAt
        });
    }

    [HttpPost]
    public async Task<ActionResult<FormSchemaDto>> CreateFormSchema(CreateFormSchemaDto dto)
    {
        // Validate JSON schema
        try
        {
            JsonDocument.Parse(dto.JsonSchema);
        }
        catch (JsonException)
        {
            return BadRequest("Invalid JSON schema format");
        }

        var schema = new FormSchema
        {
            Name = dto.Name,
            Description = dto.Description,
            JsonSchema = dto.JsonSchema,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.FormSchemas.Add(schema);
        await _context.SaveChangesAsync();

        var result = new FormSchemaDto
        {
            Id = schema.Id,
            Name = schema.Name,
            Description = schema.Description,
            JsonSchema = schema.JsonSchema,
            CreatedAt = schema.CreatedAt,
            UpdatedAt = schema.UpdatedAt
        };

        return CreatedAtAction(nameof(GetFormSchema), new { id = schema.Id }, result);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateFormSchema(int id, UpdateFormSchemaDto dto)
    {
        var schema = await _context.FormSchemas.FindAsync(id);

        if (schema == null)
        {
            return NotFound();
        }

        if (dto.Name != null)
            schema.Name = dto.Name;

        if (dto.Description != null)
            schema.Description = dto.Description;

        if (dto.JsonSchema != null)
        {
            // Validate JSON schema
            try
            {
                JsonDocument.Parse(dto.JsonSchema);
                schema.JsonSchema = dto.JsonSchema;
            }
            catch (JsonException)
            {
                return BadRequest("Invalid JSON schema format");
            }
        }

        schema.UpdatedAt = DateTime.UtcNow;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!await FormSchemaExists(id))
            {
                return NotFound();
            }
            throw;
        }

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteFormSchema(int id)
    {
        var schema = await _context.FormSchemas.FindAsync(id);
        if (schema == null)
        {
            return NotFound();
        }

        _context.FormSchemas.Remove(schema);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpPost("export")]
    public async Task<ActionResult> ExportFormSchemas([FromBody] int[] ids)
    {
        var schemas = await _context.FormSchemas
            .Where(s => ids.Contains(s.Id))
            .ToListAsync();

        if (!schemas.Any())
        {
            return NotFound("No schemas found with the provided IDs");
        }

        var export = schemas.Select(s => new FormSchemaDto
        {
            Id = s.Id,
            Name = s.Name,
            Description = s.Description,
            JsonSchema = s.JsonSchema,
            CreatedAt = s.CreatedAt,
            UpdatedAt = s.UpdatedAt
        });

        return Ok(export);
    }

    [HttpPost("import")]
    public async Task<ActionResult<IEnumerable<FormSchemaDto>>> ImportFormSchemas([FromBody] List<CreateFormSchemaDto> schemas)
    {
        var imported = new List<FormSchemaDto>();

        foreach (var dto in schemas)
        {
            // Validate JSON schema
            try
            {
                JsonDocument.Parse(dto.JsonSchema);
            }
            catch (JsonException)
            {
                continue; // Skip invalid schemas
            }

            var schema = new FormSchema
            {
                Name = dto.Name,
                Description = dto.Description,
                JsonSchema = dto.JsonSchema,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.FormSchemas.Add(schema);
            await _context.SaveChangesAsync();

            imported.Add(new FormSchemaDto
            {
                Id = schema.Id,
                Name = schema.Name,
                Description = schema.Description,
                JsonSchema = schema.JsonSchema,
                CreatedAt = schema.CreatedAt,
                UpdatedAt = schema.UpdatedAt
            });
        }

        return Ok(imported);
    }

    private async Task<bool> FormSchemaExists(int id)
    {
        return await _context.FormSchemas.AnyAsync(e => e.Id == id);
    }
}
