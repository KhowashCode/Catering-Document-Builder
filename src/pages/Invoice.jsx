import { useState } from 'react';
import { PDFViewer, Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import KopSurat from '../components/KopSurat';

// --- Terbilang Helper ---
const formatIndonesianDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date)) return dateString;
  const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
  const d = date.getDate().toString().padStart(2, '0');
  return `${d} ${months[date.getMonth()]} ${date.getFullYear()}`;
};

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

const formatRp = (num) => {
  return Number(num).toLocaleString('id-ID');
};

// --- Styles for PDF ---
const styles = StyleSheet.create({
  page: { padding: 40, fontFamily: 'Helvetica', fontSize: 10 },
  
  // Layout Utama
  invoiceTitle: { fontSize: 14, color: '#00a2e8', fontStyle: 'italic', textAlign: 'center', marginBottom: 20 },
  
  infoSection: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  pelangganTitle: { fontWeight: 'bold', fontSize: 10, marginBottom: 2 },
  pelangganName: { color: '#00a2e8', fontSize: 11, marginBottom: 2, textTransform: 'uppercase' },
  
  bankSection: { marginTop: 30 },
  bankRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 2 },
  
  dateSection: { width: '40%', alignItems: 'flex-end', justifyContent: 'flex-end' },
  
  // Tabel
  tableContainer: { borderWidth: 1, borderStyle: 'solid', borderColor: 'black' },
  tableHeader: { flexDirection: 'row', backgroundColor: '#e90060', borderBottomWidth: 1, borderBottomStyle: 'solid', borderBottomColor: 'black' },
  tableHeaderCell: { color: 'white', fontWeight: 'bold', fontSize: 9, textAlign: 'center', padding: 5 },
  
  tableBody: { flexDirection: 'row', minHeight: 180 },
  tableColNama: { width: '45%', borderRightWidth: 1, borderRightStyle: 'solid', borderRightColor: 'black', padding: 5 },
  tableColJumlah: { width: '15%', borderRightWidth: 1, borderRightStyle: 'solid', borderRightColor: 'black', padding: 5, textAlign: 'center' },
  tableColHarga: { width: '20%', borderRightWidth: 1, borderRightStyle: 'solid', borderRightColor: 'black', padding: 5 },
  tableColTotal: { width: '20%', padding: 5 },
  
  moneyRow: { flexDirection: 'row', justifyContent: 'space-between' },
  
  // Summary
  summaryContainer: { borderTopWidth: 1, borderTopStyle: 'solid', borderTopColor: 'black' },
  summaryRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomStyle: 'dotted', borderBottomColor: 'black' },
  summaryRowSolid: { flexDirection: 'row' },
  summaryLabelCol: { width: '20%', borderRightWidth: 1, borderRightStyle: 'solid', borderRightColor: 'black', padding: 5, textAlign: 'right', borderLeftWidth: 1, borderLeftStyle: 'solid', borderLeftColor: 'black' },
  summaryValueCol: { width: '20%', padding: 5 },
  
  // Signature
  signatureContainer: { marginTop: 30, alignSelf: 'flex-end', width: 220, alignItems: 'center' },
  signatureTitle: { fontSize: 10 },
  signatureImageContainer: { position: 'relative', width: '100%', height: 70, marginVertical: 5 },
  stampImage: { position: 'absolute', left: -50, top: -20, width: 110, height: 110, objectFit: 'contain' },
  signatureImage: { position: 'absolute', left: 20, top: -10, width: 140, height: 90, objectFit: 'contain' },
  signatureName: { fontSize: 10, fontWeight: 'bold' }
});

export const InvoicePDF = ({ data }) => {
  const subTotal = data.items.reduce((sum, item) => sum + (Number(item.price) * Number(item.qty)), 0);
  const total = subTotal + Number(data.shippingFee);

  return (
      <Page size="A4" style={styles.page}>
        {/* KOP SURAT */}
        <KopSurat />

        {/* TITLE */}
        <Text style={styles.invoiceTitle}>Invoice # {data.invoiceNo}</Text>

        {/* INFO PELANGGAN & BANK */}
        <View style={styles.infoSection}>
          <View style={{ width: '50%' }}>
            <Text style={styles.pelangganTitle}>PELANGGAN</Text>
            <Text style={styles.pelangganName}>{data.customerName}</Text>
            <Text>{data.customerAddress}</Text>
            <Text>{data.customerZip}</Text>
            
            <View style={styles.bankSection}>
              <View style={styles.bankRow}>
                <Text style={{ fontStyle: 'italic' }}>Transfer Bank : </Text>
                <Text style={{ color: '#00a2e8' }}>{data.bankName}</Text>
              </View>
              <Text style={{ fontWeight: 'bold', marginTop: 2 }}>a/n {data.bankAccountName}</Text>
              <View style={styles.bankRow}>
                <Text style={{ marginTop: 2 }}>Nomor rekening bank: </Text>
                <Text style={{ fontWeight: 'bold', marginTop: 2 }}>{data.bankAccountNumber}</Text>
              </View>
            </View>
          </View>

          <View style={styles.dateSection}>
             <Text style={{ marginBottom: 4 }}>Tanggal: {formatIndonesianDate(data.date)}</Text>
             <Text style={{ fontWeight: 'bold' }}>Jatuh tempo: {formatIndonesianDate(data.dueDate)}</Text>
          </View>
        </View>

        {/* TABEL */}
        <View style={styles.tableContainer}>
          {/* Header */}
          <View style={styles.tableHeader}>
            <View style={{ width: '45%', borderRightWidth: 1, borderRightStyle: 'solid', borderRightColor: 'black' }}>
              <Text style={styles.tableHeaderCell}>NAMA</Text>
            </View>
            <View style={{ width: '15%', borderRightWidth: 1, borderRightStyle: 'solid', borderRightColor: 'black' }}>
              <Text style={styles.tableHeaderCell}>JUMLAH</Text>
            </View>
            <View style={{ width: '20%', borderRightWidth: 1, borderRightStyle: 'solid', borderRightColor: 'black' }}>
              <Text style={styles.tableHeaderCell}>HARGA SATUAN</Text>
            </View>
            <View style={{ width: '20%' }}>
              <Text style={styles.tableHeaderCell}>SUB TOTAL</Text>
            </View>
          </View>

          {/* Body Columns */}
          <View style={styles.tableBody}>
            {/* Kolom NAMA */}
            <View style={styles.tableColNama}>
              {data.items.map((item, i) => (
                <Text key={i} style={{ marginBottom: 4 }}>{item.desc}</Text>
              ))}
            </View>
            
            {/* Kolom JUMLAH */}
            <View style={styles.tableColJumlah}>
              {data.items.map((item, i) => (
                <Text key={i} style={{ marginBottom: 4 }}>{item.qty}</Text>
              ))}
            </View>
            
            {/* Kolom HARGA SATUAN */}
            <View style={styles.tableColHarga}>
              {data.items.map((item, i) => (
                <View key={i} style={[styles.moneyRow, { marginBottom: 4 }]}>
                  <Text>Rp</Text>
                  <Text>{formatRp(item.price)}</Text>
                </View>
              ))}
            </View>
            
            {/* Kolom SUB TOTAL */}
            <View style={styles.tableColTotal}>
              {data.items.map((item, i) => (
                <View key={i} style={[styles.moneyRow, { marginBottom: 4 }]}>
                  <Text>Rp</Text>
                  <Text>{formatRp(item.price * item.qty)}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* SUMMARY */}
          <View style={styles.summaryContainer}>
            {/* Sub Total Row */}
            <View style={styles.summaryRow}>
              <View style={{ width: '60%' }}></View>
              <View style={styles.summaryLabelCol}>
                <Text>SUB TOTAL</Text>
              </View>
              <View style={[styles.summaryValueCol, styles.moneyRow]}>
                <Text>Rp</Text>
                <Text>{formatRp(subTotal)}</Text>
              </View>
            </View>

            {/* Biaya Pengiriman Row */}
            <View style={styles.summaryRow}>
              <View style={{ width: '60%' }}></View>
              <View style={styles.summaryLabelCol}>
                <Text style={{ fontSize: 9 }}>BIAYA PENGIRIMAN</Text>
              </View>
              <View style={[styles.summaryValueCol, styles.moneyRow]}>
                <Text>Rp</Text>
                <Text>{Number(data.shippingFee) === 0 ? '-' : formatRp(data.shippingFee)}</Text>
              </View>
            </View>

            {/* Total Row */}
            <View style={styles.summaryRowSolid}>
              <View style={{ width: '60%', padding: 5 }}>
                <Text style={{ fontStyle: 'italic' }}>Terbilang : {getTerbilang(total)}</Text>
              </View>
              <View style={styles.summaryLabelCol}>
                <Text style={{ fontWeight: 'bold' }}>Total</Text>
              </View>
              <View style={[styles.summaryValueCol, styles.moneyRow]}>
                <Text style={{ fontWeight: 'bold' }}>Rp</Text>
                <Text style={{ fontWeight: 'bold' }}>{formatRp(total)}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Tanda Tangan */}
        <View style={styles.signatureContainer}>
          <Text style={styles.signatureTitle}>HORMAT KAMI</Text>
          <View style={styles.signatureImageContainer}>
          </View>
          <Text style={styles.signatureName}>{data.bankAccountName || 'MOHAMMAD BULGHOTUL KHOWASH'}</Text>
        </View>
      </Page>
  );
};

export default function Invoice() {
  const [formData, setFormData] = useState({
    invoiceNo: '010.01/IX/2026',
    date: '2026-09-10',
    dueDate: '2026-09-30',
    customerName: 'SDN PEKAYON I',
    customerAddress: 'Desa Pekayon Kec. Sukadiri, Kab. Tangerang',
    customerZip: '15530',
    bankName: 'BJB',
    bankAccountName: 'MOHAMMAD BULGHOTUL KHOWASH',
    bankAccountNumber: '0159752356100',
    shippingFee: 0,
    items: [{ desc: 'NASI BOX', price: 35000, qty: 125 }]
  });

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = value;
    setFormData({ ...formData, items: newItems });
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { desc: '', price: 0, qty: 1 }]
    });
  };

  const removeItem = (index) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: newItems });
  };

  return (
    <div className="builder-layout">
      {/* Form Section */}
      <div style={{ paddingBottom: '60px' }}>
        <div className="page-header">
          <h2 className="page-title">Buat Invoice</h2>
          <p className="page-subtitle">Invoice dengan layout kustom sesuai referensi</p>
        </div>

        <div className="glass-card">
          <h3 style={{ marginBottom: '16px', color: 'var(--primary)' }}>Info Tagihan</h3>
          <div className="grid grid-cols-2">
            <div className="form-group">
              <label className="form-label">No Invoice</label>
              <input type="text" className="form-input" value={formData.invoiceNo} onChange={e => setFormData({...formData, invoiceNo: e.target.value})} />
            </div>
          </div>
          <div className="grid grid-cols-2">
            <div className="form-group">
              <label className="form-label">Tanggal</label>
              <input type="date" className="form-input" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
            </div>
            <div className="form-group">
              <label className="form-label">Jatuh Tempo</label>
              <input type="date" className="form-input" value={formData.dueDate} onChange={e => setFormData({...formData, dueDate: e.target.value})} />
            </div>
          </div>

          <h3 style={{ marginBottom: '16px', marginTop: '24px', color: 'var(--primary)' }}>Pelanggan</h3>
          <div className="form-group">
            <label className="form-label">Nama Pelanggan</label>
            <input type="text" className="form-input" value={formData.customerName} onChange={e => setFormData({...formData, customerName: e.target.value})} />
          </div>
          <div className="form-group">
            <label className="form-label">Alamat</label>
            <input type="text" className="form-input" value={formData.customerAddress} onChange={e => setFormData({...formData, customerAddress: e.target.value})} />
          </div>
          <div className="form-group">
            <label className="form-label">Kode Pos / Wilayah</label>
            <input type="text" className="form-input" value={formData.customerZip} onChange={e => setFormData({...formData, customerZip: e.target.value})} />
          </div>

          <h3 style={{ marginBottom: '16px', marginTop: '24px', color: 'var(--primary)' }}>Info Bank</h3>
          <div className="grid grid-cols-3">
            <div className="form-group">
              <label className="form-label">Nama Bank</label>
              <input type="text" className="form-input" value={formData.bankName} onChange={e => setFormData({...formData, bankName: e.target.value})} />
            </div>
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Atas Nama (a/n)</label>
              <input type="text" className="form-input" value={formData.bankAccountName} onChange={e => setFormData({...formData, bankAccountName: e.target.value})} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Nomor Rekening</label>
            <input type="text" className="form-input" value={formData.bankAccountNumber} onChange={e => setFormData({...formData, bankAccountNumber: e.target.value})} />
          </div>

          <h3 style={{ marginBottom: '16px', marginTop: '24px', color: 'var(--primary)' }}>Item Pesanan</h3>
          {formData.items.map((item, index) => (
            <div key={index} className="grid" style={{ gridTemplateColumns: '2fr 1fr 1fr auto', gap: '8px', marginBottom: '12px', alignItems: 'center' }}>
              <input type="text" className="form-input" placeholder="Nama" value={item.desc} onChange={e => handleItemChange(index, 'desc', e.target.value)} />
              <input type="number" className="form-input" placeholder="Jumlah" value={item.qty} onChange={e => handleItemChange(index, 'qty', e.target.value)} />
              <input type="number" className="form-input" placeholder="Harga Satuan" value={item.price} onChange={e => handleItemChange(index, 'price', e.target.value)} />
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

          <div className="form-group">
            <label className="form-label">Biaya Pengiriman (Rp)</label>
            <input type="number" className="form-input" value={formData.shippingFee} onChange={e => setFormData({...formData, shippingFee: e.target.value})} />
          </div>
        </div>
      </div>

      {/* PDF Preview Section */}
      <div className="pdf-preview">
        <PDFViewer width="100%" height="100%">
          <Document>
            <InvoicePDF data={formData} />
          </Document>
        </PDFViewer>
      </div>
    </div>
  );
}
