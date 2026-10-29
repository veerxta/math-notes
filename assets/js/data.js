/*
 * data.js: satu-satunya sumber navigasi Math Notes.
 * Urutan di sini = urutan di beranda, sidebar, daftar topik, dan sebelumnya/berikutnya.
 *
 * Menambah topik:
 *   1. Salin _templates/topik.html ke matkul/<slug>/NN-judul-topik.html.
 *   2. Tambahkan { file: "NN-judul-topik.html", judul: "Judul Topik" } ke `topik`.
 * Daftar topik di matkul/<slug>/index.html dibuat otomatis oleh main.js.
 * bab (opsional): tulis pada topik pertama tiap bab, mis. bab: "Bab 2 · Transformasi Linier";
 *   main.js menampilkannya sebagai label di atas topik itu.
 *
 * aksen: satu warna lembut per matkul (versi mode gelap dicerahkan otomatis di CSS).
 * ringkasan: ubah ke true setelah matkul/<slug>/ringkasan.html dibuat.
 */
window.MATH_NOTES = {
  matkul: [
    {
      slug: "aljabar-linier",
      nama: "Aljabar Linier",
      aksen: "#4C6BB5",
      ringkasan: false,
      topik: [
        { file: "01-ruang-vektor.html", judul: "Ruang Vektor", bab: "Bab 1 · Ruang Vektor" },
        { file: "02-kombinasi-linier-dan-kebebasan-linier.html", judul: "Kombinasi Linier, Rentang, dan Kebebasan Linier" },
        { file: "03-basis-dan-dimensi.html", judul: "Basis dan Dimensi" },
        { file: "04-perubahan-basis.html", judul: "Perubahan Basis" },
        { file: "05-transformasi-linier.html", judul: "Transformasi Linier, Kernel, dan Image", bab: "Bab 2 · Transformasi Linier" },
        { file: "06-representasi-matriks.html", judul: "Representasi Matriks" },
        { file: "07-koset-dan-ruang-hasil-bagi.html", judul: "Koset dan Ruang Hasil Bagi" },
        { file: "08-himpunan-dan-pemetaan-afin.html", judul: "Himpunan dan Pemetaan Afin" },
        { file: "09-isomorfisma-dan-teorema-rank.html", judul: "Isomorfisma dan Teorema Rank" },
        { file: "10-ekuivalensi-dan-similaritas.html", judul: "Ekuivalensi dan Similaritas" },
        { file: "11-jumlah-langsung-dan-proyeksi.html", judul: "Jumlah Langsung, Produk, dan Proyeksi" },
        { file: "12-aplikasi-transformasi-linier.html", judul: "Aplikasi Transformasi Linier" },
        { file: "13-dualitas-dan-bidual.html", judul: "Dualitas dan Bidual", bab: "Bab 3 · Ruang Dual" },
        { file: "14-transposisi-dan-dualitas.html", judul: "Transposisi dan Dualitas" },
        { file: "15-bentuk-bilinear.html", judul: "Bentuk Bilinear" },
        { file: "16-operator-dan-jumlah-langsung.html", judul: "Operator Linier dan Jumlah Langsung" },
        { file: "17-grup-matriks.html", judul: "Grup Matriks" },
        { file: "18-matriks-swadjoin-dan-uniter.html", judul: "Matriks Swadjoin dan Uniter" },
        { file: "19-real-problem-ruang-dual.html", judul: "Real Problem Ruang Dual" },
        { file: "20-determinan-pemetaan-multilinear.html", judul: "Determinan sebagai Pemetaan Multilinear", bab: "Bab 4 · Pemetaan Multilinear" },
        { file: "21-pemetaan-multilinear-dan-tensor.html", judul: "Pemetaan Multilinear dan Tensor" },
        { file: "22-pemetaan-alternating-dan-simetris.html", judul: "Pemetaan Alternating dan Simetris" },
        { file: "23-real-problem-multilinear.html", judul: "Real Problem Multilinear" },
        { file: "24-hasil-kali-titik.html", judul: "Hasil Kali Titik", bab: "Bab 5 · Ruang Hasil Kali Dalam" },
        { file: "25-hasil-kali-dalam.html", judul: "Hasil Kali Dalam" },
        { file: "26-panjang-dan-sudut.html", judul: "Panjang dan Sudut" },
        { file: "27-himpunan-ortonormal.html", judul: "Himpunan Ortonormal dan Gram–Schmidt" },
        { file: "28-komplemen-ortogonal.html", judul: "Komplemen Ortogonal" },
        { file: "29-ruang-hasil-kali-dalam-fungsi.html", judul: "Ruang Hasil Kali Dalam Fungsi" },
        { file: "30-transformasi-uniter.html", judul: "Transformasi Uniter" },
        { file: "31-adjoin-operator.html", judul: "Adjoin Operator" },
        { file: "32-teorema-fundamental-dan-kuadrat-terkecil.html", judul: "Teorema Fundamental dan Kuadrat Terkecil" },
        { file: "33-komputasi-kuantum-dan-ruang-hilbert.html", judul: "Komputasi Kuantum dan Ruang Hilbert" },
        { file: "34-faktorisasi-polinomial.html", judul: "Faktorisasi Polinomial", bab: "Bab 6 · Riwayat Operator Linier" },
        { file: "35-polinomial-minimal.html", judul: "Polinomial Minimal" },
        { file: "36-nilai-eigen.html", judul: "Nilai Eigen" },
        { file: "37-polinomial-karakteristik.html", judul: "Polinomial Karakteristik" },
        { file: "38-diagonalisasi.html", judul: "Diagonalisasi" },
        { file: "39-teorema-spektral.html", judul: "Teorema Spektral" },
        { file: "40-bentuk-kuadrat.html", judul: "Bentuk Kuadrat" },
        { file: "41-dekomposisi-qr.html", judul: "Dekomposisi QR" },
        { file: "42-nilai-singular.html", judul: "Nilai Singular dan Vektor Singular Kanan" },
        { file: "43-vektor-singular-kiri-dan-svd.html", judul: "Vektor Singular Kiri dan SVD" },
        { file: "44-pseudo-invers.html", judul: "Pseudo-Invers lewat SVD" },
        { file: "45-rotasi-dan-translasi.html", judul: "Rotasi dan Translasi" },
        { file: "46-bentuk-segitiga.html", judul: "Bentuk Segitiga", bab: "Bab 7 · Similaritas" },
        { file: "47-dekomposisi-primer.html", judul: "Dekomposisi Primer" },
        { file: "48-operator-nilpoten-i.html", judul: "Operator Nilpoten, Bagian I" },
        { file: "49-operator-nilpoten-ii.html", judul: "Operator Nilpoten, Bagian II" },
        { file: "50-bentuk-kanonik-jordan.html", judul: "Bentuk Kanonik Jordan" },
      ],
    },
    {
      slug: "kalkulus-peubah-banyak",
      nama: "Kalkulus Peubah Banyak",
      aksen: "#2A877E",
      ringkasan: false,
      topik: [],
    },
    {
      slug: "matematika-sistem",
      nama: "Matematika Sistem",
      aksen: "#8A5A9E",
      ringkasan: false,
      topik: [],
    },
    {
      slug: "metode-numerik",
      nama: "Metode Numerik",
      aksen: "#B5812A",
      ringkasan: false,
      topik: [],
    },
    {
      slug: "riset-operasi-1",
      nama: "Riset Operasi 1",
      aksen: "#BF5E3E",
      ringkasan: false,
      topik: [],
    },
    {
      slug: "teknik-simulasi",
      nama: "Teknik Simulasi",
      aksen: "#64873A",
      ringkasan: false,
      topik: [],
    },
  ],

  // Halaman lain di akar situs yang ikut tampil di kaki sidebar.
  lainnya: [
    { file: "komponen.html", judul: "Komponen" },
  ],
};
