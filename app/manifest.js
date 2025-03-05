export default function manifest() {
  return {
    name: 'Treasuremount',
    short_name: 'Treasuremount',
    description: 'A Progressive Web App built with Next.js',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000000',
    icons: [
        {
            src: "favicon.png",
            sizes: "64x64 32x32 24x24 16x16",
            type: "image/png"
        },
        {
        src: '/logo192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/logo512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}