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

export function MetadataForm({ onChange }: MetadataFormProps) {
  const handleChange = (field: string, value: string) => {
    const numFields = ['temperature', 'kojRatio', 'saltRatio'];
    onChange({
      [field]: numFields.includes(field) && value ? Number(value) : value || undefined,
    });
  };

  return (
    <div className="space-y-4">
      <h3 className="font-medium text-sm text-muted-foreground">環境情報（任意）</h3>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium mb-1">仕込み開始日</label>
          <input
            type="date"
            className="w-full border rounded px-3 py-2 text-sm bg-background"
            onChange={(e) => handleChange('startDate', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1">保存温度 (°C)</label>
          <input
            type="number"
            placeholder="例: 25"
            className="w-full border rounded px-3 py-2 text-sm bg-background"
            onChange={(e) => handleChange('temperature', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1">保存場所</label>
          <input
            type="text"
            placeholder="例: 冷暗所、床下"
            className="w-full border rounded px-3 py-2 text-sm bg-background"
            onChange={(e) => handleChange('storageLocation', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1">大豆品種</label>
          <input
            type="text"
            placeholder="例: 鶴の子大豆"
            className="w-full border rounded px-3 py-2 text-sm bg-background"
            onChange={(e) => handleChange('soybeanVariety', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1">麹歩合 (%)</label>
          <input
            type="number"
            placeholder="例: 10"
            className="w-full border rounded px-3 py-2 text-sm bg-background"
            onChange={(e) => handleChange('kojRatio', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1">塩分比 (%)</label>
          <input
            type="number"
            placeholder="例: 12"
            className="w-full border rounded px-3 py-2 text-sm bg-background"
            onChange={(e) => handleChange('saltRatio', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
