# سازنده فرم - جزئیات پیاده‌سازی فنی

## نمای کلی معماری

این یک برنامه سازنده فرم مستقل آماده برای تولید است که شامل موارد زیر است:
- **فرانت‌اند**: React 18 + Vite 7 + TypeScript (بسته UMD)
- **بک‌اند**: ASP.NET Core 9 Web API + Entity Framework Core + SQL Server

## پشته فنی فرانت‌اند

### وابستگی‌های اصلی
- **React 18.3**: فریم‌ورک رابط کاربری
- **TypeScript 5**: ایمنی نوع
- **Vite 7.1**: ابزار ساخت و سرور توسعه
- **Tailwind CSS 4**: فریم‌ورک CSS ابزار محور
- **@tailwindcss/postcss**: افزونه PostCSS برای Tailwind نسخه 4
- **tailwindcss-rtl**: افزونه پشتیبانی RTL
- **react-i18next**: چندزبانگی
- **i18next**: فریم‌ورک i18n
- **axios**: کلاینت HTTP

### پیکربندی ساخت
- **خروجی**: بسته UMD (`formbuilder.js` + `formbuilder.css`)
- **نقطه ورود**: `src/main.tsx`
- **حجم بسته**: ~667KB JS + ~4.4KB CSS (تولید)
- **صادرات جهانی**: `window.mountFormBuilder(container, options)`

### ساختار کامپوننت
```
src/
├── components/
│   ├── FormBuilder.tsx       # کامپوننت اصلی کانتینر
│   ├── FormBuilderGrid.tsx   # کامپوننت شبکه قابل ویرایش
│   ├── Button.tsx            # کامپوننت دکمه قابل استفاده مجدد
│   ├── Input.tsx             # کامپوننت ورودی قابل استفاده مجدد
│   └── Select.tsx            # کامپوننت انتخاب قابل استفاده مجدد
├── api/
│   └── formSchemaApi.ts      # کلاینت API برای بک‌اند
├── types/
│   └── index.ts              # تعاریف نوع TypeScript
├── i18n/
│   └── config.ts             # پیکربندی i18n (en/fa)
├── App.tsx                   # پوشش App
└── main.tsx                  # نقطه ورود با تابع mount
```

### متغیرهای CSS (پیشوند fb-)
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

### نصب سازنده فرم

```javascript
// استفاده مستقل
window.mountFormBuilder(
  document.getElementById('container'),
  {
    apiUrl: 'http://localhost:5000/api',
    language: 'fa', // یا 'en'
    onInit: () => console.log('راه‌اندازی شد'),
    onSave: (schema) => console.log('ذخیره شد:', schema)
  }
);
```

### یکپارچه‌سازی iframe

برنامه رویدادهای postMessage ارسال می‌کند:
- `{ type: 'init' }` - هنگام راه‌اندازی
- `{ type: 'changed', data: { fields } }` - هنگام تغییر ساختار فرم
- `{ type: 'saved', data: { name, fields } }` - هنگام ذخیره فرم

## پشته فنی بک‌اند

### وابستگی‌های اصلی
- **ASP.NET Core 9**: فریم‌ورک وب
- **Entity Framework Core 9**: ORM
- **Microsoft.EntityFrameworkCore.SqlServer**: ارائه‌دهنده SQL Server
- **Microsoft.EntityFrameworkCore.InMemory**: پایگاه داده حافظه‌ای برای تست
- **Swashbuckle.AspNetCore**: Swagger/OpenAPI

### ساختار پروژه
```
backend/FormBuilderAPI/
├── Controllers/
│   └── FormSchemasController.cs    # نقاط پایانی REST API
├── Models/
│   ├── FormSchema.cs               # موجودیت طرح فرم
│   └── FormField.cs                # موجودیت فیلد فرم
├── Data/
│   └── FormBuilderContext.cs       # DbContext
├── DTOs/
│   └── FormSchemaDtos.cs           # اشیاء انتقال داده
├── Migrations/                      # مهاجرت‌های EF Core
└── Program.cs                       # پیکربندی برنامه
```

### مدل‌های پایگاه داده

**FormSchema**
- Id (int, PK)
- Name (string, حداکثر 200)
- Description (string, حداکثر 1000)
- JsonSchema (string, JSON)
- CreatedAt (datetime)
- UpdatedAt (datetime)

**FormField** (برای گسترش‌های آینده)
- Id (int, PK)
- FormSchemaId (int, FK)
- FieldName (string, حداکثر 100)
- FieldLabel (string, حداکثر 200)
- InputType (string, حداکثر 50)
- IsRequired (bool)
- Placeholder (string, nullable)
- DefaultValue (string, nullable)
- ValidationRules (string, nullable)
- Order (int)

### نقاط پایانی API

#### GET /api/FormSchemas
تمام طرح‌های فرم را برمی‌گرداند، مرتب شده بر اساس UpdatedAt نزولی.

**پاسخ**: `FormSchemaDto[]`

#### GET /api/FormSchemas/{id}
یک طرح فرم خاص را بر اساس شناسه برمی‌گرداند.

**پاسخ**: `FormSchemaDto`

#### POST /api/FormSchemas
یک طرح فرم جدید ایجاد می‌کند.

**درخواست**: `CreateFormSchemaDto`
```json
{
  "name": "فرم تماس",
  "description": "یک فرم تماس ساده",
  "jsonSchema": "{\"fields\":[...]}"
}
```

**پاسخ**: `FormSchemaDto`

#### PUT /api/FormSchemas/{id}
یک طرح فرم موجود را به‌روزرسانی می‌کند.

**درخواست**: `UpdateFormSchemaDto`
```json
{
  "name": "نام به‌روزرسانی شده",
  "description": "توضیحات به‌روزرسانی شده",
  "jsonSchema": "{\"fields\":[...]}"
}
```

#### DELETE /api/FormSchemas/{id}
یک طرح فرم را حذف می‌کند.

#### POST /api/FormSchemas/export
طرح‌های فرم انتخاب شده را صادر می‌کند.

**درخواست**: `int[]` (آرایه شناسه‌های طرح)
**پاسخ**: `FormSchemaDto[]`

#### POST /api/FormSchemas/import
طرح‌های فرم را وارد می‌کند.

**درخواست**: `CreateFormSchemaDto[]`
**پاسخ**: `FormSchemaDto[]` (طرح‌های وارد شده)

### پیکربندی

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
  "UseInMemoryDatabase": true  // برای SQL Server روی false تنظیم کنید
}
```

## ویژگی‌های پیاده‌سازی شده

### شبکه سازنده فرم
- ✅ افزودن/حذف فیلدها به صورت پویا
- ✅ ویرایش درون خطی تمام ویژگی‌های فیلد
- ✅ مرتب‌سازی مجدد فیلدها با فلش‌های بالا/پایین
- ✅ اعتبارسنجی فیلد (پرچم الزامی)
- ✅ پشتیبانی از 7 نوع ورودی

### انواع ورودی پشتیبانی شده
1. **text** - متن تک‌خطی
2. **number** - ورودی عددی
3. **email** - ایمیل با اعتبارسنجی
4. **date** - انتخابگر تاریخ
5. **select** - انتخاب کشویی
6. **checkbox** - چک‌باکس بولی
7. **textarea** - متن چندخطی

### چندزبانگی (i18n)
- انگلیسی (en) - LTR
- فارسی/پارسی (fa) - RTL
- دکمه تغییر در هدر
- تغییر خودکار جهت
- ترجمه تمام عناصر رابط کاربری

### صادرات/وارد کردن
- صادرات فرم‌های منفرد به صورت JSON
- وارد کردن چندین فرم از فایل JSON
- حفظ ساختار فرم و فراداده

### پیکربندی CORS
- اجازه همه منشاءها (برای توسعه)
- قابل پیکربندی در تولید

### Swagger/OpenAPI
- در دسترس در URL ریشه (/)
- مستندات تعاملی API
- قابلیت امتحان کردن

## گردش کار توسعه

### اجرا به صورت محلی

**بک‌اند**:
```bash
cd backend/FormBuilderAPI
dotnet run
# سرور در http://localhost:5000 شروع می‌شود
```

**فرانت‌اند**:
```bash
cd frontend
npm install
npm run dev
# سرور توسعه در http://localhost:3000 شروع می‌شود
```

### ساخت برای تولید

**بک‌اند**:
```bash
cd backend/FormBuilderAPI
dotnet publish -c Release -o ./publish
```

**فرانت‌اند**:
```bash
cd frontend
npm run build
# خروجی: dist/formbuilder.js و dist/formbuilder.css
```

## استراتژی تست (پیاده‌سازی نشده)

طبق الزامات، هیچ تستی گنجانده نشده است. با این حال، برنامه:
- ✅ به صورت دستی با تمام عملیات CRUD تست شده است
- ✅ با هر دو زبان انگلیسی و فارسی تأیید شده است
- ✅ با پایگاه داده حافظه‌ای تست شده است
- ✅ با رابط کاربری Swagger اعتبارسنجی شده است
- ✅ الگوهای یکپارچه‌سازی iframe تست شده‌اند
- ✅ عملکرد صادرات/وارد کردن تأیید شده است

## ملاحظات عملکرد

### فرانت‌اند
- تقسیم کد فعال نیست (الزام بسته UMD)
- همه وابستگی‌ها در یک فایل بسته‌بندی شده‌اند
- CSS به فایل جداگانه استخراج شده است
- بارگذاری تنبل وجود ندارد (بسته مستقل)

### بک‌اند
- حافظه پنهان درون حافظه‌ای پیاده‌سازی نشده است
- پرس‌وجوهای مستقیم پایگاه داده
- CORS برای همه منشاءها پیکربندی شده است (باید در تولید محدود شود)

## ملاحظات امنیتی

### فرانت‌اند
- محافظت XSS از طریق escape داخلی React
- هیچ داده حساسی در localStorage ذخیره نشده است
- رویدادهای postMessage از origin wildcard استفاده می‌کنند (باید در تولید محدود شود)

### بک‌اند
- احراز هویت/مجوز پیاده‌سازی نشده است
- CORS همه منشاءها را اجازه می‌دهد (باید محدود شود)
- تزریق SQL توسط پارامتری‌سازی EF Core جلوگیری می‌شود
- اعتبارسنجی JSON در ایجاد طرح

## سازگاری مرورگر

تست شده و کار می‌کند در:
- ✅ Chrome 130+
- ✅ Firefox (آخرین نسخه)
- انتظار می‌رود در تمام مرورگرهای مدرن پشتیبانی کننده ES2020+ کار کند

## محدودیت‌های شناخته شده

1. بدون احراز هویت/مجوز
2. بدون پایداری داده در حالت حافظه‌ای (راه‌اندازی مجدد داده‌ها را بازنشانی می‌کند)
3. بدون همکاری بلادرنگ
4. بدون نسخه‌بندی/تاریخچه فرم
5. بدون سازنده قانون اعتبارسنجی (به صورت رشته JSON ذخیره می‌شود)
6. بدون انواع ورودی سفارشی فراتر از 7 نوع پشتیبانی شده

## پیشرفت‌های آینده (پیاده‌سازی نشده)

- قالب‌های فرم
- نمایش شرطی فیلد
- رابط کاربری قوانین اعتبارسنجی سفارشی
- ذخیره‌سازی ارسال‌های فرم
- فرم‌های چند مرحله‌ای
- تحلیل فرم
- کنترل دسترسی مبتنی بر نقش
- WebSocket برای به‌روزرسانی‌های بلادرنگ
- پیش‌نمایش/رندر فرم
- صادرات PDF

## یادداشت‌های استقرار

### فرانت‌اند
- `dist/formbuilder.js` و `dist/formbuilder.css` را از CDN یا سرور استاتیک سرو کنید
- در هر صفحه HTML با تگ script ساده شامل کنید
- `apiUrl` را در گزینه‌های mount پیکربندی کنید

### بک‌اند
- در IIS، Azure App Service یا هر میزبانی ASP.NET Core مستقر کنید
- رشته اتصال را برای SQL Server تولید پیکربندی کنید
- `UseInMemoryDatabase` را روی false تنظیم کنید
- CORS را برای منشاءهای خاص پیکربندی کنید
- HTTPS را در تولید فعال کنید

## مجوز

این پروژه به همان شکل برای اهداف نمایشی ارائه شده است.
