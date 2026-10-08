import { useState } from 'react';
import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';
import BerkasForm, { createDefaultBerkas, buildBerkasDocument, getBerkasFileName } from '../components/BerkasForm';

export default function CetakSemua() {
  const [formData, setFormData] = useState(createDefaultBerkas);

  const docFileName = getBerkasFileName(formData);
  const MyDocument = buildBerkasDocument(formData);

  return (
    <div className="builder-layout">
      {/* Form Section */}
      <div style={{ paddingBottom: '60px' }}>
        <div className="page-header">
          <h2 className="page-title">Cetak Semua Dokumen</h2>
          <p className="page-subtitle">Isi data sekali untuk menghasilkan semua dokumen (Pesanan, BAST, Invoice, Kwitansi)</p>
        </div>

        <BerkasForm formData={formData} onChange={setFormData} />
      </div>

      {/* PDF Preview Section */}
      <div style={{ position: 'sticky', top: '40px' }}>
        <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'flex-end', backgroundColor: 'var(--surface)', padding: '12px', borderRadius: '12px', boxShadow: 'var(--shadow-md)' }}>
          <PDFDownloadLink 
            document={MyDocument}
            fileName={docFileName}
            className="btn btn-primary"
            style={{ width: '100%', textDecoration: 'none' }}
          >
            {({ loading }) => (loading ? 'Menyiapkan PDF...' : `📥 Unduh ${docFileName}`)}
          </PDFDownloadLink>
        </div>
        <div className="pdf-preview" style={{ height: 'calc(100vh - 150px)', top: 0 }}>
          <PDFViewer width="100%" height="100%">
            {MyDocument}
          </PDFViewer>
        </div>
      </div>
    </div>
  );
}
