# سازنده فرم - ASP.NET Core + React

یک برنامه سازنده فرم مستقل و آماده برای تولید با رابط کاربری React+Vite+TypeScript و بک‌اند ASP.NET Core Web API با SQL Server و Entity Framework Core.

## ویژگی‌ها

### بخش فرانت‌اند (رابط کاربری)
- ✅ **React + Vite + TypeScript** - تجربه توسعه مدرن و سریع
- ✅ **بسته قابل نصب** - ارائه `window.mountFormBuilder(container, opts)` برای یکپارچه‌سازی آسان
- ✅ **پشتیبانی iframe** - رویدادهای postMessage برای `init`، `changed` و `saved`
- ✅ **شبکه قابل ویرایش** - سازنده فرم تعاملی با قابلیت کشیدن و رها کردن برای مرتب‌سازی فیلدها
- ✅ **انواع ورودی ستون** - پشتیبانی از متن، عدد، ایمیل، تاریخ، انتخاب، چک‌باکس، متن چندخطی
- ✅ **Tailwind CSS + متغیرهای CSS سفارشی** - با استفاده از پیشوند `fb-` برای استایل‌دهی محدود
- ✅ **پشتیبانی RTL** - پشتیبانی کامل RTL با افزونه RTL Tailwind
- ✅ **چندزبانگی** - پشتیبانی بین‌المللی‌سازی برای انگلیسی و فارسی
- ✅ **صادرات/وارد کردن** - قابلیت صادرات و وارد کردن JSON

### بخش بک‌اند (سرور)
- ✅ **ASP.NET Core Web API** - API RESTful با C#
- ✅ **SQL Server + Entity Framework Core** - پایگاه داده با مهاجرت‌ها
- ✅ **Swagger/OpenAPI** - مستندات تعاملی API
- ✅ **ذخیره‌سازی طرح JSON** - ذخیره تعاریف فرم به صورت JSON
- ✅ **عملیات CRUD** - پشتیبانی کامل از ایجاد، خواندن، به‌روزرسانی، حذف
- ✅ **API صادرات/وارد کردن** - نقاط پایانی برای عملیات دسته‌ای
- ✅ **CORS فعال** - اشتراک‌گذاری منابع بین منشاء برای یکپارچه‌سازی فرانت‌اند

## ساختار پروژه

```
formbuilder-aspnet-sqlserver/
├── backend/
│   └── FormBuilderAPI/
│       ├── Controllers/         # کنترلرهای API
│       ├── Data/               # DbContext و مهاجرت‌ها
│       ├── Models/             # مدل‌های موجودیت
│       ├── DTOs/               # اشیاء انتقال داده
│       └── Program.cs          # نقطه ورود برنامه
│
├── frontend/
│   ├── src/
│   │   ├── api/               # کلاینت API
│   │   ├── components/        # کامپوننت‌های React
│   │   ├── i18n/              # چندزبانگی
│   │   ├── types/             # انواع TypeScript
│   │   ├── App.tsx            # کامپوننت اصلی App
│   │   └── main.tsx           # نقطه ورود با mountFormBuilder
│   ├── demo-standalone.html   # نمایش مستقل
│   ├── demo-iframe.html       # نمایش iframe
│   └── vite.config.ts         # پیکربندی Vite
│
└── README.md
```

## پیش‌نیازها

- [.NET SDK 9.0+](https://dotnet.microsoft.com/download)
- [Node.js 20+](https://nodejs.org/)
- [SQL Server](https://www.microsoft.com/en-us/sql-server/sql-server-downloads) یا LocalDB (اختیاری - می‌توان از پایگاه داده حافظه‌ای برای تست استفاده کرد)

## شروع کار

### راه‌اندازی بک‌اند

1. به دایرکتوری بک‌اند بروید:
   ```bash
   cd backend/FormBuilderAPI
   ```

2. **گزینه 1: استفاده از SQL Server**
   
   رشته اتصال را در `appsettings.json` به‌روزرسانی کنید:
   ```json
   "ConnectionStrings": {
     "DefaultConnection": "Server=YOUR_SERVER;Database=FormBuilderDB;..."
   }
   ```
   
   `UseInMemoryDatabase` را در `appsettings.Development.json` روی `false` تنظیم کنید:
   ```json
   "UseInMemoryDatabase": false
   ```

3. **گزینه 2: استفاده از پایگاه داده حافظه‌ای (برای تست/نمایش)**
   
   `UseInMemoryDatabase` را در `appsettings.Development.json` روی `true` تنظیم کنید (پیش‌فرض):
   ```json
   "UseInMemoryDatabase": true
   ```
   
   این برای تست بدون نصب SQL Server مفید است.

4. برنامه را اجرا کنید:
   ```bash
   dotnet run
   ```

   API در `http://localhost:5000` شروع می‌شود
   رابط کاربری Swagger در `http://localhost:5000` (ریشه) در دسترس خواهد بود

### راه‌اندازی فرانت‌اند

1. به دایرکتوری فرانت‌اند بروید:
   ```bash
   cd frontend
   ```

2. وابستگی‌ها را نصب کنید:
   ```bash
   npm install
   ```

3. برای توسعه:
   ```bash
   npm run dev
   ```
   برنامه در `http://localhost:3000` شروع می‌شود

4. برای ساخت بسته تولید:
   ```bash
   npm run build
   ```
   بسته در پوشه `dist/` به صورت زیر تولید می‌شود:
   - `formbuilder.js` - بسته JavaScript
   - `formbuilder.css` - بسته CSS

## استفاده

### حالت مستقل

فایل‌های ساخته شده را شامل شوید و سازنده فرم را نصب کنید:

```html
<!DOCTYPE html>
<html lang="fa" dir="rtl">
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
        language: 'fa', // یا 'en' برای انگلیسی
        onInit: () => {
          console.log('سازنده فرم راه‌اندازی شد');
        },
        onSave: (schema) => {
          console.log('فرم ذخیره شد:', schema);
        }
      }
    );
  </script>
</body>
</html>
```

### حالت iframe

سازنده فرم را در یک iframe جاسازی کنید و به رویدادهای postMessage گوش دهید:

```html
<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
  <title>سازنده فرم - حالت iframe</title>
</head>
<body>
  <iframe src="http://localhost:3000" id="formbuilder-iframe"></iframe>

  <script>
    window.addEventListener('message', (event) => {
      switch(event.data.type) {
        case 'init':
          console.log('سازنده فرم راه‌اندازی شد');
          break;
        case 'changed':
          console.log('فرم تغییر کرد:', event.data.data);
          break;
        case 'saved':
          console.log('فرم ذخیره شد:', event.data.data);
          break;
      }
    });
  </script>
</body>
</html>
```

## نقاط پایانی API

بک‌اند نقاط پایانی REST API زیر را ارائه می‌دهد:

### طرح‌های فرم

- `GET /api/FormSchemas` - دریافت تمام طرح‌های فرم
- `GET /api/FormSchemas/{id}` - دریافت یک طرح فرم خاص
- `POST /api/FormSchemas` - ایجاد یک طرح فرم جدید
- `PUT /api/FormSchemas/{id}` - به‌روزرسانی یک طرح فرم
- `DELETE /api/FormSchemas/{id}` - حذف یک طرح فرم
- `POST /api/FormSchemas/export` - صادرات طرح‌های انتخاب شده (JSON)
- `POST /api/FormSchemas/import` - وارد کردن طرح‌ها از JSON

### مثال درخواست

```bash
curl -X POST http://localhost:5000/api/FormSchemas \
  -H "Content-Type: application/json" \
  -d '{
    "name": "فرم تماس",
    "description": "یک فرم تماس ساده",
    "jsonSchema": "{\"fields\":[{\"id\":\"field-1\",\"fieldName\":\"name\",\"fieldLabel\":\"نام\",\"inputType\":\"text\",\"isRequired\":true,\"order\":0}]}"
  }'
```

## ویژگی‌ها به تفصیل

### شبکه قابل ویرایش

سازنده فرم یک شبکه تعاملی ارائه می‌دهد که می‌توانید:
- ✅ فیلدهای جدید با دکمه "افزودن فیلد" اضافه کنید
- ✅ ویژگی‌های فیلد را به صورت درون خطی ویرایش کنید (نام، برچسب، نوع و غیره)
- ✅ فیلدها را با استفاده از فلش‌های بالا/پایین مرتب کنید
- ✅ فیلدها را با چک‌باکس‌ها به عنوان الزامی علامت‌گذاری کنید
- ✅ فیلدها را با دکمه حذف پاک کنید
- ✅ متن راهنما و مقادیر پیش‌فرض تنظیم کنید

### انواع ورودی پشتیبانی شده

- **متن** - ورودی متن تک‌خطی
- **عدد** - ورودی عددی
- **ایمیل** - اعتبارسنجی ایمیل
- **تاریخ** - انتخابگر تاریخ
- **انتخاب** - انتخاب کشویی
- **چک‌باکس** - چک‌باکس بولی
- **متن چندخطی** - ورودی متن چند خطی

### چندزبانگی

برنامه از زبان‌های انگلیسی و فارسی پشتیبانی می‌کند. با استفاده از دکمه تغییر زبان در گوشه بالا سمت راست، زبان را تغییر دهید.

### متغیرهای CSS

برنامه از متغیرهای CSS سفارشی با پیشوند `fb-` برای تم‌بندی استفاده می‌کند:

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

## نمایش

دو فایل HTML نمایشی گنجانده شده است:

1. **demo-standalone.html** - نمایش یکپارچه‌سازی مستقل
2. **demo-iframe.html** - نمایش یکپارچه‌سازی iframe با postMessage

برای اجرای نمایش‌ها:

1. فرانت‌اند را بسازید: `cd frontend && npm run build`
2. بک‌اند را شروع کنید: `cd backend/FormBuilderAPI && dotnet run`
3. فایل‌های نمایشی را در مرورگر باز کنید

## پایگاه داده

برنامه از SQL Server با مهاجرت‌های Entity Framework Core استفاده می‌کند. پایگاه داده به طور خودکار در هنگام راه‌اندازی ایجاد و مهاجرت می‌شود.

### جداول

- **FormSchemas** - ذخیره تعاریف طرح فرم
  - Id (int, PK)
  - Name (string)
  - Description (string)
  - JsonSchema (string)
  - CreatedAt (datetime)
  - UpdatedAt (datetime)

- **FormFields** - فیلدهای فرم منفرد (برای گسترش‌های آینده)
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

## توسعه

### توسعه بک‌اند

```bash
cd backend/FormBuilderAPI
dotnet watch run
```

### توسعه فرانت‌اند

```bash
cd frontend
npm run dev
```

سرور توسعه فرانت‌اند شامل جایگزینی ماژول داغ (HMR) برای به‌روزرسانی‌های فوری است.

## ساخت برای تولید

### بک‌اند

```bash
cd backend/FormBuilderAPI
dotnet publish -c Release -o ./publish
```

### فرانت‌اند

```bash
cd frontend
npm run build
```

فایل‌های ساخته شده در `frontend/dist/` خواهند بود:
- `formbuilder.js` - بسته UMD که `window.mountFormBuilder` را ارائه می‌دهد
- `formbuilder.css` - CSS کامپایل شده با ابزارهای Tailwind

## معماری

### معماری فرانت‌اند

- **Vite** - ابزار ساخت سریع با HMR
- **React 18** - فریم‌ورک رابط کاربری
- **TypeScript** - ایمنی نوع
- **Tailwind CSS** - CSS ابزار محور
- **i18next** - چندزبانگی
- **Axios** - کلاینت HTTP
- **بسته UMD** - تعریف ماژول جهانی برای استفاده مستقل

### معماری بک‌اند

- **ASP.NET Core 9** - فریم‌ورک Web API
- **Entity Framework Core 9** - ORM
- **SQL Server** - پایگاه داده
- **Swagger** - مستندات API
- **CORS** - پشتیبانی بین منشاء

## مجوز

این پروژه به همان شکل برای اهداف نمایشی ارائه شده است.

## تصاویر

### سازنده فرم - رابط انگلیسی
![سازنده فرم انگلیسی](https://github.com/user-attachments/assets/0a8054b3-5f3a-48a4-b714-b8e30961d6da)

### سازنده فرم - با شبکه قابل ویرایش
![سازنده فرم با فیلد](https://github.com/user-attachments/assets/7b09ca79-4605-459a-9360-70e0ebf8c0da)

### سازنده فرم - فارسی/پارسی (پشتیبانی RTL)
![سازنده فرم فارسی](https://github.com/user-attachments/assets/6280eb77-193b-42af-9b61-8a0eaf09d5b4)

## یادداشت‌ها

- هیچ تستی طبق الزامات گنجانده نشده است
- هیچ پیکربندی Docker طبق الزامات وجود ندارد
- پشتیبانی RTL با افزونه RTL Tailwind ساخته شده است
- Shadow DOM پیاده‌سازی نشده است؛ به جای آن از متغیرهای CSS با پیشوند `fb-` برای جداسازی استایل استفاده می‌شود
