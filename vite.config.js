import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // cho phép bind tất cả host
    port: 3000, // port của bạn
    // hoặc nếu muốn chỉ allow ngrok
    allowedHosts: [
      'localhost',
      '127.0.0.1',
      'premortuary-jeanetta-slightly.ngrok-free.dev'
    ]
  }
});
