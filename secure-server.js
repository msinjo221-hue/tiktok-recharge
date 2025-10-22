// secure-server.js
// Proxy ke Live Server tanpa autentikasi

const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();

// ========== CONFIG ==========
const PORT = 3000; // port server lokal
const LIVE_SERVER_URL = "https://nzh21r1l-5500.asse.devtunnels.ms"; // ganti sesuai Live Server kamu
// ============================

// Proxy semua request ke Live Server URL
app.use(
  "/",
  createProxyMiddleware({
    target: LIVE_SERVER_URL,
    changeOrigin: true,
    secure: false, // biar bisa proxy ke tunnel https
    ws: true,
    logLevel: "warn",
  })
);

// Jalankan server
app.listen(PORT, () => {
  console.log(`🚀 Proxy tanpa sandi berjalan di http://localhost:${PORT}`);
  console.log(`🔁 Meneruskan ke: ${LIVE_SERVER_URL}`);
});
