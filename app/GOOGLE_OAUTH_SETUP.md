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

## 5) Troubleshooting cepat

- **`access blocked`**: pastikan email Anda ada di Test users.
- **redirect mismatch**: cek URI redirect yang dipakai AuthSession dan samakan di OAuth client.
- **tombol Google warning konfigurasi**: env belum terisi atau salah penamaan key.
