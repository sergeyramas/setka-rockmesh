import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'ROCKMESH — стеклопластиковая сетка 150 ₽/м²'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#0F0F0F',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '80px',
        }}
      >
        <div style={{ color: '#FF6B00', fontSize: 28, fontWeight: 800, marginBottom: 24 }}>
          ROCKMESH
        </div>
        <div style={{ color: '#ffffff', fontSize: 52, fontWeight: 800, textAlign: 'center', lineHeight: 1.15 }}>
          Стеклопластиковая сетка
        </div>
        <div style={{ color: '#6B6B6B', fontSize: 32, marginTop: 24 }}>
          150 ₽/м² · ISO 9001 · Гален
        </div>
      </div>
    ),
    size
  )
}
