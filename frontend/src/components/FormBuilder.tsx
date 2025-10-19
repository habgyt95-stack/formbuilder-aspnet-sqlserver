import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import type { FormSchema, FormField, CreateFormSchemaDto } from '../types';
import { formSchemaApi } from '../api/formSchemaApi';
import { FormBuilderGrid } from './FormBuilderGrid';
import { FormBuilderCanvas } from './FormBuilderCanvas';
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
  const [viewMode, setViewMode] = useState<'grid' | 'canvas'>('canvas');
  const [canvasWidth, setCanvasWidth] = useState(1200);
  const [canvasHeight, setCanvasHeight] = useState(800);

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
        if (parsedFields.canvasWidth) setCanvasWidth(parsedFields.canvasWidth);
        if (parsedFields.canvasHeight) setCanvasHeight(parsedFields.canvasHeight);
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
      const jsonSchema = JSON.stringify({ 
        fields, 
        canvasWidth, 
        canvasHeight 
      });
      
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4" dir={i18n.language === 'fa' ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-wrap justify-between items-center gap-4 bg-white/80 backdrop-blur-sm px-6 py-4 rounded-xl shadow-lg border border-white/50">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {t('formBuilder')}
          </h1>
          <div className="flex items-center gap-3">
            <Button 
              onClick={() => setViewMode(viewMode === 'grid' ? 'canvas' : 'grid')} 
              variant="secondary"
              className="shadow-md hover:shadow-lg transition-shadow"
            >
              {viewMode === 'grid' ? t('switchToCanvas') : t('switchToGrid')}
            </Button>
            <Button 
              onClick={toggleLanguage} 
              variant="ghost"
              className="shadow-md hover:shadow-lg transition-shadow"
            >
              {i18n.language === 'en' ? 'فارسی' : 'English'}
            </Button>
          </div>
        </div>

        {error && (
          <div className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-4 rounded-xl shadow-lg animate-shake">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white/90 backdrop-blur-sm border border-white/50 rounded-xl p-5 shadow-xl">
              <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Forms
              </h3>
              <div className="space-y-2 max-h-96 overflow-y-auto custom-scrollbar">
                {loading && <div className="text-center py-4 text-fb-secondary">{t('loading')}</div>}
                {schemas.map((schema) => (
                  <div
                    key={schema.id}
                    className={`p-3 rounded-lg cursor-pointer border-2 transition-all duration-200 ${
                      selectedSchema?.id === schema.id
                        ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-purple-50 shadow-md'
                        : 'border-transparent bg-white hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:shadow-md'
                    }`}
                    onClick={() => setSelectedSchema(schema)}
                  >
                    <div className="font-semibold text-sm text-fb-foreground">{schema.name}</div>
                    <div className="text-xs text-fb-secondary truncate">
                      {schema.description}
                    </div>
                  </div>
                ))}
              </div>
              <Button onClick={handleNew} className="w-full mt-4 shadow-md hover:shadow-lg transition-all">
                {t('createNewForm')}
              </Button>
            </div>
          </div>

          <div className="lg:col-span-3 space-y-4">
            <div className="bg-white/90 backdrop-blur-sm border border-white/50 rounded-xl p-6 shadow-xl">
              <div className="space-y-4 mb-6">
                <Input
                  label={t('formName')}
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder={t('formName')}
                  className="shadow-sm"
                />
                <Input
                  label={t('formDescription')}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder={t('formDescription')}
                  className="shadow-sm"
                />
              </div>

              {viewMode === 'grid' ? (
                <FormBuilderGrid fields={fields} onChange={handleFieldsChange} />
              ) : (
                <FormBuilderCanvas 
                  fields={fields} 
                  onChange={handleFieldsChange}
                  canvasWidth={canvasWidth}
                  canvasHeight={canvasHeight}
                  onCanvasSizeChange={(w, h) => {
                    setCanvasWidth(w);
                    setCanvasHeight(h);
                  }}
                />
              )}

              <div className="flex flex-wrap gap-3 mt-6">
                <Button onClick={handleSave} disabled={loading} className="shadow-md hover:shadow-lg transition-all">
                  {t('save')}
                </Button>
                {selectedSchema && (
                  <>
                    <Button onClick={handleExport} variant="secondary" className="shadow-md hover:shadow-lg transition-all">
                      {t('export')}
                    </Button>
                    <Button
                      onClick={() => handleDelete(selectedSchema.id)}
                      variant="danger"
                      className="shadow-md hover:shadow-lg transition-all"
                    >
                      {t('delete')}
                    </Button>
                  </>
                )}
                <label className="inline-flex cursor-pointer">
                  <Button variant="secondary" className="shadow-md hover:shadow-lg transition-all">
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
