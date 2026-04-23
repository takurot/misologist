'use client';

import { useLocale } from '@/components/LocaleProvider';

interface MetadataFormProps {
  onChange: (data: {
    startDate?: string;
    temperature?: number;
    storageLocation?: string;
    soybeanVariety?: string;
    kojRatio?: number;
    saltRatio?: number;
  }) => void;
}

const numericFields = new Set(['temperature', 'kojRatio', 'saltRatio']);

export function MetadataForm({ onChange }: MetadataFormProps) {
  const { dict } = useLocale();

  const handleChange = (field: string, value: string) => {
    onChange({
      [field]: numericFields.has(field) && value ? Number(value) : value || undefined,
    });
  };

  return (
    <div
      style={{
        padding: '1.5rem',
        background: 'hsl(25, 30%, 7%)',
        border: '1px solid hsl(25, 18%, 14%)',
      }}
    >
      <div
        style={{
          fontFamily: 'var(--font-lora), serif',
          fontSize: '0.6rem',
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          color: 'hsl(30, 68%, 45%)',
          marginBottom: '1.25rem',
        }}
      >
        {dict.metadataForm.sectionTitle}
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '1.25rem 2rem',
        }}
      >
        <Field
          id="startDate"
          label={dict.metadataForm.startDate}
          type="date"
          onChange={(v) => handleChange('startDate', v)}
        />
        <Field
          id="temperature"
          label={dict.metadataForm.temperature}
          type="number"
          placeholder={dict.metadataForm.temperaturePlaceholder}
          onChange={(v) => handleChange('temperature', v)}
        />
        <Field
          id="storageLocation"
          label={dict.metadataForm.storageLocation}
          type="text"
          placeholder={dict.metadataForm.storageLocationPlaceholder}
          onChange={(v) => handleChange('storageLocation', v)}
        />
        <Field
          id="soybeanVariety"
          label={dict.metadataForm.soybeanVariety}
          type="text"
          placeholder={dict.metadataForm.soybeanVarietyPlaceholder}
          onChange={(v) => handleChange('soybeanVariety', v)}
        />
        <Field
          id="kojRatio"
          label={dict.metadataForm.kojiRatio}
          type="number"
          placeholder={dict.metadataForm.kojiRatioPlaceholder}
          onChange={(v) => handleChange('kojRatio', v)}
        />
        <Field
          id="saltRatio"
          label={dict.metadataForm.saltRatio}
          type="number"
          placeholder={dict.metadataForm.saltRatioPlaceholder}
          onChange={(v) => handleChange('saltRatio', v)}
        />
      </div>
    </div>
  );
}

interface FieldProps {
  id: string;
  label: string;
  type: string;
  placeholder?: string;
  onChange: (value: string) => void;
}

function Field({ id, label, type, placeholder, onChange }: FieldProps) {
  return (
    <div>
      <label htmlFor={id} className="field-label">
        {label}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        className="field-input"
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
