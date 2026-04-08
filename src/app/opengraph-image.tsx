import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'NexId - Next Generation Identity';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(to bottom right, #000000, #111827)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '30px', marginBottom: '40px' }}>
          <div style={{
            fontSize: 80,
            background: 'linear-gradient(to bottom right, #4f46e5, #ec4899)',
            width: '150px',
            height: '150px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            borderRadius: '40px',
            fontWeight: 900,
          }}>
            N
          </div>
          <span style={{ fontSize: 100, fontWeight: 900, letterSpacing: '-0.05em' }}>NexId</span>
        </div>
        <p style={{ fontSize: 40, color: '#9ca3af', letterSpacing: '-0.02em' }}>
          Your Next Generation Identity
        </p>
      </div>
    ),
    { ...size }
  );
}
