'use client';
import { useRouter } from 'next/navigation';

export default function LevelCard({ level, SONOLUS_SERVER_URL }) {
  const router = useRouter();

  const getSonolusLink = () => {
    if (!SONOLUS_SERVER_URL) return '';
    const serverWithoutSchema = SONOLUS_SERVER_URL.replace(/^https?:\/\//, '');
    return `https://open.sonolus.com/${serverWithoutSchema}/levels/UnCh-${level.id}`;
  };

  const handleCopyEmbed = async () => {
    const embedMarkdown = `**${level.title}**\n\n${level.description}\n\n![thumbnail](${level.thumbnail || ''})`;
    try {
      await navigator.clipboard.writeText(embedMarkdown);
      alert('Embed markdown copied!');
    } catch (e) {
      alert('Failed to copy: ' + e.message);
    }
  };

  const handleShareTwitter = () => {
    const url = encodeURIComponent(getSonolusLink());
    const text = encodeURIComponent(
      `Play ${level.title} now on UntitledCharts!\nLevel ${level.rating} charted by ${level.author}`
    );
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
  };

  return (
    <main style={{ padding: 20 }}>
      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', maxWidth: 900, margin: '0 auto' }}>
        <div style={{ width: 120, height: 120, borderRadius: 8, overflow: 'hidden', background: '#111' }}>
          {level.thumbnail ? (
            <img src={level.thumbnail} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888' }}>
              No Image
            </div>
          )}
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ borderRadius: 8, border: '1px solid #2f3136', background: '#2b2d31', padding: 12, color: '#e6edf3' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <h2>{`[${level.rating}] ${level.title}`}</h2>
              <div style={{ fontSize: 12, color: '#b9bbbe' }}>by {level.author}</div>
            </div>
            <p style={{ marginTop: 8, marginBottom: 8 }}>{level.description}</p>
            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              <button
                onClick={() => window.open(getSonolusLink(), '_blank')}
                style={{ background: '#5865f2', border: 'none', padding: '8px 12px', borderRadius: 6, color: 'white', cursor: 'pointer' }}
              >
                Open in Sonolus
              </button>
              <button
                onClick={handleCopyEmbed}
                style={{ background: 'transparent', border: '1px solid #4b4f56', padding: '8px 12px', borderRadius: 6, color: 'white', cursor: 'pointer' }}
              >
                Copy Embed
              </button>
              <button
                onClick={handleShareTwitter}
                style={{ background: '#1da1f2', border: 'none', padding: '8px 12px', borderRadius: 6, color: 'white', cursor: 'pointer' }}
              >
                Share on Twitter
              </button>
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 20, maxWidth: 900 }}>
        <button
          onClick={() => router.back()}
          style={{ background: '#222', border: 'none', padding: '8px 12px', borderRadius: 6, color: 'white', cursor: 'pointer' }}
        >
          Go Back
        </button>
      </div>
    </main>
  );
}
