# Form Builder - Technical Implementation Details

## Architecture Overview

This is a production-ready standalone Form Builder application consisting of:
- **Frontend**: React 18 + Vite 7 + TypeScript (UMD bundle)
- **Backend**: ASP.NET Core 9 Web API + Entity Framework Core + SQL Server

## Frontend Technical Stack

### Core Dependencies
- **React 18.3**: UI framework
- **TypeScript 5**: Type safety
- **Vite 7.1**: Build tool and dev server
- **Tailwind CSS 4**: Utility-first CSS framework
- **@tailwindcss/postcss**: PostCSS plugin for Tailwind v4
- **tailwindcss-rtl**: RTL support plugin
- **react-i18next**: Internationalization
- **i18next**: i18n framework
- **axios**: HTTP client

### Build Configuration
- **Output**: UMD bundle (`formbuilder.js` + `formbuilder.css`)
- **Entry Point**: `src/main.tsx`
- **Bundle Size**: ~667KB JS + ~4.4KB CSS (production)
- **Global Export**: `window.mountFormBuilder(container, options)`

### Component Structure
```
src/
├── components/
│   ├── FormBuilder.tsx       # Main container component
│   ├── FormBuilderGrid.tsx   # Editable grid component
│   ├── Button.tsx            # Reusable button component
│   ├── Input.tsx             # Reusable input component
│   └── Select.tsx            # Reusable select component
├── api/
│   └── formSchemaApi.ts      # API client for backend
├── types/
│   └── index.ts              # TypeScript type definitions
├── i18n/
│   └── config.ts             # i18n configuration (en/fa)
├── App.tsx                   # App wrapper
└── main.tsx                  # Entry point with mount function
```

### CSS Variables (fb- prefix)
```css
--fb-primary: #3b82f6;
--fb-secondary: #64748b;
--fb-background: #ffffff;
--fb-foreground: #0f172a;
--fb-border: #e2e8f0;
--fb-muted: #f1f5f9;
--fb-accent: #8b5cf6;
--fb-success: #10b981;
--fb-warning: #f59e0b;
--fb-error: #ef4444;
```

### Mounting the Form Builder

```javascript
// Standalone usage
window.mountFormBuilder(
  document.getElementById('container'),
  {
    apiUrl: 'http://localhost:5000/api',
    language: 'en', // or 'fa'
    onInit: () => console.log('Initialized'),
    onSave: (schema) => console.log('Saved:', schema)
  }
);
```

### iframe Integration

The application sends postMessage events:
- `{ type: 'init' }` - When initialized
- `{ type: 'changed', data: { fields } }` - When form structure changes
- `{ type: 'saved', data: { name, fields } }` - When form is saved

## Backend Technical Stack

### Core Dependencies
- **ASP.NET Core 9**: Web framework
- **Entity Framework Core 9**: ORM
- **Microsoft.EntityFrameworkCore.SqlServer**: SQL Server provider
- **Microsoft.EntityFrameworkCore.InMemory**: In-memory database for testing
- **Swashbuckle.AspNetCore**: Swagger/OpenAPI

### Project Structure
```
backend/FormBuilderAPI/
├── Controllers/
│   └── FormSchemasController.cs    # REST API endpoints
├── Models/
│   ├── FormSchema.cs               # Form schema entity
│   └── FormField.cs                # Form field entity
├── Data/
│   └── FormBuilderContext.cs       # DbContext
├── DTOs/
│   └── FormSchemaDtos.cs           # Data transfer objects
├── Migrations/                      # EF Core migrations
└── Program.cs                       # Application configuration
```

### Database Models

**FormSchema**
- Id (int, PK)
- Name (string, max 200)
- Description (string, max 1000)
- JsonSchema (string, JSON)
- CreatedAt (datetime)
- UpdatedAt (datetime)

**FormField** (for future extensions)
- Id (int, PK)
- FormSchemaId (int, FK)
- FieldName (string, max 100)
- FieldLabel (string, max 200)
- InputType (string, max 50)
- IsRequired (bool)
- Placeholder (string, nullable)
- DefaultValue (string, nullable)
- ValidationRules (string, nullable)
- Order (int)

### API Endpoints

#### GET /api/FormSchemas
Returns all form schemas, ordered by UpdatedAt descending.

**Response**: `FormSchemaDto[]`

#### GET /api/FormSchemas/{id}
Returns a specific form schema by ID.

**Response**: `FormSchemaDto`

#### POST /api/FormSchemas
Creates a new form schema.

**Request**: `CreateFormSchemaDto`
```json
{
  "name": "Contact Form",
  "description": "A simple contact form",
  "jsonSchema": "{\"fields\":[...]}"
}
```

**Response**: `FormSchemaDto`

#### PUT /api/FormSchemas/{id}
Updates an existing form schema.

**Request**: `UpdateFormSchemaDto`
```json
{
  "name": "Updated Name",
  "description": "Updated description",
  "jsonSchema": "{\"fields\":[...]}"
}
```

#### DELETE /api/FormSchemas/{id}
Deletes a form schema.

#### POST /api/FormSchemas/export
Exports selected form schemas.

**Request**: `int[]` (array of schema IDs)
**Response**: `FormSchemaDto[]`

#### POST /api/FormSchemas/import
Imports form schemas.

**Request**: `CreateFormSchemaDto[]`
**Response**: `FormSchemaDto[]` (imported schemas)

### Configuration

**appsettings.json**
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=...;Database=FormBuilderDB;..."
  }
}
```

**appsettings.Development.json**
```json
{
  "UseInMemoryDatabase": true  // Set to false for SQL Server
}
```

## Features Implemented

### Form Builder Grid
- ✅ Add/remove fields dynamically
- ✅ Inline editing of all field properties
- ✅ Reorder fields with up/down arrows
- ✅ Field validation (required flag)
- ✅ Support for 7 input types

### Input Types Supported
1. **text** - Single-line text
2. **number** - Numeric input
3. **email** - Email with validation
4. **date** - Date picker
5. **select** - Dropdown selection
6. **checkbox** - Boolean checkbox
7. **textarea** - Multi-line text

### Internationalization (i18n)
- English (en) - LTR
- Farsi/Persian (fa) - RTL
- Toggle button in header
- Automatic direction change
- All UI elements translated

### Export/Import
- Export individual forms as JSON
- Import multiple forms from JSON file
- Preserves form structure and metadata

### CORS Configuration
- Allows all origins (for development)
- Configurable in production

### Swagger/OpenAPI
- Available at root URL (/)
- Interactive API documentation
- Try-it-out functionality

## Development Workflow

### Running Locally

**Backend**:
```bash
cd backend/FormBuilderAPI
dotnet run
# Server starts at http://localhost:5000
```

**Frontend**:
```bash
cd frontend
npm install
npm run dev
# Dev server starts at http://localhost:3000
```

### Building for Production

**Backend**:
```bash
cd backend/FormBuilderAPI
dotnet publish -c Release -o ./publish
```

**Frontend**:
```bash
cd frontend
npm run build
# Output: dist/formbuilder.js and dist/formbuilder.css
```

## Testing Strategy (Not Implemented)

As per requirements, no tests are included. However, the application has been:
- ✅ Manually tested with all CRUD operations
- ✅ Verified with both English and Farsi languages
- ✅ Tested with in-memory database
- ✅ Validated with Swagger UI
- ✅ Tested iframe integration patterns
- ✅ Verified export/import functionality

## Performance Considerations

### Frontend
- Code splitting not enabled (UMD bundle requirement)
- All dependencies bundled into single file
- CSS extracted to separate file
- No lazy loading (standalone bundle)

### Backend
- In-memory caching not implemented
- Direct database queries
- CORS configured for all origins (should be restricted in production)

## Security Considerations

### Frontend
- XSS protection via React's built-in escaping
- No sensitive data stored in localStorage
- postMessage events use wildcard origin (should be restricted in production)

### Backend
- No authentication/authorization implemented
- CORS allows all origins (should be restricted)
- SQL injection prevented by EF Core parameterization
- JSON validation on schema creation

## Browser Compatibility

Tested and working in:
- ✅ Chrome 130+
- ✅ Firefox (latest)
- Expected to work in all modern browsers supporting ES2020+

## Known Limitations

1. No authentication/authorization
2. No data persistence in in-memory mode (restarts reset data)
3. No real-time collaboration
4. No form versioning/history
5. No validation rule builder (stored as JSON string)
6. No custom input types beyond the 7 supported

## Future Enhancements (Not Implemented)

- Form templates
- Conditional field visibility
- Custom validation rules UI
- Form submissions storage
- Multi-step forms
- Form analytics
- Role-based access control
- WebSocket for real-time updates
- Form preview/rendering
- PDF export

## Deployment Notes

### Frontend
- Serve `dist/formbuilder.js` and `dist/formbuilder.css` from CDN or static server
- Include in any HTML page with simple script tag
- Configure `apiUrl` in mount options

### Backend
- Deploy to IIS, Azure App Service, or any ASP.NET Core hosting
- Configure connection string for production SQL Server
- Set `UseInMemoryDatabase` to false
- Configure CORS for specific origins
- Enable HTTPS in production

## License

This project is provided as-is for demonstration purposes.
