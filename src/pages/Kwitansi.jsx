import { useState } from 'react';
import { PDFViewer, Document, Page, Text, View, StyleSheet, Image, PDFDownloadLink } from '@react-pdf/renderer';
import KopSurat from '../components/KopSurat';
import capImg from '../assets/images/cap pawon yuknah.png';
import ttdImg from '../assets/images/my TTD.png';

const formatRp = (num) => Number(num).toLocaleString('id-ID');

const formatIndonesianDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date)) return dateString;
  const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
  const d = date.getDate().toString().padStart(2, '0');
  return `${d} ${months[date.getMonth()]} ${date.getFullYear()}`;
};

// --- Terbilang Helper ---
const terbilang = (angka) => {
  const bilangan = ["", "satu", "dua", "tiga", "empat", "lima", "enam", "tujuh", "delapan", "sembilan", "sepuluh", "sebelas"];
  let hasil = "";
  if (angka < 12) hasil = bilangan[angka];
  else if (angka < 20) hasil = terbilang(angka - 10) + " belas";
  else if (angka < 100) hasil = terbilang(Math.floor(angka / 10)) + " puluh " + (angka % 10 > 0 ? terbilang(angka % 10) : "");
  else if (angka < 200) hasil = "seratus " + (angka - 100 > 0 ? terbilang(angka - 100) : "");
  else if (angka < 1000) hasil = terbilang(Math.floor(angka / 100)) + " ratus " + (angka % 100 > 0 ? terbilang(angka % 100) : "");
  else if (angka < 2000) hasil = "seribu " + (angka - 1000 > 0 ? terbilang(angka - 1000) : "");
  else if (angka < 1000000) hasil = terbilang(Math.floor(angka / 1000)) + " ribu " + (angka % 1000 > 0 ? terbilang(angka % 1000) : "");
  else if (angka < 1000000000) hasil = terbilang(Math.floor(angka / 1000000)) + " juta " + (angka % 1000000 > 0 ? terbilang(angka % 1000000) : "");
  return hasil.trim();
};

const getTerbilang = (num) => {
  if (!num || num === 0) return "Nol rupiah";
  let text = terbilang(num) + " rupiah";
  return text.charAt(0).toUpperCase() + text.slice(1);
};

// --- Styles ---
const styles = StyleSheet.create({
  page: { padding: 40, fontFamily: 'Helvetica', fontSize: 10 },

  titleContainer: { textAlign: 'center', marginBottom: 20 },
  title: { fontSize: 16, fontWeight: 'bold', textDecoration: 'underline', textAlign: 'center', marginBottom: 2 },
  subtitle: { fontSize: 11, textAlign: 'center' },

  // Kwitansi body
  fieldRow: { flexDirection: 'row', marginBottom: 8, alignItems: 'flex-start' },
  fieldLabel: { width: 140, fontSize: 11 },
  fieldSeparator: { width: 15, fontSize: 11 },
  fieldValue: { flex: 1, fontSize: 11 },

  terbilangBox: { 
    borderWidth: 1, borderStyle: 'solid', borderColor: 'black', 
    padding: 8, marginBottom: 8, backgroundColor: '#F8FAFC',
    flex: 1
  },
  terbilangText: { fontSize: 11, fontStyle: 'italic' },

  amountBox: { 
    borderWidth: 2, borderStyle: 'solid', borderColor: '#e90060', 
    padding: 10, flex: 1, textAlign: 'center'
  },
  amountText: { fontSize: 16, fontWeight: 'bold' },

  // Tabel
  tableContainer: { borderWidth: 1, borderStyle: 'solid', borderColor: 'black', marginTop: 10, marginBottom: 10 },
  tableHeader: { flexDirection: 'row', backgroundColor: '#e90060', borderBottomWidth: 1, borderBottomStyle: 'solid', borderBottomColor: 'black' },
  tableHeaderCell: { color: 'white', fontWeight: 'bold', fontSize: 9, textAlign: 'center', padding: 5 },
  tableRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomStyle: 'solid', borderBottomColor: '#ccc' },
  tableCell: { padding: 5, fontSize: 9 },

  totalRow: { flexDirection: 'row', borderTopWidth: 2, borderTopColor: 'black', backgroundColor: '#F8FAFC' },

  // Signature
  signatureSection: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 30 },
  signatureBlock: { width: '45%', alignItems: 'center' },
  signatureTitle: { fontSize: 10, marginBottom: 2 },
  signatureImageContainer: { position: 'relative', width: '100%', height: 70, marginVertical: 5 },
  stampImage: { position: 'absolute', left: -10, top: -20, width: 110, height: 110, objectFit: 'contain' },
  signatureImage: { position: 'absolute', left: 50, top: -10, width: 140, height: 90, objectFit: 'contain' },
  signatureName: { fontSize: 10, fontWeight: 'bold', textDecoration: 'underline' },
  signatureLine: { marginTop: 60, width: 150, borderBottomWidth: 1, borderBottomStyle: 'solid', borderBottomColor: 'black', marginBottom: 4 },

  // Lunas stamp
  lunasContainer: { 
    position: 'absolute', bottom: 120, left: 60,
    borderWidth: 3, borderColor: '#22C55E', borderStyle: 'solid',
    paddingHorizontal: 20, paddingVertical: 6,
    transform: 'rotate(-15deg)'
  },
  lunasText: { fontSize: 28, fontWeight: 'bold', color: '#22C55E' },
});

// --- PDF Document ---
export const KwitansiPDF = ({ data }) => {
  const total = data.items.reduce((sum, item) => sum + (Number(item.price) * Number(item.qty)), 0);

  return (
      <Page size="A4" style={styles.page}>
        <KopSurat />

        {/* JUDUL */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>KWITANSI</Text>
          <Text style={styles.subtitle}>No: {data.kwitansiNo}</Text>
        </View>

        {/* BODY KWITANSI */}
        <View style={styles.fieldRow}>
          <Text style={styles.fieldLabel}>Sudah terima dari</Text>
          <Text style={styles.fieldSeparator}>:</Text>
          <Text style={[styles.fieldValue, { fontWeight: 'bold' }]}>{data.terimaFrom}</Text>
        </View>

        <View style={styles.fieldRow}>
          <Text style={styles.fieldLabel}>Terbilang</Text>
          <Text style={styles.fieldSeparator}>:</Text>
          <View style={styles.terbilangBox}>
            <Text style={styles.terbilangText}>{getTerbilang(total)}</Text>
          </View>
        </View>

        <View style={styles.fieldRow}>
          <Text style={styles.fieldLabel}>Untuk pembayaran</Text>
          <Text style={styles.fieldSeparator}>:</Text>
          <Text style={styles.fieldValue}>{data.untukPembayaran}</Text>
        </View>

        {/* TABEL RINCIAN */}
        <View style={styles.tableContainer}>
          <View style={styles.tableHeader}>
            <View style={{ width: '8%', borderRightWidth: 1, borderRightColor: 'black' }}>
              <Text style={styles.tableHeaderCell}>No</Text>
            </View>
            <View style={{ width: '42%', borderRightWidth: 1, borderRightColor: 'black' }}>
              <Text style={styles.tableHeaderCell}>Keterangan</Text>
            </View>
            <View style={{ width: '10%', borderRightWidth: 1, borderRightColor: 'black' }}>
              <Text style={styles.tableHeaderCell}>Qty</Text>
            </View>
            <View style={{ width: '10%', borderRightWidth: 1, borderRightColor: 'black' }}>
              <Text style={styles.tableHeaderCell}>Satuan</Text>
            </View>
            <View style={{ width: '15%', borderRightWidth: 1, borderRightColor: 'black' }}>
              <Text style={styles.tableHeaderCell}>Harga</Text>
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

          {/* TOTAL */}
          <View style={styles.totalRow}>
            <View style={{ width: '70%' }}>
              <Text style={[styles.tableCell, { fontWeight: 'bold', textAlign: 'right', paddingRight: 10 }]}>TOTAL</Text>
            </View>
            <View style={{ width: '15%' }}></View>
            <View style={{ width: '15%' }}>
              <Text style={[styles.tableCell, { fontWeight: 'bold', textAlign: 'right' }]}>Rp {formatRp(total)}</Text>
            </View>
          </View>
        </View>

        {/* JUMLAH UANG */}
        <View style={[styles.fieldRow, { marginTop: 6 }]}>
          <Text style={styles.fieldLabel}>Jumlah uang</Text>
          <Text style={styles.fieldSeparator}>:</Text>
          <View style={styles.amountBox}>
            <Text style={styles.amountText}>Rp {formatRp(total)}</Text>
          </View>
        </View>

        <View style={styles.fieldRow}>
          <Text style={styles.fieldLabel}>Tanggal</Text>
          <Text style={styles.fieldSeparator}>:</Text>
          <Text style={styles.fieldValue}>{formatIndonesianDate(data.tanggal)}</Text>
        </View>

        {/* STEMPEL LUNAS */}
        {data.showLunas && (
          <View style={styles.lunasContainer}>
            <Text style={styles.lunasText}>LUNAS</Text>
          </View>
        )}

        {/* TANDA TANGAN */}
        <View style={styles.signatureSection}>
          {/* Penerima */}
          <View style={styles.signatureBlock}>
            <Text style={styles.signatureTitle}>Penerima,</Text>
            <View style={styles.signatureLine} />
            <Text style={styles.signatureName}>{data.terimaFrom}</Text>
          </View>

          {/* Yang menyerahkan */}
          <View style={styles.signatureBlock}>
            <Text style={styles.signatureTitle}>Yang Menyerahkan,</Text>
            <View style={styles.signatureImageContainer}>
              {data.showTtd && <Image src={capImg} style={styles.stampImage} />}
              {data.showTtd && <Image src={ttdImg} style={styles.signatureImage} />}
            </View>
            <Text style={styles.signatureName}>MOHAMMAD BULGHOTUL KHOWASH</Text>
            <Text style={{ fontSize: 9 }}>Pawon Yuk Nah Catering</Text>
          </View>
        </View>
      </Page>
  );
};

// --- Main Component ---
export default function Kwitansi() {
  const [formData, setFormData] = useState({
    kwitansiNo: '001/KW/X/2026',
    tanggal: '2026-10-06',
    terimaFrom: '',
    untukPembayaran: 'Pengadaan Makanan dan Minuman (Nasi Box)',
    showLunas: true,
    showTtd: false,
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

  const docFileName = `Kwitansi - ${formData.terimaFrom || 'Katering'}.pdf`;
  const MyDocument = (
    <Document title={`Kwitansi - ${formData.terimaFrom || 'Katering'}`}>
      <KwitansiPDF data={formData} />
    </Document>
  );

  return (
    <div className="builder-layout">
      {/* Form Section */}
      <div style={{ paddingBottom: '60px' }}>
        <div className="page-header">
          <h2 className="page-title">Kwitansi Pembayaran</h2>
          <p className="page-subtitle">Buat kwitansi sebagai bukti pembayaran yang sah</p>
        </div>

        <div className="glass-card">
          <h3 style={{ marginBottom: '16px', color: 'var(--primary)' }}>Info Dokumen</h3>
          <div className="grid grid-cols-2">
            <div className="form-group">
              <label className="form-label">No Kwitansi</label>
              <input type="text" className="form-input" value={formData.kwitansiNo} onChange={e => setFormData({...formData, kwitansiNo: e.target.value})} />
            </div>
            <div className="form-group">
              <label className="form-label">Tanggal</label>
              <input type="date" className="form-input" value={formData.tanggal} onChange={e => setFormData({...formData, tanggal: e.target.value})} />
            </div>
          </div>

          <h3 style={{ marginBottom: '16px', marginTop: '24px', color: 'var(--primary)' }}>Detail Kwitansi</h3>
          <div className="form-group">
            <label className="form-label">Sudah Terima Dari</label>
            <input type="text" className="form-input" placeholder="Nama Instansi / Pemesan" value={formData.terimaFrom} onChange={e => setFormData({...formData, terimaFrom: e.target.value})} />
          </div>
          <div className="form-group">
            <label className="form-label">Untuk Pembayaran</label>
            <textarea className="form-input" rows="2" value={formData.untukPembayaran} onChange={e => setFormData({...formData, untukPembayaran: e.target.value})} />
          </div>

          <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px' }}>
            <input
              type="checkbox"
              id="showLunas"
              checked={formData.showLunas}
              onChange={e => setFormData({...formData, showLunas: e.target.checked})}
              style={{ width: '20px', height: '20px', accentColor: 'var(--primary)' }}
            />
            <label htmlFor="showLunas" className="form-label" style={{ marginBottom: 0, cursor: 'pointer' }}>
              Tampilkan Stempel "LUNAS"
            </label>
          </div>

          <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px' }}>
            <input
              type="checkbox"
              id="showTtdKwitansi"
              checked={formData.showTtd}
              onChange={e => setFormData({...formData, showTtd: e.target.checked})}
              style={{ width: '20px', height: '20px', accentColor: 'var(--primary)' }}
            />
            <label htmlFor="showTtdKwitansi" className="form-label" style={{ marginBottom: 0, cursor: 'pointer' }}>
              Tampilkan Tanda Tangan &amp; Cap
            </label>
          </div>

          <h3 style={{ marginBottom: '16px', marginTop: '24px', color: 'var(--primary)' }}>Rincian Pembayaran</h3>
          {formData.items.map((item, index) => (
            <div key={index} className="grid" style={{ gridTemplateColumns: '2fr 1fr 1fr 1fr auto', gap: '8px', marginBottom: '12px', alignItems: 'center' }}>
              <input type="text" className="form-input" placeholder="Keterangan" value={item.desc} onChange={e => handleItemChange(index, 'desc', e.target.value)} />
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
