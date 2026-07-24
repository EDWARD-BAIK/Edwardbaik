export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { url, format } = req.query;
  if (!url) return res.status(400).json({ error: 'URL diperlukan' });

  try {
    // API 1: SocialDownload (NO WATERMARK)
    const resp1 = await fetch(`https://api.socialdownload.net/convert?url=${encodeURIComponent(url)}&format=${format === 'audio' ? 'mp3' : 'mp4'}`);
    const data1 = await resp1.json();
    if (data1?.success && data1?.download_url) {
      return res.json({ title: data1.title, thumbnail: data1.thumbnail, duration: data1.duration, downloadUrl: data1.download_url });
    }

    // API 2: Y2Mate (fallback)
    const resp2 = await fetch(`https://api.y2mate.com/analyze?url=${encodeURIComponent(url)}`);
    const data2 = await resp2.json();
    if (data2?.video?.download_url) {
      return res.json({ title: data2.video.title, thumbnail: data2.video.thumb, duration: data2.video.duration, downloadUrl: data2.video.download_url });
    }

    // API 3: SaveFrom (fallback terakhir)
    const resp3 = await fetch(`https://api.savefrom.net/2?url=${encodeURIComponent(url)}&format=${format === 'audio' ? 'mp3' : 'mp4'}`);
    const data3 = await resp3.json();
    if (data3?.video?.download_url) {
      return res.json({ title: data3.video.title, thumbnail: data3.video.thumb, duration: data3.video.duration, downloadUrl: data3.video.download_url });
    }

    return res.status(500).json({ error: 'Semua API gagal. Coba link lain.' });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
