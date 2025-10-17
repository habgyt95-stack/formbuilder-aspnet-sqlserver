import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { FormField, InputType } from '../types';
import { Button } from './Button';
import { Input } from './Input';
import { Select } from './Select';

interface FormBuilderCanvasProps {
  fields: FormField[];
  onChange: (fields: FormField[]) => void;
  canvasWidth: number;
  canvasHeight: number;
  onCanvasSizeChange: (width: number, height: number) => void;
}

export const FormBuilderCanvas: React.FC<FormBuilderCanvasProps> = ({
  fields,
  onChange,
  canvasWidth,
  canvasHeight,
  onCanvasSizeChange,
}) => {
  const { t } = useTranslation();
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isResizing, setIsResizing] = useState(false);

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
      fieldLabel: t('fieldLabel'),
      inputType: 'text',
      isRequired: false,
      order: fields.length,
      x: 50,
      y: 50 + fields.length * 20,
      width: 300,
      height: 80,
    };
    onChange([...fields, newField]);
    setSelectedFieldId(newField.id);
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
    if (selectedFieldId === id) {
      setSelectedFieldId(null);
    }
  };

  const handleMouseDown = (e: React.MouseEvent, fieldId: string) => {
    if ((e.target as HTMLElement).classList.contains('resize-handle')) {
      setIsResizing(true);
    } else {
      setIsDragging(true);
    }
    setSelectedFieldId(fieldId);
    const field = fields.find(f => f.id === fieldId);
    if (field) {
      setDragOffset({
        x: e.clientX - (field.x || 0),
        y: e.clientY - (field.y || 0),
      });
    }
    e.stopPropagation();
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && selectedFieldId) {
      const field = fields.find(f => f.id === selectedFieldId);
      if (field) {
        const newX = Math.max(0, Math.min(e.clientX - dragOffset.x, canvasWidth - (field.width || 300)));
        const newY = Math.max(0, Math.min(e.clientY - dragOffset.y, canvasHeight - (field.height || 80)));
        handleUpdateField(selectedFieldId, { x: newX, y: newY });
      }
    } else if (isResizing && selectedFieldId) {
      const field = fields.find(f => f.id === selectedFieldId);
      if (field) {
        const newWidth = Math.max(150, e.clientX - (field.x || 0));
        const newHeight = Math.max(60, e.clientY - (field.y || 0));
        handleUpdateField(selectedFieldId, { width: newWidth, height: newHeight });
      }
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
  };

  const selectedField = fields.find(f => f.id === selectedFieldId);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4 items-end">
        <div>
          <label className="block text-sm font-medium mb-1">{t('canvasWidth')}</label>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              value={canvasWidth}
              onChange={(e) => onCanvasSizeChange(parseInt(e.target.value) || 800, canvasHeight)}
              className="w-24"
            />
            <span className="text-sm text-fb-secondary">{t('pixels')}</span>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">{t('canvasHeight')}</label>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              value={canvasHeight}
              onChange={(e) => onCanvasSizeChange(canvasWidth, parseInt(e.target.value) || 600)}
              className="w-24"
            />
            <span className="text-sm text-fb-secondary">{t('pixels')}</span>
          </div>
        </div>
        <Button onClick={handleAddField}>{t('addField')}</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg border-2 border-fb-border shadow-sm overflow-auto">
            <div
              className="relative bg-gradient-to-br from-gray-50 to-gray-100"
              style={{ width: canvasWidth, height: canvasHeight, minWidth: canvasWidth, minHeight: canvasHeight }}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              {/* Grid pattern */}
              <div 
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: 'linear-gradient(#ccc 1px, transparent 1px), linear-gradient(90deg, #ccc 1px, transparent 1px)',
                  backgroundSize: '20px 20px',
                }}
              />

              {fields.map((field) => (
                <div
                  key={field.id}
                  className={`absolute cursor-move bg-white rounded-lg shadow-lg border-2 transition-all duration-200 hover:shadow-xl ${
                    selectedFieldId === field.id
                      ? 'border-fb-primary ring-4 ring-fb-primary ring-opacity-30'
                      : 'border-fb-border hover:border-fb-primary'
                  }`}
                  style={{
                    left: field.x || 0,
                    top: field.y || 0,
                    width: field.width || 300,
                    height: field.height || 80,
                  }}
                  onMouseDown={(e) => handleMouseDown(e, field.id)}
                >
                  <div className="p-3 h-full flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm text-fb-foreground truncate">
                          {field.fieldLabel || t('fieldLabel')}
                        </div>
                        <div className="text-xs text-fb-secondary truncate">
                          {field.fieldName || t('fieldName')}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        {field.isRequired && (
                          <span className="text-fb-error text-xs">*</span>
                        )}
                        <span className="text-xs bg-fb-muted px-2 py-1 rounded">
                          {t(field.inputType)}
                        </span>
                      </div>
                    </div>
                    <div className="flex-1 flex items-center">
                      {field.inputType === 'textarea' ? (
                        <div className="w-full h-12 bg-fb-muted rounded border border-fb-border" />
                      ) : field.inputType === 'checkbox' ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 bg-fb-muted rounded border border-fb-border" />
                          <div className="text-xs text-fb-secondary">{field.placeholder || ''}</div>
                        </div>
                      ) : (
                        <div className="w-full h-8 bg-fb-muted rounded border border-fb-border flex items-center px-2">
                          <div className="text-xs text-fb-secondary truncate">{field.placeholder || ''}</div>
                        </div>
                      )}
                    </div>
                  </div>
                  {/* Resize handle */}
                  {selectedFieldId === field.id && (
                    <div
                      className="resize-handle absolute bottom-0 right-0 w-4 h-4 bg-fb-primary cursor-se-resize rounded-tl"
                      style={{ borderBottomRightRadius: '0.5rem' }}
                    />
                  )}
                </div>
              ))}

              {fields.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-fb-secondary">
                    <div className="text-lg mb-2">{t('dragToPosition')}</div>
                    <Button onClick={handleAddField}>{t('addField')}</Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          {selectedField ? (
            <div className="bg-white rounded-lg border border-fb-border p-4 shadow-sm space-y-3 sticky top-4">
              <h3 className="font-semibold text-lg mb-4 text-fb-foreground">
                {t('edit')} {t('fieldLabel')}
              </h3>
              
              <div>
                <label className="block text-sm font-medium mb-1">{t('fieldName')}</label>
                <Input
                  value={selectedField.fieldName}
                  onChange={(e) =>
                    handleUpdateField(selectedField.id, {
                      fieldName: e.target.value,
                    })
                  }
                  placeholder={t('fieldName')}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">{t('fieldLabel')}</label>
                <Input
                  value={selectedField.fieldLabel}
                  onChange={(e) =>
                    handleUpdateField(selectedField.id, {
                      fieldLabel: e.target.value,
                    })
                  }
                  placeholder={t('fieldLabel')}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">{t('inputType')}</label>
                <Select
                  value={selectedField.inputType}
                  onChange={(e) =>
                    handleUpdateField(selectedField.id, {
                      inputType: e.target.value as InputType,
                    })
                  }
                  options={inputTypes}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">{t('placeholder')}</label>
                <Input
                  value={selectedField.placeholder || ''}
                  onChange={(e) =>
                    handleUpdateField(selectedField.id, {
                      placeholder: e.target.value,
                    })
                  }
                  placeholder={t('placeholder')}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">{t('defaultValue')}</label>
                <Input
                  value={selectedField.defaultValue || ''}
                  onChange={(e) =>
                    handleUpdateField(selectedField.id, {
                      defaultValue: e.target.value,
                    })
                  }
                  placeholder={t('defaultValue')}
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="required"
                  checked={selectedField.isRequired}
                  onChange={(e) =>
                    handleUpdateField(selectedField.id, {
                      isRequired: e.target.checked,
                    })
                  }
                  className="w-4 h-4 text-fb-primary rounded border-fb-border focus:ring-fb-primary"
                />
                <label htmlFor="required" className="text-sm font-medium">
                  {t('required')}
                </label>
              </div>

              <div className="pt-4 border-t border-fb-border">
                <h4 className="font-medium text-sm mb-2">Position & Size</h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="block text-fb-secondary mb-1">X: {selectedField.x || 0}px</label>
                  </div>
                  <div>
                    <label className="block text-fb-secondary mb-1">Y: {selectedField.y || 0}px</label>
                  </div>
                  <div>
                    <label className="block text-fb-secondary mb-1">{t('width')}: {selectedField.width || 300}px</label>
                  </div>
                  <div>
                    <label className="block text-fb-secondary mb-1">{t('height')}: {selectedField.height || 80}px</label>
                  </div>
                </div>
              </div>

              <Button
                onClick={() => handleDeleteField(selectedField.id)}
                variant="danger"
                className="w-full"
              >
                {t('delete')} {t('fieldLabel')}
              </Button>
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-fb-border p-6 text-center text-fb-secondary shadow-sm">
              <p>{t('noFormsFound')}</p>
              <p className="text-sm mt-2">Click on a field to edit its properties</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
