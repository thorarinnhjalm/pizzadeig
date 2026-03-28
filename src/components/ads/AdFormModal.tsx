'use client';

import { useState } from 'react';
import { Ad, AdFormat } from '@/types/ad';
import { Button } from '@/components/ui/button';
import { X, Upload, Save } from 'lucide-react';

interface Props {
  initialData?: Partial<Ad>;
  onClose: () => void;
  onSave: (adData: Partial<Ad>) => void;
}

const SUPPORTED_FORMATS: { id: Exclude<AdFormat, 'sponsored_card'>; label: string; dimensions: string }[] = [
  { id: '1018x360', label: 'Efsti borði', dimensions: '1018 × 360' },
  { id: '1080x240', label: 'Breiður borði', dimensions: '1080 × 240' },
  { id: '300x250', label: 'Medium rectangle', dimensions: '300 × 250' },
  { id: '310x400', label: 'Hliðarborði', dimensions: '310 × 400' },
  { id: '320x50', label: 'Mobile banner', dimensions: '320 × 50' },
  { id: '468x60', label: 'In-content', dimensions: '468 × 60' },
];

export function AdFormModal({ initialData, onClose, onSave }: Props) {
  const [formData, setFormData] = useState<Partial<Ad>>({
    name: initialData?.name || '',
    client: initialData?.client || '',
    status: initialData?.status || 'active',
    target_url: initialData?.target_url || '',
    creatives: initialData?.creatives || {},
    format: initialData?.format || '1018x360',
  });

  const handleCreativeChange = (format: Exclude<AdFormat, 'sponsored_card'>, url: string) => {
    setFormData(prev => ({
      ...prev,
      creatives: {
        ...(prev.creatives || {}),
        [format]: url
      }
    }));
  };

  const handleSave = () => {
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-(--color-bg-secondary) rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-(--color-bg-secondary)/95 backdrop-blur-sm z-10">
          <h2 className="text-xl font-bold">Ný Auglýsing / Herferð</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-red-500">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1">Nafn herferðar</label>
              <input type="text" className="w-full border rounded-lg p-2" value={formData.name || ''} onChange={e => setFormData({ ...formData, name: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Viðskiptavinur</label>
              <input type="text" className="w-full border rounded-lg p-2" value={formData.client || ''} onChange={e => setFormData({ ...formData, client: e.target.value })} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Target URL</label>
            <input type="url" className="w-full border rounded-lg p-2" value={formData.target_url || ''} onChange={e => setFormData({ ...formData, target_url: e.target.value })} />
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Upload className="w-5 h-5"/> Myndir & Stærðir (Creatives)</h3>
            <p className="text-sm text-gray-500 mb-4">Margar stærðir leyfðar fyrir sömu auglýsingu til að tryggja the best placement.</p>
            
            <div className="space-y-4">
              {SUPPORTED_FORMATS.map(fmt => (
                <div key={fmt.id} className="border rounded-xl p-4 bg-gray-50/50 flex flex-col md:flex-row gap-4 items-center justify-between">
                  <div className="w-full md:w-1/3">
                    <span className="font-bold text-sm block">{fmt.label}</span>
                    <span className="text-xs text-gray-500">{fmt.dimensions}</span>
                  </div>
                  <div className="w-full md:w-2/3 flex flex-col gap-2">
                    <input 
                      type="text" 
                      placeholder="Myndar URL..." 
                      className="text-sm border rounded p-1.5 w-full"
                      value={formData.creatives?.[fmt.id] || ''}
                      onChange={e => handleCreativeChange(fmt.id, e.target.value)}
                    />
                    {formData.creatives?.[fmt.id] && (
                      <div className="relative border rounded bg-gray-200 overflow-hidden flex items-center justify-center p-2" style={{ maxHeight: '100px' }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={formData.creatives[fmt.id]} alt="Preview" className="max-w-full max-h-full object-contain mix-blend-multiply" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-6 border-t flex justify-end gap-3 sticky bottom-0 bg-(--color-bg-secondary)">
          <Button variant="outline" onClick={onClose}>Hætta við</Button>
          <Button className="bg-(--color-brand) hover:bg-[#b02e0b] text-white" onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" /> Vista
          </Button>
        </div>
      </div>
    </div>
  );
}
