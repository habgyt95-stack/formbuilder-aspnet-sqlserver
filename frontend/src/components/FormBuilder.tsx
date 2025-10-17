import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import type { FormSchema, FormField, CreateFormSchemaDto } from '../types';
import { formSchemaApi } from '../api/formSchemaApi';
import { FormBuilderGrid } from './FormBuilderGrid';
import { Button } from './Button';
import { Input } from './Input';

interface FormBuilderProps {
  onSave?: (schema: FormSchema) => void;
  onInit?: () => void;
}

export const FormBuilder: React.FC<FormBuilderProps> = ({
  onSave,
  onInit,
}) => {
  const { t, i18n } = useTranslation();
  const [schemas, setSchemas] = useState<FormSchema[]>([]);
  const [selectedSchema, setSelectedSchema] = useState<FormSchema | null>(null);
  const [fields, setFields] = useState<FormField[]>([]);
  const [formName, setFormName] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadSchemas();
    onInit?.();
  }, []);

  useEffect(() => {
    if (selectedSchema) {
      try {
        const parsedFields = JSON.parse(selectedSchema.jsonSchema);
        setFields(parsedFields.fields || []);
        setFormName(selectedSchema.name);
        setFormDescription(selectedSchema.description);
      } catch (err) {
        setError(t('invalidJson'));
      }
    }
  }, [selectedSchema]);

  const loadSchemas = async () => {
    setLoading(true);
    try {
      const data = await formSchemaApi.getAll();
      setSchemas(data);
    } catch (err) {
      setError(t('error'));
    } finally {
      setLoading(false);
    }
  };

  const handleFieldsChange = (newFields: FormField[]) => {
    setFields(newFields);
    
    // Send postMessage for iframe
    if (window.parent !== window) {
      window.parent.postMessage(
        { type: 'changed', data: { fields: newFields } },
        '*'
      );
    }
  };

  const handleSave = async () => {
    if (!formName.trim()) {
      setError('Form name is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const jsonSchema = JSON.stringify({ fields });
      
      if (selectedSchema) {
        await formSchemaApi.update(selectedSchema.id, {
          name: formName,
          description: formDescription,
          jsonSchema,
        });
        const updated = await formSchemaApi.getById(selectedSchema.id);
        setSelectedSchema(updated);
        onSave?.(updated);
      } else {
        const newSchema = await formSchemaApi.create({
          name: formName,
          description: formDescription,
          jsonSchema,
        });
        setSelectedSchema(newSchema);
        onSave?.(newSchema);
      }

      await loadSchemas();
      
      // Send postMessage for iframe
      if (window.parent !== window) {
        window.parent.postMessage(
          { type: 'saved', data: { name: formName, fields } },
          '*'
        );
      }
    } catch (err) {
      setError(t('error'));
    } finally {
      setLoading(false);
    }
  };

  const handleNew = () => {
    setSelectedSchema(null);
    setFields([]);
    setFormName('');
    setFormDescription('');
    setError('');
  };

  const handleDelete = async (id: number) => {
    if (!confirm(t('confirmDelete'))) return;

    try {
      await formSchemaApi.delete(id);
      if (selectedSchema?.id === id) {
        handleNew();
      }
      await loadSchemas();
    } catch (err) {
      setError(t('error'));
    }
  };

  const handleExport = async () => {
    if (!selectedSchema) return;

    try {
      const data = await formSchemaApi.exportSchemas([selectedSchema.id]);
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `form-schema-${selectedSchema.id}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(t('error'));
    }
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const data = JSON.parse(text) as FormSchema[];
      const schemas: CreateFormSchemaDto[] = data.map((s) => ({
        name: s.name,
        description: s.description,
        jsonSchema: s.jsonSchema,
      }));
      await formSchemaApi.importSchemas(schemas);
      await loadSchemas();
    } catch (err) {
      setError(t('invalidJson'));
    }
  };

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'fa' : 'en';
    i18n.changeLanguage(newLang);
    document.documentElement.dir = newLang === 'fa' ? 'rtl' : 'ltr';
  };

  return (
    <div className="min-h-screen bg-fb-background p-4" dir={i18n.language === 'fa' ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">{t('formBuilder')}</h1>
          <Button onClick={toggleLanguage} variant="ghost">
            {i18n.language === 'en' ? 'فارسی' : 'English'}
          </Button>
        </div>

        {error && (
          <div className="bg-fb-error text-white px-4 py-2 rounded-md">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white border border-fb-border rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-4">Forms</h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {loading && <div>{t('loading')}</div>}
                {schemas.map((schema) => (
                  <div
                    key={schema.id}
                    className={`p-2 rounded cursor-pointer border ${
                      selectedSchema?.id === schema.id
                        ? 'border-fb-primary bg-blue-50'
                        : 'border-fb-border hover:bg-fb-muted'
                    }`}
                    onClick={() => setSelectedSchema(schema)}
                  >
                    <div className="font-medium text-sm">{schema.name}</div>
                    <div className="text-xs text-fb-secondary truncate">
                      {schema.description}
                    </div>
                  </div>
                ))}
              </div>
              <Button onClick={handleNew} className="w-full mt-4">
                {t('createNewForm')}
              </Button>
            </div>
          </div>

          <div className="lg:col-span-3 space-y-4">
            <div className="bg-white border border-fb-border rounded-lg p-6">
              <div className="space-y-4 mb-6">
                <Input
                  label={t('formName')}
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder={t('formName')}
                />
                <Input
                  label={t('formDescription')}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder={t('formDescription')}
                />
              </div>

              <FormBuilderGrid fields={fields} onChange={handleFieldsChange} />

              <div className="flex gap-2 mt-6">
                <Button onClick={handleSave} disabled={loading}>
                  {t('save')}
                </Button>
                {selectedSchema && (
                  <>
                    <Button onClick={handleExport} variant="secondary">
                      {t('export')}
                    </Button>
                    <Button
                      onClick={() => handleDelete(selectedSchema.id)}
                      variant="danger"
                    >
                      {t('delete')}
                    </Button>
                  </>
                )}
                <label className="inline-flex cursor-pointer">
                  <Button variant="secondary">
                    {t('import')}
                  </Button>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImport}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
