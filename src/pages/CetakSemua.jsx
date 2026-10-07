import { useState } from 'react';
import { PDFViewer, Document, PDFDownloadLink } from '@react-pdf/renderer';
import { PesananPDF } from './Pesanan';
import { BastPDF } from './Bast';
import { InvoicePDF } from './Invoice';
import { KwitansiPDF } from './Kwitansi';

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

export default function CetakSemua() {
  const [formData, setFormData] = useState({
    // Nomer Surat
    spNo: '001/SP/X/2026',
    bastNo: '001/BAST/X/2026',
    invoiceNo: '010.01/IX/2026',
    kwitansiNo: '001/KW/X/2026',
    
    // Waktu
    tanggal: '2026-10-06',
    tanggalBast: '2026-10-06',
    invoiceDueDate: '2026-10-30',
    waktuKirim: 'Sesuai tanggal yang disepakati',
    
    // Pihak 1 (Pelanggan)
    namaPelanggan: '',
    jabatanPelanggan: 'Kepala Sekolah',
    instansiPelanggan: 'SDN PEKAYON I',
    alamatPelanggan: 'Desa Pekayon Kec. Sukadiri, Kab. Tangerang',
    telpPelanggan: '',
    kodeposPelanggan: '15530',
    
    // Pihak 2 (Katering)
    namaKatering: 'MOHAMMAD BULGHOTUL KHOWASH',
    jabatanKatering: 'Direktur',
    perusahaanKatering: 'Pawon Yuk Nah Catering',
    bankName: 'BJB',
    bankAccountName: 'MOHAMMAD BULGHOTUL KHOWASH',
    bankAccountNumber: '0159752356100',
    
    // Transaksi
    jenisPekerjaan: 'Makanan dan Minuman (Nasi Box)',
    pembayaran: 'Transfer setelah barang diterima',
    shippingFee: 0,
    showLunas: true,
    // Tanda tangan & cap per-surat
    showTtdPesanan: false,
    showTtdBast: false,
    showTtdInvoice: false,
    showTtdKwitansi: false,
    
    // Items
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

  // Mappers
  const dataPesanan = {
    spNo: formData.spNo,
    namaPemesan: formData.namaPelanggan,
    instansiPemesan: formData.instansiPelanggan,
    alamatPemesan: formData.alamatPelanggan,
    telpPemesan: formData.telpPelanggan,
    waktuKirim: formData.waktuKirim,
    tempatKirim: formData.instansiPelanggan,
    pembayaran: formData.pembayaran,
    showTtd: formData.showTtdPesanan,
    items: formData.items
  };

  const dataBast = {
    bastNo: formData.bastNo,
    hari: getIndonesianDay(formData.tanggalBast),
    tanggal: formatIndonesianDate(formData.tanggalBast),
    jenisPekerjaan: formData.jenisPekerjaan,
    pihak1Nama: formData.namaPelanggan,
    pihak1Jabatan: formData.jabatanPelanggan,
    pihak1Instansi: formData.instansiPelanggan,
    pihak2Nama: formData.namaKatering,
    pihak2Jabatan: formData.jabatanKatering,
    pihak2Perusahaan: formData.perusahaanKatering,
    showTtd: formData.showTtdBast,
    items: formData.items
  };

  const dataInvoice = {
    invoiceNo: formData.invoiceNo,
    date: formatIndonesianDate(formData.tanggal),
    dueDate: formatIndonesianDate(formData.invoiceDueDate),
    customerName: formData.instansiPelanggan,
    customerAddress: formData.alamatPelanggan,
    customerZip: formData.kodeposPelanggan,
    bankName: formData.bankName,
    bankAccountName: formData.bankAccountName,
    bankAccountNumber: formData.bankAccountNumber,
    shippingFee: formData.shippingFee,
    showTtd: formData.showTtdInvoice,
    items: formData.items
  };

  const dataKwitansi = {
    kwitansiNo: formData.kwitansiNo,
    tanggal: formatIndonesianDate(formData.tanggal),
    terimaFrom: formData.instansiPelanggan,
    untukPembayaran: 'Pengadaan ' + formData.jenisPekerjaan,
    showLunas: formData.showLunas,
    showTtd: formData.showTtdKwitansi,
    items: formData.items
  };

  const docFileName = `Berkas Katering - ${formData.instansiPelanggan || 'Katering'}.pdf`;
  const MyDocument = (
    <Document title={`Berkas Katering - ${formData.instansiPelanggan || 'Katering'}`}>
      <PesananPDF data={dataPesanan} />
      <BastPDF data={dataBast} />
      <InvoicePDF data={dataInvoice} />
      <KwitansiPDF data={dataKwitansi} />
    </Document>
  );

  return (
    <div className="builder-layout">
      {/* Form Section */}
      <div style={{ paddingBottom: '60px' }}>
        <div className="page-header">
          <h2 className="page-title">Cetak Semua Dokumen</h2>
          <p className="page-subtitle">Isi data sekali untuk menghasilkan semua dokumen (Pesanan, BAST, Invoice, Kwitansi)</p>
        </div>

        <div className="glass-card">
          <h3 style={{ marginBottom: '16px', color: 'var(--primary)' }}>Nomor Dokumen</h3>
          <div className="grid grid-cols-2" style={{ gap: '12px', marginBottom: '16px' }}>
            <div className="form-group">
              <label className="form-label">No Surat Pesanan</label>
              <input type="text" className="form-input" value={formData.spNo} onChange={e => setFormData({...formData, spNo: e.target.value})} />
            </div>
            <div className="form-group">
              <label className="form-label">No BAST</label>
              <input type="text" className="form-input" value={formData.bastNo} onChange={e => setFormData({...formData, bastNo: e.target.value})} />
            </div>
            <div className="form-group">
              <label className="form-label">No Invoice</label>
              <input type="text" className="form-input" value={formData.invoiceNo} onChange={e => setFormData({...formData, invoiceNo: e.target.value})} />
            </div>
            <div className="form-group">
              <label className="form-label">No Kwitansi</label>
              <input type="text" className="form-input" value={formData.kwitansiNo} onChange={e => setFormData({...formData, kwitansiNo: e.target.value})} />
            </div>
          </div>

          <h3 style={{ marginBottom: '16px', marginTop: '24px', color: 'var(--primary)' }}>Waktu & Tanggal</h3>
          <div className="grid grid-cols-2" style={{ gap: '12px', marginBottom: '16px' }}>
            <div className="form-group">
              <label className="form-label">Tanggal (Invoice, Kwitansi, Pesanan)</label>
              <input type="date" className="form-input" value={formData.tanggal} onChange={e => setFormData({...formData, tanggal: e.target.value})} />
            </div>
            <div className="form-group">
              <label className="form-label">Tanggal BAST</label>
              <input type="date" className="form-input" value={formData.tanggalBast} onChange={e => setFormData({...formData, tanggalBast: e.target.value})} />
            </div>
            <div className="form-group">
              <label className="form-label">Jatuh Tempo Invoice</label>
              <input type="date" className="form-input" value={formData.invoiceDueDate} onChange={e => setFormData({...formData, invoiceDueDate: e.target.value})} />
            </div>
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Waktu Pengiriman</label>
              <input type="text" className="form-input" value={formData.waktuKirim} onChange={e => setFormData({...formData, waktuKirim: e.target.value})} />
            </div>
          </div>

          <h3 style={{ marginBottom: '16px', marginTop: '24px', color: 'var(--primary)' }}>Data Pelanggan (Pihak 1)</h3>
          <div className="grid grid-cols-2" style={{ gap: '12px', marginBottom: '16px' }}>
            <div className="form-group">
              <label className="form-label">Nama Lengkap</label>
              <input type="text" className="form-input" value={formData.namaPelanggan} onChange={e => setFormData({...formData, namaPelanggan: e.target.value})} />
            </div>
            <div className="form-group">
              <label className="form-label">Jabatan</label>
              <input type="text" className="form-input" value={formData.jabatanPelanggan} onChange={e => setFormData({...formData, jabatanPelanggan: e.target.value})} />
            </div>
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Instansi / Lembaga</label>
              <input type="text" className="form-input" value={formData.instansiPelanggan} onChange={e => setFormData({...formData, instansiPelanggan: e.target.value})} />
            </div>
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Alamat</label>
              <input type="text" className="form-input" value={formData.alamatPelanggan} onChange={e => setFormData({...formData, alamatPelanggan: e.target.value})} />
            </div>
            <div className="form-group">
              <label className="form-label">No. Telp</label>
              <input type="text" className="form-input" value={formData.telpPelanggan} onChange={e => setFormData({...formData, telpPelanggan: e.target.value})} />
            </div>
            <div className="form-group">
              <label className="form-label">Kode Pos</label>
              <input type="text" className="form-input" value={formData.kodeposPelanggan} onChange={e => setFormData({...formData, kodeposPelanggan: e.target.value})} />
            </div>
          </div>

          <h3 style={{ marginBottom: '16px', marginTop: '24px', color: 'var(--primary)' }}>Transaksi & Pekerjaan</h3>
          <div className="form-group">
            <label className="form-label">Jenis Pekerjaan</label>
            <input type="text" className="form-input" value={formData.jenisPekerjaan} onChange={e => setFormData({...formData, jenisPekerjaan: e.target.value})} />
          </div>
          <div className="form-group">
            <label className="form-label">Metode Pembayaran</label>
            <input type="text" className="form-input" value={formData.pembayaran} onChange={e => setFormData({...formData, pembayaran: e.target.value})} />
          </div>

          <h3 style={{ marginBottom: '16px', marginTop: '24px', color: 'var(--primary)' }}>Item Pesanan</h3>
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
          <button className="btn btn-secondary" onClick={addItem} style={{ width: '100%', marginTop: '12px', marginBottom: '16px' }}>
            + Tambah Item
          </button>
          
          <div className="form-group">
            <label className="form-label">Biaya Pengiriman (Rp)</label>
            <input type="number" className="form-input" value={formData.shippingFee} onChange={e => setFormData({...formData, shippingFee: e.target.value})} />
          </div>

          <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '16px' }}>
            <input
              type="checkbox"
              id="showLunas"
              checked={formData.showLunas}
              onChange={e => setFormData({...formData, showLunas: e.target.checked})}
              style={{ width: '20px', height: '20px', accentColor: 'var(--primary)' }}
            />
            <label htmlFor="showLunas" className="form-label" style={{ marginBottom: 0, cursor: 'pointer' }}>
              Tampilkan Stempel "LUNAS" di Kwitansi
            </label>
          </div>

          <h3 style={{ marginBottom: '12px', marginTop: '24px', color: 'var(--primary)' }}>Tanda Tangan &amp; Cap per Surat</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            {[{id: 'showTtdPesanan', label: 'Surat Pesanan'}, {id: 'showTtdBast', label: 'BAST'}, {id: 'showTtdInvoice', label: 'Invoice'}, {id: 'showTtdKwitansi', label: 'Kwitansi'}].map(({id, label}) => (
              <div key={id} className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px', padding: '10px 14px', border: '1px solid var(--border)', borderRadius: '8px', backgroundColor: formData[id] ? 'rgba(79,70,229,0.05)' : 'var(--surface)' }}>
                <input
                  type="checkbox"
                  id={id}
                  checked={formData[id]}
                  onChange={e => setFormData({...formData, [id]: e.target.checked})}
                  style={{ width: '18px', height: '18px', accentColor: 'var(--primary)', flexShrink: 0 }}
                />
                <label htmlFor={id} className="form-label" style={{ marginBottom: 0, cursor: 'pointer', fontSize: '13px' }}>
                  ✍️ {label}
                </label>
              </div>
            ))}
          </div>
        </div>
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
