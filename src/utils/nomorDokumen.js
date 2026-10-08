// Penyusun nomor dokumen otomatis berdasarkan tanggal + urutan pesanan
// Format: DDD.UU/[KODE/]BULAN_ROMAWI/TAHUN
//   contoh tanggal 2026-10-10, urutan 1:
//   Invoice   -> 010.01/X/2026
//   Pesanan   -> 010.01/SP/X/2026
//   BAST      -> 010.01/BAST/X/2026
//   Kwitansi  -> 010.01/KW/X/2026

const ROMAWI = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];

export const KODE_DOKUMEN = {
  invoice: '',
  pesanan: 'SP',
  bast: 'BAST',
  kwitansi: 'KW'
};

export const formatUrutan = (urutan) => {
  const clean = String(urutan ?? '').replace(/\D/g, '');
  return clean ? clean.padStart(2, '0') : '..';
};

export const buildNomorDokumen = (tanggal, urutan, kode = '') => {
  let hari = '...';
  let bulan = '...';
  let tahun = '....';

  if (tanggal) {
    const [y, m, d] = tanggal.split('-');
    if (d) hari = d.padStart(3, '0');
    if (m) bulan = ROMAWI[parseInt(m, 10) - 1] || bulan;
    if (y) tahun = y;
  }

  return [`${hari}.${formatUrutan(urutan)}`, kode, bulan, tahun].filter(Boolean).join('/');
};

// Semua nomor dokumen untuk satu berkas (BAST mengikuti tanggal BAST)
export const buildSemuaNomor = (tanggal, urutan, tanggalBast = tanggal) => ({
  invoiceNo: buildNomorDokumen(tanggal, urutan, KODE_DOKUMEN.invoice),
  spNo: buildNomorDokumen(tanggal, urutan, KODE_DOKUMEN.pesanan),
  bastNo: buildNomorDokumen(tanggalBast, urutan, KODE_DOKUMEN.bast),
  kwitansiNo: buildNomorDokumen(tanggal, urutan, KODE_DOKUMEN.kwitansi)
});

export const incrementUrutan = (urutan) => {
  const n = parseInt(String(urutan ?? '').replace(/\D/g, ''), 10);
  return String(Number.isNaN(n) ? 1 : n + 1).padStart(2, '0');
};
