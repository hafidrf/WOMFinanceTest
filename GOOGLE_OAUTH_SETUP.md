# Google OAuth Setup (Expo)

Panduan ini untuk membuat login Google benar-benar jalan di device.

## 1) Buat project di Google Cloud

1. Buka [Google Cloud Console](https://console.cloud.google.com/).
2. Buat project baru (contoh: `wom-finance-test`).
3. Buka menu **APIs & Services**.
4. Di **OAuth consent screen**, pilih **External**.
5. Isi App name, support email, developer email, lalu simpan.
6. Tambahkan scope berikut:
   - `.../auth/userinfo.email`
   - `.../auth/userinfo.profile`
   - `openid`
7. Tambahkan akun email Anda di **Test users**.

## 2) Buat OAuth Client ID

Buat minimal client berikut:

- **Web application** client (untuk fallback/web flow)
- **Android** client (untuk Android build)
- **iOS** client (opsional kalau dites di iOS)
- **Expo** client ID (opsional, jika tersedia di project Anda)

## 3) Isi env di project

1. Copy file:

```bash
cp .env.example .env
```

2. Isi semua nilai client ID:

```env
EXPO_PUBLIC_GOOGLE_EXPO_CLIENT_ID=...
EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID=...
EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID=...
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=...
```

3. Restart server Expo setelah update env.

## 4) Jalankan app di device

1. Jalankan:

```bash
npm run start
```

2. Buka di Android emulator atau Expo Go (scan QR).
3. Di halaman login, klik **Login with Google**.
4. Pilih akun test user yang sudah didaftarkan.
5. Jika sukses:
   - kembali ke app
   - email tampil di Home
   - session tersimpan

## 5) Web browser (`localhost`) — wajib di Google Cloud

Untuk **Login with Google** saat app dibuka di browser (mis. `http://localhost:8085`), OAuth client tipe **Web application** harus memiliki **keduanya**:

### Authorized JavaScript origins

Tambahkan origin **tanpa path** (satu per port yang Anda pakai), contoh:

- `http://localhost:8085`
- `http://localhost:8080` (jika pernah pakai port lain)

Kalau bagian ini **kosong**, Google sering menolak meskipun port sudah benar.

### Authorized redirect URIs

Daftarkan **persis** string yang dipakai app (Google membandingkan byte-per-byte):

- `http://localhost:8085` (disarankan — tanpa `/` di akhir; ini yang dipakai Expo web setelah normalisasi)
- `http://localhost:8085/` (tambahkan juga untuk jaga-jaga)
- `https://auth.expo.io/@USERNAME_EXPO_ANDA/SLUG_DARI_app.json` — untuk Expo Go / flow proxy

Setelah mengubah, tunggu 1–3 menit lalu hard refresh / coba jendela penyamaran.

## 6) Troubleshooting cepat

- **`access blocked`**: pastikan email Anda ada di Test users.
- **`redirect_uri_mismatch`**: hampir selalu karena (a) **JavaScript origins** belum diisi untuk `localhost`, (b) redirect URI beda **slash** `/` di akhir, atau (c) **port** di browser beda dengan yang didaftarkan (8080 vs 8085).
- **tombol Google warning konfigurasi**: env belum terisi atau salah penamaan key.
