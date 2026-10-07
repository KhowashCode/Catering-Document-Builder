import { useState } from 'react';
import { PDFViewer, Document, Page, Text, View, StyleSheet, Image, PDFDownloadLink } from '@react-pdf/renderer';
import KopSurat from '../components/KopSurat';

const formatRp = (num) => Number(num).toLocaleString('id-ID');

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
  title: { fontSize: 14, fontWeight: 'bold', textDecoration: 'underline', textAlign: 'center', marginBottom: 2 },
  subtitle: { fontSize: 11, textAlign: 'center' },

  paragraph: { fontSize: 10, lineHeight: 1.8, marginBottom: 6, textAlign: 'justify' },

  // Info rows
  infoRow: { flexDirection: 'row', marginBottom: 2 },
  infoLabel: { width: 150, fontSize: 10 },
  infoSeparator: { width: 15, fontSize: 10 },
  infoValue: { flex: 1, fontSize: 10 },

  // Tabel
  tableContainer: { borderWidth: 1, borderStyle: 'solid', borderColor: 'black', marginTop: 10, marginBottom: 10 },
  tableHeader: { flexDirection: 'row', backgroundColor: '#e90060', borderBottomWidth: 1, borderBottomStyle: 'solid', borderBottomColor: 'black' },
  tableHeaderCell: { color: 'white', fontWeight: 'bold', fontSize: 9, textAlign: 'center', padding: 5 },
  tableRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomStyle: 'solid', borderBottomColor: '#ccc' },
  tableCell: { padding: 5, fontSize: 9 },

  // Total
  totalRow: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: 'black', backgroundColor: '#F8FAFC' },
  totalLabel: { fontWeight: 'bold', fontSize: 10, padding: 5, textAlign: 'right' },
  totalValue: { fontWeight: 'bold', fontSize: 10, padding: 5, textAlign: 'right' },

  terbilangText: { fontSize: 10, fontStyle: 'italic', marginTop: 6, marginBottom: 10 },

  // Ketentuan
  ketentuanTitle: { fontWeight: 'bold', fontSize: 10, marginTop: 10, marginBottom: 4 },
  ketentuanItem: { fontSize: 10, lineHeight: 1.6, marginBottom: 2, paddingLeft: 15 },

  // Signature
  signatureSection: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 30 },
  signatureBlock: { width: '45%', alignItems: 'center' },
  signatureTitle: { fontSize: 10, marginBottom: 2 },
  signatureImageContainer: { position: 'relative', width: '100%', height: 70, marginVertical: 5 },
  stampImage: { position: 'absolute', left: -10, top: -20, width: 110, height: 110, objectFit: 'contain' },
  signatureImage: { position: 'absolute', left: 50, top: -10, width: 140, height: 90, objectFit: 'contain' },
  signatureName: { fontSize: 10, fontWeight: 'bold', textDecoration: 'underline' },
  signatureLine: { marginTop: 60, width: 150, borderBottomWidth: 1, borderBottomStyle: 'solid', borderBottomColor: 'black', marginBottom: 4 },
});

// --- PDF Document ---
export const PesananPDF = ({ data }) => {
  const total = data.items.reduce((sum, item) => sum + (Number(item.price) * Number(item.qty)), 0);

  return (
      <Page size="A4" style={styles.page}>
        <KopSurat />

        {/* JUDUL */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>SURAT PESANAN</Text>
          <Text style={styles.subtitle}>No: {data.spNo}</Text>
        </View>

        {/* INFO PEMESAN */}
        <Text style={[styles.paragraph, { fontWeight: 'bold', marginBottom: 4 }]}>Kepada Yth:</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Nama Pemesan</Text>
          <Text style={styles.infoSeparator}>:</Text>
          <Text style={styles.infoValue}>{data.namaPemesan}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Instansi / Lembaga</Text>
          <Text style={styles.infoSeparator}>:</Text>
          <Text style={styles.infoValue}>{data.instansiPemesan}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Alamat</Text>
          <Text style={styles.infoSeparator}>:</Text>
          <Text style={styles.infoValue}>{data.alamatPemesan}</Text>
        </View>
        <View style={[styles.infoRow, { marginBottom: 6 }]}>
          <Text style={styles.infoLabel}>No. Telp</Text>
          <Text style={styles.infoSeparator}>:</Text>
          <Text style={styles.infoValue}>{data.telpPemesan}</Text>
        </View>

        <Text style={styles.paragraph}>
          Dengan ini kami memesan barang/jasa kepada <Text style={{ fontWeight: 'bold' }}>Pawon Yuk Nah Catering</Text> dengan rincian sebagai berikut:
        </Text>

        {/* TABEL */}
        <View style={styles.tableContainer}>
          <View style={styles.tableHeader}>
            <View style={{ width: '8%', borderRightWidth: 1, borderRightColor: 'black' }}>
              <Text style={styles.tableHeaderCell}>No</Text>
            </View>
            <View style={{ width: '37%', borderRightWidth: 1, borderRightColor: 'black' }}>
              <Text style={styles.tableHeaderCell}>Nama Barang/Jasa</Text>
            </View>
            <View style={{ width: '10%', borderRightWidth: 1, borderRightColor: 'black' }}>
              <Text style={styles.tableHeaderCell}>Qty</Text>
            </View>
            <View style={{ width: '10%', borderRightWidth: 1, borderRightColor: 'black' }}>
              <Text style={styles.tableHeaderCell}>Satuan</Text>
            </View>
            <View style={{ width: '17%', borderRightWidth: 1, borderRightColor: 'black' }}>
              <Text style={styles.tableHeaderCell}>Harga Satuan</Text>
            </View>
            <View style={{ width: '18%' }}>
              <Text style={styles.tableHeaderCell}>Jumlah</Text>
            </View>
          </View>

          {data.items.map((item, i) => (
            <View style={styles.tableRow} key={i}>
              <View style={{ width: '8%', borderRightWidth: 1, borderRightColor: '#ccc' }}>
                <Text style={[styles.tableCell, { textAlign: 'center' }]}>{i + 1}</Text>
              </View>
              <View style={{ width: '37%', borderRightWidth: 1, borderRightColor: '#ccc' }}>
                <Text style={styles.tableCell}>{item.desc}</Text>
              </View>
              <View style={{ width: '10%', borderRightWidth: 1, borderRightColor: '#ccc' }}>
                <Text style={[styles.tableCell, { textAlign: 'center' }]}>{item.qty}</Text>
              </View>
              <View style={{ width: '10%', borderRightWidth: 1, borderRightColor: '#ccc' }}>
                <Text style={[styles.tableCell, { textAlign: 'center' }]}>{item.satuan}</Text>
              </View>
              <View style={{ width: '17%', borderRightWidth: 1, borderRightColor: '#ccc' }}>
                <Text style={[styles.tableCell, { textAlign: 'right' }]}>Rp {formatRp(item.price)}</Text>
              </View>
              <View style={{ width: '18%' }}>
                <Text style={[styles.tableCell, { textAlign: 'right' }]}>Rp {formatRp(item.price * item.qty)}</Text>
              </View>
            </View>
          ))}

          {/* TOTAL ROW */}
          <View style={styles.totalRow}>
            <View style={{ width: '65%' }}>
              <Text style={styles.totalLabel}>TOTAL</Text>
            </View>
            <View style={{ width: '17%', borderRightWidth: 1, borderRightColor: '#ccc' }}></View>
            <View style={{ width: '18%' }}>
              <Text style={styles.totalValue}>Rp {formatRp(total)}</Text>
            </View>
          </View>
        </View>

        <Text style={styles.terbilangText}>Terbilang: {getTerbilang(total)}</Text>

        {/* KETENTUAN */}
        <Text style={styles.ketentuanTitle}>Ketentuan Pesanan:</Text>
        <Text style={styles.ketentuanItem}>1. Waktu pengiriman: {data.waktuKirim}</Text>
        <Text style={styles.ketentuanItem}>2. Tempat pengiriman: {data.tempatKirim}</Text>
        <Text style={styles.ketentuanItem}>3. Pembayaran: {data.pembayaran}</Text>

        {/* TANDA TANGAN */}
        <View style={styles.signatureSection}>
          {/* Pemesan */}
          <View style={styles.signatureBlock}>
            <Text style={styles.signatureTitle}>Pemesan,</Text>
            <View style={styles.signatureLine} />
            <Text style={styles.signatureName}>{data.namaPemesan}</Text>
          </View>

          {/* Penerima Pesanan */}
          <View style={styles.signatureBlock}>
            <Text style={styles.signatureTitle}>Penerima Pesanan,</Text>
            <View style={styles.signatureImageContainer}>
            </View>
            <Text style={styles.signatureName}>MOHAMMAD BULGHOTUL KHOWASH</Text>
            <Text style={{ fontSize: 9 }}>Pawon Yuk Nah Catering</Text>
          </View>
        </View>
      </Page>
  );
};

// --- Main Component ---
export default function Pesanan() {
  const [formData, setFormData] = useState({
    spNo: '001/SP/X/2026',
    namaPemesan: '',
    instansiPemesan: 'SDN PEKAYON I',
    alamatPemesan: 'Desa Pekayon Kec. Sukadiri, Kab. Tangerang',
    telpPemesan: '',
    waktuKirim: 'Sesuai tanggal yang disepakati',
    tempatKirim: 'SDN PEKAYON I',
    pembayaran: 'Transfer setelah barang diterima',
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

  const docFileName = `Surat Pesanan - ${formData.instansiPemesan || 'Katering'}.pdf`;
  const MyDocument = (
    <Document title={`Surat Pesanan - ${formData.instansiPemesan || 'Katering'}`}>
      <PesananPDF data={formData} />
    </Document>
  );

  return (
    <div className="builder-layout">
      {/* Form Section */}
      <div style={{ paddingBottom: '60px' }}>
        <div className="page-header">
          <h2 className="page-title">Surat Pesanan</h2>
          <p className="page-subtitle">Buat surat pesanan untuk pemesanan barang/jasa katering</p>
        </div>

        <div className="glass-card">
          <h3 style={{ marginBottom: '16px', color: 'var(--primary)' }}>Info Dokumen</h3>
          <div className="form-group">
            <label className="form-label">No Surat Pesanan</label>
            <input type="text" className="form-input" value={formData.spNo} onChange={e => setFormData({...formData, spNo: e.target.value})} />
          </div>

          <h3 style={{ marginBottom: '16px', marginTop: '24px', color: 'var(--primary)' }}>Data Pemesan</h3>
          <div className="form-group">
            <label className="form-label">Nama Pemesan</label>
            <input type="text" className="form-input" value={formData.namaPemesan} onChange={e => setFormData({...formData, namaPemesan: e.target.value})} />
          </div>
          <div className="form-group">
            <label className="form-label">Instansi / Lembaga</label>
            <input type="text" className="form-input" value={formData.instansiPemesan} onChange={e => setFormData({...formData, instansiPemesan: e.target.value})} />
          </div>
          <div className="form-group">
            <label className="form-label">Alamat</label>
            <input type="text" className="form-input" value={formData.alamatPemesan} onChange={e => setFormData({...formData, alamatPemesan: e.target.value})} />
          </div>
          <div className="form-group">
            <label className="form-label">No. Telp</label>
            <input type="text" className="form-input" value={formData.telpPemesan} onChange={e => setFormData({...formData, telpPemesan: e.target.value})} />
          </div>

          <h3 style={{ marginBottom: '16px', marginTop: '24px', color: 'var(--primary)' }}>Item Pesanan</h3>
          {formData.items.map((item, index) => (
            <div key={index} className="grid" style={{ gridTemplateColumns: '2fr 1fr 1fr 1fr auto', gap: '8px', marginBottom: '12px', alignItems: 'center' }}>
              <input type="text" className="form-input" placeholder="Nama Barang" value={item.desc} onChange={e => handleItemChange(index, 'desc', e.target.value)} />
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
          <button className="btn btn-secondary" onClick={addItem} style={{ width: '100%', marginTop: '12px', marginBottom: '24px' }}>
            + Tambah Item
          </button>

          <h3 style={{ marginBottom: '16px', color: 'var(--primary)' }}>Ketentuan Pesanan</h3>
          <div className="form-group">
            <label className="form-label">Waktu Pengiriman</label>
            <input type="text" className="form-input" value={formData.waktuKirim} onChange={e => setFormData({...formData, waktuKirim: e.target.value})} />
          </div>
          <div className="form-group">
            <label className="form-label">Tempat Pengiriman</label>
            <input type="text" className="form-input" value={formData.tempatKirim} onChange={e => setFormData({...formData, tempatKirim: e.target.value})} />
          </div>
          <div className="form-group">
            <label className="form-label">Metode Pembayaran</label>
            <input type="text" className="form-input" value={formData.pembayaran} onChange={e => setFormData({...formData, pembayaran: e.target.value})} />
          </div>
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
