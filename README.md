# Form Builder - ASP.NET Core + React

A production-ready standalone Form Builder application with a React+Vite+TypeScript frontend and ASP.NET Core Web API backend with SQL Server and Entity Framework Core.

## Features

### Frontend
- ✅ **React + Vite + TypeScript** - Modern, fast development experience
- ✅ **Mountable Bundle** - Exposes `window.mountFormBuilder(container, opts)` for easy integration
- ✅ **iframe Support** - postMessage events for `init`, `changed`, and `saved`
- ✅ **Editable Grid** - Interactive form builder with drag-to-reorder fields
- ✅ **Column Input Types** - Support for text, number, email, date, select, checkbox, textarea
- ✅ **Tailwind CSS + Custom CSS Variables** - Using `fb-` prefix for scoped styling
- ✅ **RTL Support** - Full RTL support with Tailwind RTL plugin
- ✅ **i18n** - Internationalization support for English and Farsi (Persian)
- ✅ **Export/Import** - JSON export and import functionality

### Backend
- ✅ **ASP.NET Core Web API** - RESTful API with C#
- ✅ **SQL Server + Entity Framework Core** - Database with migrations
- ✅ **Swagger/OpenAPI** - Interactive API documentation
- ✅ **JSON Schema Storage** - Store form definitions as JSON
- ✅ **CRUD Operations** - Full Create, Read, Update, Delete support
- ✅ **Export/Import API** - Endpoints for bulk operations
- ✅ **CORS Enabled** - Cross-origin resource sharing for frontend integration

## Project Structure

```
formbuilder-aspnet-sqlserver/
├── backend/
│   └── FormBuilderAPI/
│       ├── Controllers/         # API Controllers
│       ├── Data/               # DbContext and migrations
│       ├── Models/             # Entity models
│       ├── DTOs/               # Data transfer objects
│       └── Program.cs          # Application entry point
│
├── frontend/
│   ├── src/
│   │   ├── api/               # API client
│   │   ├── components/        # React components
│   │   ├── i18n/              # Internationalization
│   │   ├── types/             # TypeScript types
│   │   ├── App.tsx            # Main App component
│   │   └── main.tsx           # Entry point with mountFormBuilder
│   ├── demo-standalone.html   # Standalone demo
│   ├── demo-iframe.html       # iframe demo
│   └── vite.config.ts         # Vite configuration
│
└── README.md
```

## Prerequisites

- [.NET SDK 9.0+](https://dotnet.microsoft.com/download)
- [Node.js 20+](https://nodejs.org/)
- [SQL Server](https://www.microsoft.com/en-us/sql-server/sql-server-downloads) or LocalDB

## Getting Started

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend/FormBuilderAPI
   ```

2. Update the connection string in `appsettings.json` if needed:
   ```json
   "ConnectionStrings": {
     "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=FormBuilderDB;Trusted_Connection=true;MultipleActiveResultSets=true;TrustServerCertificate=true"
   }
   ```

3. Run the application:
   ```bash
   dotnet run
   ```

   The API will start at `http://localhost:5000`
   Swagger UI will be available at `http://localhost:5000` (root)

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. For development:
   ```bash
   npm run dev
   ```
   The app will start at `http://localhost:3000`

4. To build the production bundle:
   ```bash
   npm run build
   ```
   The bundle will be generated in `dist/` folder as:
   - `formbuilder.js` - JavaScript bundle
   - `formbuilder.css` - CSS bundle

## Usage

### Standalone Mode

Include the built files and mount the form builder:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <link rel="stylesheet" href="./dist/formbuilder.css">
</head>
<body>
  <div id="formbuilder-container"></div>

  <script src="./dist/formbuilder.js"></script>
  <script>
    window.mountFormBuilder(
      document.getElementById('formbuilder-container'),
      {
        apiUrl: 'http://localhost:5000/api',
        language: 'en', // or 'fa' for Farsi
        onInit: () => {
          console.log('Form Builder initialized');
        },
        onSave: (schema) => {
          console.log('Form saved:', schema);
        }
      }
    );
  </script>
</body>
</html>
```

### iframe Mode

Embed the form builder in an iframe and listen for postMessage events:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <title>Form Builder - iframe Mode</title>
</head>
<body>
  <iframe src="http://localhost:3000" id="formbuilder-iframe"></iframe>

  <script>
    window.addEventListener('message', (event) => {
      switch(event.data.type) {
        case 'init':
          console.log('Form Builder initialized');
          break;
        case 'changed':
          console.log('Form changed:', event.data.data);
          break;
        case 'saved':
          console.log('Form saved:', event.data.data);
          break;
      }
    });
  </script>
</body>
</html>
```

## API Endpoints

The backend exposes the following REST API endpoints:

### Form Schemas

- `GET /api/FormSchemas` - Get all form schemas
- `GET /api/FormSchemas/{id}` - Get a specific form schema
- `POST /api/FormSchemas` - Create a new form schema
- `PUT /api/FormSchemas/{id}` - Update a form schema
- `DELETE /api/FormSchemas/{id}` - Delete a form schema
- `POST /api/FormSchemas/export` - Export selected schemas (JSON)
- `POST /api/FormSchemas/import` - Import schemas from JSON

### Example Request

```bash
curl -X POST http://localhost:5000/api/FormSchemas \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Contact Form",
    "description": "A simple contact form",
    "jsonSchema": "{\"fields\":[{\"id\":\"field-1\",\"fieldName\":\"name\",\"fieldLabel\":\"Name\",\"inputType\":\"text\",\"isRequired\":true,\"order\":0}]}"
  }'
```

## Features in Detail

### Editable Grid

The form builder provides an interactive grid where you can:
- ✅ Add new fields with the "Add Field" button
- ✅ Edit field properties inline (name, label, type, etc.)
- ✅ Reorder fields using up/down arrows
- ✅ Mark fields as required with checkboxes
- ✅ Delete fields with the delete button
- ✅ Set placeholders and default values

### Supported Input Types

- **text** - Single-line text input
- **number** - Numeric input
- **email** - Email validation
- **date** - Date picker
- **select** - Dropdown selection
- **checkbox** - Boolean checkbox
- **textarea** - Multi-line text input

### Internationalization

The application supports English and Farsi (Persian) languages. Switch languages using the language toggle button in the top-right corner.

### CSS Variables

The application uses custom CSS variables with the `fb-` prefix for theming:

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

## Demo

Two demo HTML files are included:

1. **demo-standalone.html** - Shows standalone integration
2. **demo-iframe.html** - Shows iframe integration with postMessage

To run the demos:

1. Build the frontend: `cd frontend && npm run build`
2. Start the backend: `cd backend/FormBuilderAPI && dotnet run`
3. Open the demo files in a browser

## Database

The application uses SQL Server with Entity Framework Core migrations. The database is automatically created and migrated on startup.

### Tables

- **FormSchemas** - Stores form schema definitions
  - Id (int, PK)
  - Name (string)
  - Description (string)
  - JsonSchema (string)
  - CreatedAt (datetime)
  - UpdatedAt (datetime)

- **FormFields** - Individual form fields (for future extensions)
  - Id (int, PK)
  - FormSchemaId (int, FK)
  - FieldName (string)
  - FieldLabel (string)
  - InputType (string)
  - IsRequired (bool)
  - Placeholder (string, nullable)
  - DefaultValue (string, nullable)
  - ValidationRules (string, nullable)
  - Order (int)

## Development

### Backend Development

```bash
cd backend/FormBuilderAPI
dotnet watch run
```

### Frontend Development

```bash
cd frontend
npm run dev
```

The frontend dev server includes hot module replacement (HMR) for instant updates.

## Production Build

### Backend

```bash
cd backend/FormBuilderAPI
dotnet publish -c Release -o ./publish
```

### Frontend

```bash
cd frontend
npm run build
```

The built files will be in `frontend/dist/`:
- `formbuilder.js` - UMD bundle that exposes `window.mountFormBuilder`
- `formbuilder.css` - Compiled CSS with Tailwind utilities

## Architecture

### Frontend Architecture

- **Vite** - Fast build tool with HMR
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS
- **i18next** - Internationalization
- **Axios** - HTTP client
- **UMD Bundle** - Universal module definition for standalone usage

### Backend Architecture

- **ASP.NET Core 9** - Web API framework
- **Entity Framework Core 9** - ORM
- **SQL Server** - Database
- **Swagger** - API documentation
- **CORS** - Cross-origin support

## License

This project is provided as-is for demonstration purposes.

## Notes

- No tests are included as per requirements
- No Docker configuration as per requirements
- RTL support is built-in with Tailwind RTL plugin
- Shadow DOM is not implemented; CSS variables with `fb-` prefix are used instead for style isolation

