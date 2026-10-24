import { ImageResponse } from 'next/og';
import { SITE_NAME, SITE_TAGLINE } from '@/lib/config';

export const alt = `${SITE_NAME} – ${SITE_TAGLINE}`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// Social-sharing preview image, generated at build time.
export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 80,
        color: 'white', background: 'linear-gradient(135deg, #4f46e5, #312e81)' }}>
        <div style={{ display: 'flex', fontSize: 84, fontWeight: 800 }}>{SITE_NAME}</div>
        <div style={{ display: 'flex', fontSize: 40, marginTop: 20, opacity: 0.9 }}>{`${SITE_TAGLINE}: tags, reminders, auto-save & AI search`}</div>
      </div>
    ),
    size
  );
}
