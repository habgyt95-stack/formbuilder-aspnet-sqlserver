import React from 'react';
import { useTranslation } from 'react-i18next';
import type { FormField, InputType } from '../types';
import { Button } from './Button';
import { Input } from './Input';
import { Select } from './Select';

interface FormBuilderGridProps {
  fields: FormField[];
  onChange: (fields: FormField[]) => void;
}

export const FormBuilderGrid: React.FC<FormBuilderGridProps> = ({
  fields,
  onChange,
}) => {
  const { t } = useTranslation();

  const inputTypes: { value: InputType; label: string }[] = [
    { value: 'text', label: t('text') },
    { value: 'number', label: t('number') },
    { value: 'email', label: t('email') },
    { value: 'date', label: t('date') },
    { value: 'select', label: t('select') },
    { value: 'checkbox', label: t('checkbox') },
    { value: 'textarea', label: t('textarea') },
  ];

  const handleAddField = () => {
    const newField: FormField = {
      id: `field-${Date.now()}`,
      fieldName: '',
      fieldLabel: '',
      inputType: 'text',
      isRequired: false,
      order: fields.length,
    };
    onChange([...fields, newField]);
  };

  const handleUpdateField = (id: string, updates: Partial<FormField>) => {
    onChange(
      fields.map((field) =>
        field.id === id ? { ...field, ...updates } : field
      )
    );
  };

  const handleDeleteField = (id: string) => {
    onChange(fields.filter((field) => field.id !== id));
  };

  const handleMoveField = (index: number, direction: 'up' | 'down') => {
    const newFields = [...fields];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (targetIndex >= 0 && targetIndex < fields.length) {
      [newFields[index], newFields[targetIndex]] = [newFields[targetIndex], newFields[index]];
      newFields.forEach((field, idx) => {
        field.order = idx;
      });
      onChange(newFields);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          {t('formBuilder')}
        </h2>
        <Button onClick={handleAddField} className="shadow-md hover:shadow-lg">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          {t('addField')}
        </Button>
      </div>

      {fields.length === 0 ? (
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-dashed border-blue-300 rounded-xl p-12 text-center">
          <div className="text-fb-secondary mb-4">
            <svg className="w-16 h-16 mx-auto mb-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-lg font-semibold">{t('noFormsFound')}</p>
            <p className="text-sm mt-2">Click "Add Field" to start building your form</p>
          </div>
          <Button onClick={handleAddField}>
            {t('addField')}
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="bg-white border-2 border-fb-border rounded-xl p-4 shadow-md hover:shadow-xl transition-all duration-200 hover:border-blue-300"
            >
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                {/* Order controls */}
                <div className="md:col-span-1 flex md:flex-col flex-row gap-1 items-center justify-center">
                  <button
                    onClick={() => handleMoveField(index, 'up')}
                    disabled={index === 0}
                    className="p-1.5 rounded-lg hover:bg-blue-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                    title="Move up"
                  >
                    <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <span className="text-sm font-bold text-blue-600 bg-blue-100 px-2.5 py-1 rounded-lg">
                    {index + 1}
                  </span>
                  <button
                    onClick={() => handleMoveField(index, 'down')}
                    disabled={index === fields.length - 1}
                    className="p-1.5 rounded-lg hover:bg-blue-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                    title="Move down"
                  >
                    <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>

                {/* Field inputs */}
                <div className="md:col-span-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <div>
                    <Input
                      value={field.fieldName}
                      onChange={(e) =>
                        handleUpdateField(field.id, {
                          fieldName: e.target.value,
                        })
                      }
                      placeholder={t('fieldName')}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <Input
                      value={field.fieldLabel}
                      onChange={(e) =>
                        handleUpdateField(field.id, {
                          fieldLabel: e.target.value,
                        })
                      }
                      placeholder={t('fieldLabel')}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <Select
                      value={field.inputType}
                      onChange={(e) =>
                        handleUpdateField(field.id, {
                          inputType: e.target.value as InputType,
                        })
                      }
                      options={inputTypes}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <Input
                      value={field.placeholder || ''}
                      onChange={(e) =>
                        handleUpdateField(field.id, {
                          placeholder: e.target.value,
                        })
                      }
                      placeholder={t('placeholder')}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <Input
                      value={field.defaultValue || ''}
                      onChange={(e) =>
                        handleUpdateField(field.id, {
                          defaultValue: e.target.value,
                        })
                      }
                      placeholder={t('defaultValue')}
                      className="w-full"
                    />
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id={`required-${field.id}`}
                        checked={field.isRequired}
                        onChange={(e) =>
                          handleUpdateField(field.id, {
                            isRequired: e.target.checked,
                          })
                        }
                        className="w-5 h-5 text-blue-600 rounded border-2 border-fb-border focus:ring-blue-500"
                      />
                      <label htmlFor={`required-${field.id}`} className="text-sm font-medium">
                        {t('required')}
                      </label>
                    </div>
                  </div>
                </div>

                {/* Delete button */}
                <div className="md:col-span-1 flex items-center justify-center">
                  <button
                    onClick={() => handleDeleteField(field.id)}
                    className="p-2 rounded-lg hover:bg-red-100 text-red-600 transition-colors"
                    title={t('delete')}
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
