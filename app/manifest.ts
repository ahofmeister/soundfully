import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'Soundfully',
        short_name: 'Soundfully',
        description: '',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#000000',
        icons: [
            {
                src: '/icons/favicon-96x96.png',
                sizes: '96',
                type: 'image/png',
            },
        ],
    }
}