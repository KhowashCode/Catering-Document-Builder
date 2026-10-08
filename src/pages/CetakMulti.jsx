import { useState } from 'react';
import { PDFViewer, PDFDownloadLink, pdf } from '@react-pdf/renderer';
import JSZip from 'jszip';
import { Plus, Copy, Trash2, FileArchive, Files } from 'lucide-react';
import BerkasForm, { createDefaultBerkas, buildBerkasDocument, getBerkasFileName } from '../components/BerkasForm';
import { incrementUrutan } from '../utils/nomorDokumen';

const makeNextBerkas = (source) => ({
  ...source,
  urutan: incrementUrutan(source.urutan),
  items: source.items.map((item) => ({ ...item }))
});

// Pastikan nama file unik (misal instansi sama)
const uniqueFileNames = (list) => {
  const used = {};
  return list.map((data) => {
    const base = getBerkasFileName(data).replace(/\.pdf$/i, '').replace(/[\\/:*?"<>|]/g, '-');
    used[base] = (used[base] || 0) + 1;
    return used[base] > 1 ? `${base} (${used[base]}).pdf` : `${base}.pdf`;
  });
};

const triggerDownload = (blob, fileName) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};

export default function CetakMulti() {
  const [berkasList, setBerkasList] = useState(() => [createDefaultBerkas()]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(null); // { done, total, mode }

  const active = berkasList[activeIndex];
  const fileNames = uniqueFileNames(berkasList);
  const activeDocument = buildBerkasDocument(active);

  const updateActive = (newData) => {
    setBerkasList((list) => list.map((b, i) => (i === activeIndex ? newData : b)));
  };

  const addBerkas = () => {
    setBerkasList((list) => [...list, makeNextBerkas(list[list.length - 1])]);
    setActiveIndex(berkasList.length);
  };

  const duplicateBerkas = () => {
    setBerkasList((list) => {
      const copy = makeNextBerkas(list[activeIndex]);
      return [...list.slice(0, activeIndex + 1), copy, ...list.slice(activeIndex + 1)];
    });
    setActiveIndex(activeIndex + 1);
  };

  const removeBerkas = (index) => {
    if (berkasList.length <= 1) return;
    const label = berkasList[index].instansiPelanggan || `Berkas ${index + 1}`;
    if (!window.confirm(`Hapus berkas "${label}"?`)) return;
    setBerkasList((list) => list.filter((_, i) => i !== index));
    setActiveIndex((cur) => (cur > index ? cur - 1 : Math.min(cur, berkasList.length - 2)));
  };

  const generateBlobs = async (mode, onEach) => {
    setProgress({ done: 0, total: berkasList.length, mode });
    try {
      for (let i = 0; i < berkasList.length; i++) {
        const blob = await pdf(buildBerkasDocument(berkasList[i])).toBlob();
        await onEach(blob, fileNames[i], i);
        setProgress({ done: i + 1, total: berkasList.length, mode });
      }
    } catch (err) {
      console.error(err);
      alert('Gagal membuat PDF: ' + err.message);
      throw err;
    }
  };

  const downloadZip = async () => {
    const zip = new JSZip();
    try {
      await generateBlobs('zip', (blob, name) => zip.file(name, blob));
      const content = await zip.generateAsync({ type: 'blob' });
      triggerDownload(content, `Berkas Katering (${berkasList.length} file).zip`);
    } finally {
      setProgress(null);
    }
  };

  const downloadSeparate = async () => {
    try {
      await generateBlobs('separate', async (blob, name) => {
        triggerDownload(blob, name);
        // jeda kecil agar browser tidak memblokir unduhan beruntun
        await new Promise((r) => setTimeout(r, 400));
      });
    } finally {
      setProgress(null);
    }
  };

  const busy = progress !== null;

  return (
    <div className="builder-layout">
      {/* Form Section */}
      <div style={{ paddingBottom: '60px' }}>
        <div className="page-header">
          <h2 className="page-title">Cetak Multi-File</h2>
          <p className="page-subtitle">
            Buat beberapa berkas sekaligus. Setiap berkas = 1 file PDF berisi Pesanan, BAST, Invoice &amp; Kwitansi dengan data berbeda.
          </p>
        </div>

        {/* Tab berkas */}
        <div className="glass-card" style={{ marginBottom: '16px', padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', gap: '8px', flexWrap: 'wrap' }}>
            <h3 style={{ color: 'var(--primary)', margin: 0 }}>Daftar Berkas ({berkasList.length})</h3>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button className="btn btn-secondary" onClick={duplicateBerkas} title="Duplikat berkas aktif" style={{ padding: '8px 12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Copy size={16} /> Duplikat
              </button>
              <button className="btn btn-primary" onClick={addBerkas} title="Tambah berkas baru" style={{ padding: '8px 12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Plus size={16} /> Tambah Berkas
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {berkasList.map((b, i) => {
              const isActive = i === activeIndex;
              return (
                <div
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px',
                    borderRadius: '10px', cursor: 'pointer', transition: 'all 0.2s ease',
                    border: `1px solid ${isActive ? 'var(--primary)' : 'var(--border)'}`,
                    backgroundColor: isActive ? 'rgba(79,70,229,0.08)' : 'var(--surface)'
                  }}
                >
                  <span style={{
                    width: '26px', height: '26px', borderRadius: '50%', flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700,
                    backgroundColor: isActive ? 'var(--primary)' : 'var(--border)', color: isActive ? '#fff' : 'inherit'
                  }}>
                    {i + 1}
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: '14px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {b.instansiPelanggan || `Berkas ${i + 1}`}
                    </div>
                    <div style={{ fontSize: '12px', opacity: 0.65, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {fileNames[i]}
                    </div>
                  </div>
                  <button
                    className="btn btn-secondary"
                    onClick={(e) => { e.stopPropagation(); removeBerkas(i); }}
                    disabled={berkasList.length <= 1}
                    title="Hapus berkas"
                    style={{ padding: '6px 8px', color: '#DC2626', borderColor: '#FECACA', backgroundColor: '#FEF2F2', opacity: berkasList.length <= 1 ? 0.4 : 1 }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        <h3 style={{ margin: '8px 0 12px', fontSize: '15px' }}>
          ✏️ Mengedit Berkas {activeIndex + 1}
        </h3>
        <BerkasForm key={activeIndex} formData={active} onChange={updateActive} />
      </div>

      {/* PDF Preview Section */}
      <div style={{ position: 'sticky', top: '40px' }}>
        <div style={{ marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '8px', backgroundColor: 'var(--surface)', padding: '12px', borderRadius: '12px', boxShadow: 'var(--shadow-md)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <button className="btn btn-primary" onClick={downloadZip} disabled={busy} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
              <FileArchive size={16} />
              {progress?.mode === 'zip' ? `Membuat ${progress.done}/${progress.total}...` : `Unduh Semua (ZIP)`}
            </button>
            <button className="btn btn-secondary" onClick={downloadSeparate} disabled={busy} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
              <Files size={16} />
              {progress?.mode === 'separate' ? `Mengunduh ${progress.done}/${progress.total}...` : `Unduh ${berkasList.length} File Terpisah`}
            </button>
          </div>
          <PDFDownloadLink
            document={activeDocument}
            fileName={fileNames[activeIndex]}
            className="btn btn-secondary"
            style={{ width: '100%', textDecoration: 'none', fontSize: '13px' }}
          >
            {({ loading }) => (loading ? 'Menyiapkan PDF...' : `📥 Unduh berkas ini saja: ${fileNames[activeIndex]}`)}
          </PDFDownloadLink>
        </div>
        <div className="pdf-preview" style={{ height: 'calc(100vh - 220px)', top: 0 }}>
          <PDFViewer width="100%" height="100%">
            {activeDocument}
          </PDFViewer>
        </div>
      </div>
    </div>
  );
}
