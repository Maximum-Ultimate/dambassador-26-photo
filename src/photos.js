// // photos.js

// const RAW_PHOTOS = [

// ];

// export const GALA_PHOTOS = RAW_PHOTOS.map((fileName, index) => {
//   // 1. Ambil nama tanpa ekstensi (.png)
//   let cleanName = fileName.replace(/\.[^/.]+$/, "");

//   // 2. Hapus angka dan titik di depan (contoh: "36. RISHMA" -> "RISHMA")
//   // Regex ini menghapus angka dan titik/spasi di awal kalimat
//   cleanName = cleanName.replace(/^\d+[\.\s-]*/, "");

//   return {
//     id: index + 1,
//     name: cleanName.trim(), // Nama bersih buat tampilan & search
//     url: `/images/gallery/${fileName}`, // Sesuaikan dengan folder tempat lo nyimpen foto
//   };
// });

// Vite: Simbol ** artinya scan semua sub-folder di dalam /img/
const modules = import.meta.glob("/src/assets/img/**/*.png", { eager: true });

export const GALA_PHOTOS = Object.keys(modules).map((path, index) => {
  // path contoh: "/src/assets/img/D_BEST SALES/36. RISHMA.png"
  const pathParts = path.split("/");
  const fileName = pathParts.pop(); // Ambil "36. RISHMA.png"
  const folderCategory = pathParts.pop(); // Ambil "D_BEST SALES"

  // 1. Bersihkan Nama Orang
  let cleanName = fileName.replace(/\.[^/.]+$/, ""); // Hilangkan .png
  cleanName = cleanName.replace(/^\d+[\.\s-]*/, ""); // Hilangkan angka & titik di depan

  return {
    id: index + 1,
    name: cleanName.trim(),
    category: folderCategory.replace(/_/g, " "), // Biar rapi: "D BEST SALES"
    // Gunakan URL objek dari Vite supaya gambar ke-load dengan benar saat build
    url: modules[path].default || modules[path],
  };
});
