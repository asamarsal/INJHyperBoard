# Chatbot Setup Guide

## Konfigurasi API Gemini

Untuk menggunakan fitur chatbot dengan Gemini AI, ikuti langkah-langkah berikut:

### 1. Dapatkan API Key Gemini

1. Kunjungi [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Login dengan akun Google Anda
3. Klik "Create API Key" atau "Get API Key"
4. Copy API key yang dihasilkan

### 2. Buat File `.env.local`

1. Di root folder project (`e:\hackathon\INJHyperBoard`), buat file baru bernama `.env.local`
2. Tambahkan konfigurasi berikut:

```env
GEMINI_API_KEY=your_actual_api_key_here
```

Ganti `your_actual_api_key_here` dengan API key yang Anda dapatkan dari langkah 1.

### 3. Restart Development Server

Setelah membuat file `.env.local`, restart development server:

```bash
# Stop server yang sedang berjalan (Ctrl+C)
# Kemudian jalankan kembali:
npm run dev
```

### 4. Test Chatbot

1. Buka browser dan navigasi ke `/chatbot`
2. Coba kirim pesan untuk menguji koneksi dengan Gemini API
3. Chatbot sekarang akan menggunakan Gemini AI untuk memberikan respons yang lebih intelligent

## Troubleshooting

### Error: "Gemini API key not configured"
- Pastikan file `.env.local` ada di root folder project
- Pastikan nama variabel adalah `GEMINI_API_KEY` (case-sensitive)
- Restart development server setelah membuat/mengubah `.env.local`

### Error: "Failed to get response from Gemini API"
- Periksa apakah API key valid
- Pastikan Anda memiliki koneksi internet
- Periksa quota API Anda di Google AI Studio

### Chatbot tidak merespons
- Buka Developer Console (F12) untuk melihat error messages
- Periksa Network tab untuk melihat request/response dari `/api/chatbot`

## Fitur Chatbot

Chatbot ini menggunakan Gemini Pro model dan dioptimalkan untuk menjawab pertanyaan tentang:
- Injective Protocol
- Blockchain technology
- DeFi concepts
- Smart contracts
- Dan topik terkait lainnya

## Keamanan

⚠️ **PENTING**: 
- Jangan commit file `.env.local` ke Git
- File ini sudah otomatis di-ignore oleh `.gitignore`
- Jangan share API key Anda dengan orang lain
- Untuk production, gunakan environment variables yang aman
