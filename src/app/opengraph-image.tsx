import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Clubd — Find Your People';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px 100px',
          background: 'linear-gradient(135deg, #1C1E2A 0%, #2A1F1A 100%)',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        {/* Decorative circles */}
        <div
          style={{
            position: 'absolute',
            top: -50,
            right: -50,
            width: 400,
            height: 400,
            borderRadius: '50%',
            background: '#E8553A',
            opacity: 0.08,
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: -80,
            right: 100,
            width: 300,
            height: 300,
            borderRadius: '50%',
            background: '#F4A261',
            opacity: 0.06,
          }}
        />

        {/* Accent bar */}
        <div
          style={{
            width: 80,
            height: 6,
            borderRadius: 3,
            background: 'linear-gradient(90deg, #E8553A, #F4A261)',
            marginBottom: 24,
          }}
        />

        {/* Title */}
        <div
          style={{
            fontSize: 80,
            fontWeight: 800,
            color: 'white',
            letterSpacing: -3,
            lineHeight: 1,
          }}
        >
          Clubd
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 36,
            fontWeight: 400,
            color: '#B8B5AF',
            marginTop: 16,
          }}
        >
          Find Your People
        </div>

        {/* Description */}
        <div
          style={{
            fontSize: 22,
            color: '#8A8780',
            marginTop: 24,
            lineHeight: 1.5,
          }}
        >
          Discover free local events in Southern California. See where friends are going.
        </div>

        {/* Category dots */}
        <div style={{ display: 'flex', gap: 10, marginTop: 40, alignItems: 'center' }}>
          {['#C44B3F', '#5A9E6F', '#E8553A', '#3478A7', '#C88B2E', '#7B5EA7', '#D47B8E', '#2E8E8E'].map(
            (c) => (
              <div
                key={c}
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  background: c,
                }}
              />
            ),
          )}
          <span style={{ fontSize: 14, color: '#6A6760', marginLeft: 8 }}>8 categories</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
