import { defineConfig } from 'vite'
import solidPlugin from 'vite-plugin-solid'

export default defineConfig({
  plugins: [solidPlugin()],
  server: { port: 51591 },
  resolve: { alias: { '~': '/src' } },
})
