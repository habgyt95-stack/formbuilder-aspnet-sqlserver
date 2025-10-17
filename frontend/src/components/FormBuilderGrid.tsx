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
        <h2 className="text-xl font-semibold">{t('formBuilder')}</h2>
        <Button onClick={handleAddField}>{t('addField')}</Button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-fb-border rounded-lg">
          <thead className="bg-fb-muted">
            <tr>
              <th className="px-4 py-2 text-start text-sm font-medium">#</th>
              <th className="px-4 py-2 text-start text-sm font-medium">
                {t('fieldName')}
              </th>
              <th className="px-4 py-2 text-start text-sm font-medium">
                {t('fieldLabel')}
              </th>
              <th className="px-4 py-2 text-start text-sm font-medium">
                {t('inputType')}
              </th>
              <th className="px-4 py-2 text-start text-sm font-medium">
                {t('required')}
              </th>
              <th className="px-4 py-2 text-start text-sm font-medium">
                {t('placeholder')}
              </th>
              <th className="px-4 py-2 text-start text-sm font-medium">
                {t('actions')}
              </th>
            </tr>
          </thead>
          <tbody>
            {fields.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-8 text-center text-fb-secondary"
                >
                  {t('noFormsFound')}
                </td>
              </tr>
            ) : (
              fields.map((field, index) => (
                <tr
                  key={field.id}
                  className="border-t border-fb-border hover:bg-fb-muted/50"
                >
                  <td className="px-4 py-2">
                    <div className="flex flex-col gap-1">
                      <button
                        onClick={() => handleMoveField(index, 'up')}
                        disabled={index === 0}
                        className="text-xs disabled:opacity-30"
                      >
                        ▲
                      </button>
                      <span className="text-sm">{index + 1}</span>
                      <button
                        onClick={() => handleMoveField(index, 'down')}
                        disabled={index === fields.length - 1}
                        className="text-xs disabled:opacity-30"
                      >
                        ▼
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-2">
                    <Input
                      value={field.fieldName}
                      onChange={(e) =>
                        handleUpdateField(field.id, {
                          fieldName: e.target.value,
                        })
                      }
                      placeholder={t('fieldName')}
                      className="min-w-[120px]"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <Input
                      value={field.fieldLabel}
                      onChange={(e) =>
                        handleUpdateField(field.id, {
                          fieldLabel: e.target.value,
                        })
                      }
                      placeholder={t('fieldLabel')}
                      className="min-w-[120px]"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <Select
                      value={field.inputType}
                      onChange={(e) =>
                        handleUpdateField(field.id, {
                          inputType: e.target.value as InputType,
                        })
                      }
                      options={inputTypes}
                      className="min-w-[100px]"
                    />
                  </td>
                  <td className="px-4 py-2 text-center">
                    <input
                      type="checkbox"
                      checked={field.isRequired}
                      onChange={(e) =>
                        handleUpdateField(field.id, {
                          isRequired: e.target.checked,
                        })
                      }
                      className="w-4 h-4"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <Input
                      value={field.placeholder || ''}
                      onChange={(e) =>
                        handleUpdateField(field.id, {
                          placeholder: e.target.value,
                        })
                      }
                      placeholder={t('placeholder')}
                      className="min-w-[120px]"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDeleteField(field.id)}
                    >
                      {t('delete')}
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
