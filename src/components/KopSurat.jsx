import { View, Text, Image, StyleSheet } from '@react-pdf/renderer';
import logoImg from '../assets/images/Logo pawon yuknah.png';

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  logo: { width: 80, height: 80, marginRight: 15, objectFit: 'contain' },
  headerTextContainer: { flex: 1, textAlign: 'center', justifyContent: 'center' },
  businessName: { fontSize: 24, fontWeight: 'extrabold', color: 'black', textTransform: 'uppercase' },
  tagline: { fontSize: 10, fontWeight: 'bold', color: 'black', textTransform: 'uppercase', marginTop: 4, marginBottom: 4 },
  businessDetails: { fontSize: 9, color: 'black' },
  dividerContainer: { marginBottom: 20 },
  dividerThick: { borderTopWidth: 2, borderTopStyle: 'solid', borderTopColor: 'black', marginBottom: 1 },
  dividerThin: { borderTopWidth: 1, borderTopStyle: 'solid', borderTopColor: 'black' }
});

export default function KopSurat() {
  return (
    <View>
      <View style={styles.header}>
        <Image src={logoImg} style={styles.logo} />
        <View style={styles.headerTextContainer}>
          <Text style={styles.businessName}>PAWON YUK NAH CATERING</Text>
          <Text style={styles.tagline}>TERIMA PESANAN : NASI KOTAK, NASI TUMPENG, PRASMANAN DAN ANEKA MACAM KUE</Text>
          <Text style={styles.businessDetails}>Perum Pondok Cituis Indah Blok E.81 Desa Surya Bahari Kec. Pakuhaji. Kabupaten tangerang (15520)</Text>
          <Text style={styles.businessDetails}>No. Telp. 082113747393</Text>
        </View>
        <View style={{ width: 80 }} /> {/* Spacer agar teks benar-benar di tengah */}
      </View>
      <View style={styles.dividerContainer}>
        <View style={styles.dividerThick} />
        <View style={styles.dividerThin} />
      </View>
    </View>
  );
}
