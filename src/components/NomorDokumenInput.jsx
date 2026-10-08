import { formatUrutan } from '../utils/nomorDokumen';

// Input "Pesanan ke-" + preview nomor dokumen hasil otomatis
export default function NomorDokumenInput({ urutan, onChange, previews = [], tanggalLabel = 'Tanggal' }) {
  return (
    <div>
      <div className="form-group">
        <label className="form-label">Pesanan ke-</label>
        <input
          type="number"
          min="1"
          className="form-input"
          value={urutan}
          onChange={(e) => onChange(e.target.value)}
          placeholder="01"
        />
        <small style={{ display: 'block', marginTop: '4px', fontSize: '12px', opacity: 0.7 }}>
          Tanggal, bulan (romawi) &amp; tahun pada nomor mengikuti kolom <b>{tanggalLabel}</b>. Urutan: <b>{formatUrutan(urutan)}</b>
        </small>
      </div>

      {previews.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: previews.length > 1 ? '1fr 1fr' : '1fr', gap: '8px', marginBottom: '16px' }}>
          {previews.map(({ label, value }) => (
            <div
              key={label}
              style={{ padding: '10px 12px', borderRadius: '8px', border: '1px dashed var(--border)', backgroundColor: 'rgba(79,70,229,0.04)' }}
            >
              <div style={{ fontSize: '11px', opacity: 0.65, marginBottom: '2px' }}>{label}</div>
              <div style={{ fontFamily: 'monospace', fontWeight: 600, fontSize: '14px' }}>{value}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
