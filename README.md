# WOM Finance Technical Test (React Native - Expo)

React Native app dengan 3 halaman utama: Login, Home, dan Detail.

Kode project berada di **root repository** ini (bukan di subfolder `app/`). Setelah clone, jalankan perintah dari root folder yang sama dengan `package.json`.

## Fitur yang sudah diimplementasikan

- Login dengan validasi email + password
- Penyimpanan token auth di AsyncStorage dengan expiry 1 jam
- Login dengan Google OAuth (`access_token`) via Expo AuthSession
- Home menampilkan email login
- Home memanggil REST API publik (DummyJSON products) pakai Axios
- Data list menggunakan FlatList
- Pull-to-refresh, loading state, error state, empty state
- Detail produk dengan reusable `ProductCard` yang sama dengan Home
- Handling loading, error, data kosong di detail
- React Navigation + typed routes
- Dukungan dark mode (`userInterfaceStyle: automatic`)

## Struktur folder

- `src/components`: komponen reusable
- `src/context`: auth context/provider
- `src/navigation`: navigator root
- `src/screens`: Login/Home/Detail
- `src/services`: axios client, API service, auth storage, google auth helper
- `src/theme`: palet warna
- `src/types`: tipe API dan navigasi

## Menjalankan project

1. Install dependency:

```bash
npm install
```

2. Salin env:

```bash
cp .env.example .env
```

3. Isi nilai Google OAuth di `.env`:

- `EXPO_PUBLIC_GOOGLE_EXPO_CLIENT_ID`
- `EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID`
- `EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID`
- `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID`

4. Jalankan Expo:

```bash
npm run start
```

Lalu buka di emulator Android / iOS atau Expo Go.

## Catatan Google Login

Untuk login Google, buat OAuth Client di Google Cloud Console dan sesuaikan redirect URI dari Expo AuthSession.
Tanpa konfigurasi env tersebut, tombol Google tetap ada tetapi akan menampilkan peringatan konfigurasi.
