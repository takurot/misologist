'use client';

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
        環境情報（任意）
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
          label="仕込み開始日"
          type="date"
          onChange={(v) => handleChange('startDate', v)}
        />
        <Field
          id="temperature"
          label="保存温度 (°C)"
          type="number"
          placeholder="例: 25"
          onChange={(v) => handleChange('temperature', v)}
        />
        <Field
          id="storageLocation"
          label="保存場所"
          type="text"
          placeholder="例: 冷暗所、床下"
          onChange={(v) => handleChange('storageLocation', v)}
        />
        <Field
          id="soybeanVariety"
          label="大豆品種"
          type="text"
          placeholder="例: 鶴の子大豆"
          onChange={(v) => handleChange('soybeanVariety', v)}
        />
        <Field
          id="kojRatio"
          label="麹歩合 (%)"
          type="number"
          placeholder="例: 10"
          onChange={(v) => handleChange('kojRatio', v)}
        />
        <Field
          id="saltRatio"
          label="塩分比 (%)"
          type="number"
          placeholder="例: 12"
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
