import { Document } from '@react-pdf/renderer';
import { PesananPDF } from '../pages/Pesanan';
import { BastPDF } from '../pages/Bast';
import { InvoicePDF } from '../pages/Invoice';
import { KwitansiPDF } from '../pages/Kwitansi';
import NomorDokumenInput from './NomorDokumenInput';
import { buildSemuaNomor } from '../utils/nomorDokumen';

// Data default satu berkas (Pesanan + BAST + Invoice + Kwitansi)
export const createDefaultBerkas = () => ({
  // Nama file khusus
  customFileName: '',

  // Nomor surat: dibuat otomatis dari tanggal + urutan pesanan
  urutan: '01',

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

export const getBerkasTitle = (formData) => {
  if (formData.customFileName) return formData.customFileName;
  const instansi = formData.instansiPelanggan || 'Katering';
  const tanggal = formData.tanggal ? ` - ${formData.tanggal}` : '';
  return `Berkas Katering - ${instansi}${tanggal}`;
};

export const getBerkasFileName = (formData) => `${getBerkasTitle(formData)}.pdf`;

// Halaman-halaman PDF untuk satu berkas (tanpa <Document>)
export const BerkasPages = ({ formData }) => {
  const nomor = buildSemuaNomor(formData.tanggal, formData.urutan, formData.tanggalBast);

  const dataPesanan = {
    spNo: nomor.spNo,
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
    bastNo: nomor.bastNo,
    tanggal: formData.tanggalBast,
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
    invoiceNo: nomor.invoiceNo,
    date: formData.tanggal,
    dueDate: formData.invoiceDueDate,
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
    kwitansiNo: nomor.kwitansiNo,
    tanggal: formData.tanggal,
    terimaFrom: formData.instansiPelanggan,
    untukPembayaran: 'Pengadaan ' + formData.jenisPekerjaan,
    showLunas: formData.showLunas,
    showTtd: formData.showTtdKwitansi,
    items: formData.items
  };

  return (
    <>
      <PesananPDF data={dataPesanan} />
      <BastPDF data={dataBast} />
      <InvoicePDF data={dataInvoice} />
      <KwitansiPDF data={dataKwitansi} />
    </>
  );
};

// Satu file PDF lengkap untuk satu berkas
export const buildBerkasDocument = (formData) => (
  <Document title={getBerkasTitle(formData)}>
    {BerkasPages({ formData })}
  </Document>
);

// Form input untuk satu berkas
export default function BerkasForm({ formData, onChange }) {
  const set = (field, value) => onChange({ ...formData, [field]: value });

  const handleItemChange = (index, field, value) => {
    const newItems = formData.items.map((item, i) => (i === index ? { ...item, [field]: value } : item));
    onChange({ ...formData, items: newItems });
  };

  const addItem = () => {
    onChange({ ...formData, items: [...formData.items, { desc: '', qty: 1, satuan: 'Pcs', price: 0 }] });
  };

  const removeItem = (index) => {
    onChange({ ...formData, items: formData.items.filter((_, i) => i !== index) });
  };

  const textInput = (field, type = 'text') => (
    <input type={type} className="form-input" value={formData[field]} onChange={e => set(field, e.target.value)} />
  );

  return (
    <div className="glass-card">
      <h3 style={{ marginBottom: '16px', color: 'var(--primary)' }}>Pengaturan File</h3>
      <div className="form-group" style={{ marginBottom: '24px' }}>
        <label className="form-label">Nama File (kosongkan untuk otomatis)</label>
        {textInput('customFileName')}
        <small style={{ display: 'block', marginTop: '4px', color: 'var(--text-light)', fontSize: '12px' }}>
          Preview: {getBerkasFileName(formData)}
        </small>
      </div>

      <h3 style={{ marginBottom: '16px', color: 'var(--primary)' }}>Nomor Dokumen</h3>
      {(() => {
        const nomor = buildSemuaNomor(formData.tanggal, formData.urutan, formData.tanggalBast);
        return (
          <NomorDokumenInput
            urutan={formData.urutan}
            onChange={(v) => set('urutan', v)}
            tanggalLabel="Tanggal (Invoice, Kwitansi, Pesanan) — khusus BAST mengikuti Tanggal BAST"
            previews={[
              { label: 'Invoice', value: nomor.invoiceNo },
              { label: 'Surat Pesanan', value: nomor.spNo },
              { label: 'BAST (ikut Tanggal BAST)', value: nomor.bastNo },
              { label: 'Kwitansi', value: nomor.kwitansiNo }
            ]}
          />
        );
      })()}

      <h3 style={{ marginBottom: '16px', marginTop: '24px', color: 'var(--primary)' }}>Waktu &amp; Tanggal</h3>
      <div className="grid grid-cols-2" style={{ gap: '12px', marginBottom: '16px' }}>
        <div className="form-group">
          <label className="form-label">Tanggal (Invoice, Kwitansi, Pesanan)</label>
          {textInput('tanggal', 'date')}
        </div>
        <div className="form-group">
          <label className="form-label">Tanggal BAST</label>
          {textInput('tanggalBast', 'date')}
        </div>
        <div className="form-group">
          <label className="form-label">Jatuh Tempo Invoice</label>
          {textInput('invoiceDueDate', 'date')}
        </div>
        <div className="form-group" style={{ gridColumn: 'span 2' }}>
          <label className="form-label">Waktu Pengiriman</label>
          {textInput('waktuKirim')}
        </div>
      </div>

      <h3 style={{ marginBottom: '16px', marginTop: '24px', color: 'var(--primary)' }}>Data Pelanggan (Pihak 1)</h3>
      <div className="grid grid-cols-2" style={{ gap: '12px', marginBottom: '16px' }}>
        <div className="form-group">
          <label className="form-label">Nama Lengkap</label>
          {textInput('namaPelanggan')}
        </div>
        <div className="form-group">
          <label className="form-label">Jabatan</label>
          {textInput('jabatanPelanggan')}
        </div>
        <div className="form-group" style={{ gridColumn: 'span 2' }}>
          <label className="form-label">Instansi / Lembaga</label>
          {textInput('instansiPelanggan')}
        </div>
        <div className="form-group" style={{ gridColumn: 'span 2' }}>
          <label className="form-label">Alamat</label>
          {textInput('alamatPelanggan')}
        </div>
        <div className="form-group">
          <label className="form-label">No. Telp</label>
          {textInput('telpPelanggan')}
        </div>
        <div className="form-group">
          <label className="form-label">Kode Pos</label>
          {textInput('kodeposPelanggan')}
        </div>
      </div>

      <h3 style={{ marginBottom: '16px', marginTop: '24px', color: 'var(--primary)' }}>Transaksi &amp; Pekerjaan</h3>
      <div className="form-group">
        <label className="form-label">Jenis Pekerjaan</label>
        {textInput('jenisPekerjaan')}
      </div>
      <div className="form-group">
        <label className="form-label">Metode Pembayaran</label>
        {textInput('pembayaran')}
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
        {textInput('shippingFee', 'number')}
      </div>

      <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '16px' }}>
        <input
          type="checkbox"
          id="showLunas"
          checked={formData.showLunas}
          onChange={e => set('showLunas', e.target.checked)}
          style={{ width: '20px', height: '20px', accentColor: 'var(--primary)' }}
        />
        <label htmlFor="showLunas" className="form-label" style={{ marginBottom: 0, cursor: 'pointer' }}>
          Tampilkan Stempel "LUNAS" di Kwitansi
        </label>
      </div>

      <h3 style={{ marginBottom: '12px', marginTop: '24px', color: 'var(--primary)' }}>Tanda Tangan &amp; Cap per Surat</h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
        {[{ id: 'showTtdPesanan', label: 'Surat Pesanan' }, { id: 'showTtdBast', label: 'BAST' }, { id: 'showTtdInvoice', label: 'Invoice' }, { id: 'showTtdKwitansi', label: 'Kwitansi' }].map(({ id, label }) => (
          <div key={id} className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px', padding: '10px 14px', border: '1px solid var(--border)', borderRadius: '8px', backgroundColor: formData[id] ? 'rgba(79,70,229,0.05)' : 'var(--surface)' }}>
            <input
              type="checkbox"
              id={id}
              checked={formData[id]}
              onChange={e => set(id, e.target.checked)}
              style={{ width: '18px', height: '18px', accentColor: 'var(--primary)', flexShrink: 0 }}
            />
            <label htmlFor={id} className="form-label" style={{ marginBottom: 0, cursor: 'pointer', fontSize: '13px' }}>
              ✍️ {label}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}
