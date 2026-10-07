import { useState } from 'react';
import { PDFViewer, Document, Page, Text, View, StyleSheet, Image, PDFDownloadLink } from '@react-pdf/renderer';
import KopSurat from '../components/KopSurat';

const formatRp = (num) => Number(num).toLocaleString('id-ID');

const formatIndonesianDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date)) return dateString;
  const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
  const d = date.getDate().toString().padStart(2, '0');
  return `${d} ${months[date.getMonth()]} ${date.getFullYear()}`;
};

const getIndonesianDay = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date)) return '';
  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  return days[date.getDay()];
};

// --- Styles for PDF ---
const styles = StyleSheet.create({
  page: { padding: 40, fontFamily: 'Helvetica', fontSize: 10 },

  // Title
  titleContainer: { textAlign: 'center', marginBottom: 20 },
  title: { fontSize: 14, fontWeight: 'bold', textDecoration: 'underline', textAlign: 'center', marginBottom: 2 },
  subtitle: { fontSize: 11, textAlign: 'center' },

  // Body text
  paragraph: { fontSize: 10, lineHeight: 1.8, marginBottom: 6, textAlign: 'justify' },
  boldText: { fontWeight: 'bold' },

  // Info rows (Pihak Pertama / Kedua)
  infoRow: { flexDirection: 'row', marginBottom: 2, paddingLeft: 30 },
  infoLabel: { width: 150, fontSize: 10 },
  infoSeparator: { width: 15, fontSize: 10 },
  infoValue: { flex: 1, fontSize: 10 },

  // Tabel
  tableContainer: { borderWidth: 1, borderStyle: 'solid', borderColor: 'black', marginBottom: 10 },
  tableHeader: { flexDirection: 'row', backgroundColor: '#e90060', borderBottomWidth: 1, borderBottomStyle: 'solid', borderBottomColor: 'black' },
  tableHeaderCell: { color: 'white', fontWeight: 'bold', fontSize: 9, textAlign: 'center', padding: 5 },
  tableRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomStyle: 'solid', borderBottomColor: '#ccc' },
  tableCell: { padding: 5, fontSize: 9 },

  // Summary
  summaryRow: { flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 2 },
  summaryLabel: { width: 120, textAlign: 'right', paddingRight: 10, fontSize: 10 },
  summaryValue: { width: 120, textAlign: 'right', fontSize: 10 },

  // Signature
  signatureSection: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 40 },
  signatureBlock: { width: '45%', alignItems: 'center' },
  signatureTitle: { fontSize: 10, marginBottom: 4 },
  signatureImageContainer: { position: 'relative', width: '100%', height: 70, marginVertical: 5 },
  stampImage: { position: 'absolute', left: -10, top: -20, width: 110, height: 110, objectFit: 'contain' },
  signatureImage: { position: 'absolute', left: 50, top: -10, width: 140, height: 90, objectFit: 'contain' },
  signatureName: { fontSize: 10, fontWeight: 'bold', textDecoration: 'underline' },
  signatureLine: { marginTop: 60, width: 150, borderBottomWidth: 1, borderBottomStyle: 'solid', borderBottomColor: 'black', marginBottom: 4 },
});

// --- PDF Document ---
export const BastPDF = ({ data }) => {
  const total = data.items.reduce((sum, item) => sum + (Number(item.price) * Number(item.qty)), 0);

  return (
      <Page size="A4" style={styles.page}>
        <KopSurat />

        {/* JUDUL */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>BERITA ACARA SERAH TERIMA</Text>
          <Text style={styles.subtitle}>No: {data.bastNo}</Text>
        </View>

        {/* PARAGRAF PEMBUKA */}
        <Text style={styles.paragraph}>
          Pada hari ini, {getIndonesianDay(data.tanggal)} tanggal {formatIndonesianDate(data.tanggal)} telah dilakukan serah terima pekerjaan pengadaan {data.jenisPekerjaan} antara:
        </Text>

        {/* PIHAK PERTAMA */}
        <Text style={[styles.paragraph, styles.boldText]}>PIHAK PERTAMA (Penerima):</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Nama</Text>
          <Text style={styles.infoSeparator}>:</Text>
          <Text style={styles.infoValue}>{data.pihak1Nama}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Jabatan</Text>
          <Text style={styles.infoSeparator}>:</Text>
          <Text style={styles.infoValue}>{data.pihak1Jabatan}</Text>
        </View>
        <View style={[styles.infoRow, { marginBottom: 10 }]}>
          <Text style={styles.infoLabel}>Instansi / Lembaga</Text>
          <Text style={styles.infoSeparator}>:</Text>
          <Text style={styles.infoValue}>{data.pihak1Instansi}</Text>
        </View>

        {/* PIHAK KEDUA */}
        <Text style={[styles.paragraph, styles.boldText]}>PIHAK KEDUA (Penyedia):</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Nama</Text>
          <Text style={styles.infoSeparator}>:</Text>
          <Text style={styles.infoValue}>{data.pihak2Nama}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Jabatan</Text>
          <Text style={styles.infoSeparator}>:</Text>
          <Text style={styles.infoValue}>{data.pihak2Jabatan}</Text>
        </View>
        <View style={[styles.infoRow, { marginBottom: 10 }]}>
          <Text style={styles.infoLabel}>Perusahaan</Text>
          <Text style={styles.infoSeparator}>:</Text>
          <Text style={styles.infoValue}>{data.pihak2Perusahaan}</Text>
        </View>

        <Text style={styles.paragraph}>
          Dengan ini menyatakan bahwa PIHAK KEDUA telah menyerahkan barang/jasa kepada PIHAK PERTAMA dengan rincian sebagai berikut:
        </Text>

        {/* TABEL */}
        <View style={styles.tableContainer}>
          <View style={styles.tableHeader}>
            <View style={{ width: '8%', borderRightWidth: 1, borderRightColor: 'black' }}>
              <Text style={styles.tableHeaderCell}>No</Text>
            </View>
            <View style={{ width: '42%', borderRightWidth: 1, borderRightColor: 'black' }}>
              <Text style={styles.tableHeaderCell}>Uraian Barang/Jasa</Text>
            </View>
            <View style={{ width: '10%', borderRightWidth: 1, borderRightColor: 'black' }}>
              <Text style={styles.tableHeaderCell}>Qty</Text>
            </View>
            <View style={{ width: '10%', borderRightWidth: 1, borderRightColor: 'black' }}>
              <Text style={styles.tableHeaderCell}>Satuan</Text>
            </View>
            <View style={{ width: '15%', borderRightWidth: 1, borderRightColor: 'black' }}>
              <Text style={styles.tableHeaderCell}>Harga Satuan</Text>
            </View>
            <View style={{ width: '15%' }}>
              <Text style={styles.tableHeaderCell}>Jumlah</Text>
            </View>
          </View>

          {data.items.map((item, i) => (
            <View style={styles.tableRow} key={i}>
              <View style={{ width: '8%', borderRightWidth: 1, borderRightColor: '#ccc' }}>
                <Text style={[styles.tableCell, { textAlign: 'center' }]}>{i + 1}</Text>
              </View>
              <View style={{ width: '42%', borderRightWidth: 1, borderRightColor: '#ccc' }}>
                <Text style={styles.tableCell}>{item.desc}</Text>
              </View>
              <View style={{ width: '10%', borderRightWidth: 1, borderRightColor: '#ccc' }}>
                <Text style={[styles.tableCell, { textAlign: 'center' }]}>{item.qty}</Text>
              </View>
              <View style={{ width: '10%', borderRightWidth: 1, borderRightColor: '#ccc' }}>
                <Text style={[styles.tableCell, { textAlign: 'center' }]}>{item.satuan}</Text>
              </View>
              <View style={{ width: '15%', borderRightWidth: 1, borderRightColor: '#ccc' }}>
                <Text style={[styles.tableCell, { textAlign: 'right' }]}>Rp {formatRp(item.price)}</Text>
              </View>
              <View style={{ width: '15%' }}>
                <Text style={[styles.tableCell, { textAlign: 'right' }]}>Rp {formatRp(item.price * item.qty)}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* TOTAL */}
        <View style={styles.summaryRow}>
          <Text style={[styles.summaryLabel, { fontWeight: 'bold' }]}>Total :</Text>
          <Text style={[styles.summaryValue, { fontWeight: 'bold' }]}>Rp {formatRp(total)}</Text>
        </View>

        {/* PARAGRAF PENUTUP */}
        <Text style={[styles.paragraph, { marginTop: 10 }]}>
          Demikian Berita Acara Serah Terima ini dibuat dengan sebenarnya untuk dapat dipergunakan sebagaimana mestinya.
        </Text>

        {/* TANDA TANGAN */}
        <View style={styles.signatureSection}>
          {/* Pihak Pertama */}
          <View style={styles.signatureBlock}>
            <Text style={styles.signatureTitle}>PIHAK PERTAMA</Text>
            <Text style={styles.signatureTitle}>(Penerima)</Text>
            <View style={styles.signatureLine} />
            <Text style={styles.signatureName}>{data.pihak1Nama}</Text>
            <Text style={{ fontSize: 9 }}>{data.pihak1Jabatan}</Text>
          </View>

          {/* Pihak Kedua */}
          <View style={styles.signatureBlock}>
            <Text style={styles.signatureTitle}>PIHAK KEDUA</Text>
            <Text style={styles.signatureTitle}>(Penyedia)</Text>
            <View style={styles.signatureImageContainer}>
            </View>
            <Text style={styles.signatureName}>{data.pihak2Nama}</Text>
            <Text style={{ fontSize: 9 }}>{data.pihak2Jabatan}</Text>
          </View>
        </View>
      </Page>
  );
};

// --- Main Component ---
export default function Bast() {
  const [formData, setFormData] = useState({
    bastNo: '001/BAST/X/2026',
    tanggal: '2026-10-06',
    jenisPekerjaan: 'Makanan dan Minuman (Nasi Box)',
    pihak1Nama: '',
    pihak1Jabatan: 'Kepala Sekolah',
    pihak1Instansi: 'SDN PEKAYON I',
    pihak2Nama: 'MOHAMMAD BULGHOTUL KHOWASH',
    pihak2Jabatan: 'Direktur',
    pihak2Perusahaan: 'Pawon Yuk Nah Catering',
    items: [{ desc: 'Nasi Box', qty: 125, satuan: 'Box', price: 35000 }]
  });

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = value;
    setFormData({ ...formData, items: newItems });
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { desc: '', qty: 1, satuan: 'Pcs', price: 0 }]
    });
  };

  const removeItem = (index) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: newItems });
  };

  const docFileName = `BAST - ${formData.pihak1Instansi || 'Katering'}.pdf`;
  const MyDocument = (
    <Document title={`BAST - ${formData.pihak1Instansi || 'Katering'}`}>
      <BastPDF data={formData} />
    </Document>
  );

  return (
    <div className="builder-layout">
      {/* Form Section */}
      <div style={{ paddingBottom: '60px' }}>
        <div className="page-header">
          <h2 className="page-title">Berita Acara Serah Terima</h2>
          <p className="page-subtitle">Buat dokumen BAST untuk serah terima barang/jasa katering</p>
        </div>

        <div className="glass-card">
          <h3 style={{ marginBottom: '16px', color: 'var(--primary)' }}>Info Dokumen</h3>
          <div className="form-group">
            <label className="form-label">No BAST</label>
            <input type="text" className="form-input" value={formData.bastNo} onChange={e => setFormData({...formData, bastNo: e.target.value})} />
          </div>
          <div className="grid grid-cols-2">
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Tanggal</label>
              <input type="date" className="form-input" value={formData.tanggal} onChange={e => setFormData({...formData, tanggal: e.target.value})} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Jenis Pekerjaan</label>
            <input type="text" className="form-input" value={formData.jenisPekerjaan} onChange={e => setFormData({...formData, jenisPekerjaan: e.target.value})} />
          </div>

          <h3 style={{ marginBottom: '16px', marginTop: '24px', color: 'var(--primary)' }}>Pihak Pertama (Penerima)</h3>
          <div className="form-group">
            <label className="form-label">Nama</label>
            <input type="text" className="form-input" value={formData.pihak1Nama} onChange={e => setFormData({...formData, pihak1Nama: e.target.value})} />
          </div>
          <div className="grid grid-cols-2">
            <div className="form-group">
              <label className="form-label">Jabatan</label>
              <input type="text" className="form-input" value={formData.pihak1Jabatan} onChange={e => setFormData({...formData, pihak1Jabatan: e.target.value})} />
            </div>
            <div className="form-group">
              <label className="form-label">Instansi / Lembaga</label>
              <input type="text" className="form-input" value={formData.pihak1Instansi} onChange={e => setFormData({...formData, pihak1Instansi: e.target.value})} />
            </div>
          </div>

          <h3 style={{ marginBottom: '16px', marginTop: '24px', color: 'var(--primary)' }}>Pihak Kedua (Penyedia)</h3>
          <div className="form-group">
            <label className="form-label">Nama</label>
            <input type="text" className="form-input" value={formData.pihak2Nama} onChange={e => setFormData({...formData, pihak2Nama: e.target.value})} />
          </div>
          <div className="grid grid-cols-2">
            <div className="form-group">
              <label className="form-label">Jabatan</label>
              <input type="text" className="form-input" value={formData.pihak2Jabatan} onChange={e => setFormData({...formData, pihak2Jabatan: e.target.value})} />
            </div>
            <div className="form-group">
              <label className="form-label">Perusahaan</label>
              <input type="text" className="form-input" value={formData.pihak2Perusahaan} onChange={e => setFormData({...formData, pihak2Perusahaan: e.target.value})} />
            </div>
          </div>

          <h3 style={{ marginBottom: '16px', marginTop: '24px', color: 'var(--primary)' }}>Rincian Barang/Jasa</h3>
          {formData.items.map((item, index) => (
            <div key={index} className="grid" style={{ gridTemplateColumns: '2fr 1fr 1fr 1fr auto', gap: '8px', marginBottom: '12px', alignItems: 'center' }}>
              <input type="text" className="form-input" placeholder="Uraian" value={item.desc} onChange={e => handleItemChange(index, 'desc', e.target.value)} />
              <input type="number" className="form-input" placeholder="Qty" value={item.qty} onChange={e => handleItemChange(index, 'qty', e.target.value)} />
              <input type="text" className="form-input" placeholder="Satuan" value={item.satuan} onChange={e => handleItemChange(index, 'satuan', e.target.value)} />
              <input type="number" className="form-input" placeholder="Harga" value={item.price} onChange={e => handleItemChange(index, 'price', e.target.value)} />
              <button 
                className="btn btn-secondary" 
                onClick={() => removeItem(index)}
                title="Hapus Item"
                style={{ padding: '10px 14px', color: '#DC2626', borderColor: '#FECACA', backgroundColor: '#FEF2F2' }}
              >
                ✕
              </button>
            </div>
          ))}
          <button className="btn btn-secondary" onClick={addItem} style={{ width: '100%', marginTop: '12px' }}>
            + Tambah Item
          </button>
        </div>
      </div>

      {/* PDF Preview */}
      <div style={{ position: 'sticky', top: '40px' }}>
        <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'flex-end', backgroundColor: 'var(--surface)', padding: '12px', borderRadius: '12px', boxShadow: 'var(--shadow-md)' }}>
          <PDFDownloadLink 
            document={MyDocument}
            fileName={docFileName}
            className="btn btn-primary"
            style={{ width: '100%', textDecoration: 'none' }}
          >
            {({ loading }) => (loading ? 'Menyiapkan PDF...' : `📥 Unduh File PDF`)}
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
