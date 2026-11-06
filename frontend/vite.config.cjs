const { defineConfig } = require('vite')
const react = require('@vitejs/plugin-react')
const os = require('os')
const path = require('path')

module.exports = defineConfig({
    plugins: [react()],
    cacheDir: path.resolve(os.tmpdir(), 'sneha-vite-cache'),
    server: {
        port: 5173,
        proxy: {
            '/api': {
                target: 'http://localhost:5000',
                changeOrigin: true
            }
        }
    }
})

