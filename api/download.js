export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { url, format } = req.query;
  if (!url) {
    return res.status(400).json({ error: 'URL diperlukan' });
  }

  try {
    // === API 1: SocialDownload (no watermark) ===
    const apiUrl = `https://api.socialdownload.net/convert?url=${encodeURIComponent(url)}&format=${format === 'audio' ? 'mp3' : 'mp4'}`;
    let response = await fetch(apiUrl);
    let data = await response.json();

    if (data && data.success && data.download_url) {
      return res.status(200).json({
        title: data.title || 'Unknown',
        thumbnail: data.thumbnail || '',
        duration: data.duration || '00:00',
        downloadUrl: data.download_url || data.url || '',
        format: format || 'video'
      });
    }

    // === API 2: Y2Mate (fallback) ===
    const y2mateUrl = `https://api.y2mate.com/analyze?url=${encodeURIComponent(url)}`;
    const y2mateRes = await fetch(y2mateUrl);
    const y2mateData = await y2mateRes.json();
    
    if (y2mateData && y2mateData.video && y2mateData.video.download_url) {
      return res.status(200).json({
        title: y2mateData.video.title || 'Unknown',
        thumbnail: y2mateData.video.thumb || '',
        duration: y2mateData.video.duration || '00:00',
        downloadUrl: y2mateData.video.download_url || y2mateData.video.url || '',
        format: format || 'video'
      });
    }

    // === API 3: SaveFrom (fallback terakhir) ===
    const saveFromUrl = `https://api.savefrom.net/2?url=${encodeURIComponent(url)}&format=${format === 'audio' ? 'mp3' : 'mp4'}`;
    const saveFromRes = await fetch(saveFromUrl);
    const saveFromData = await saveFromRes.json();
    
    if (saveFromData && saveFromData.video && saveFromData.video.download_url) {
      return res.status(200).json({
        title: saveFromData.video.title || 'Unknown',
        thumbnail: saveFromData.video.thumb || '',
        duration: saveFromData.video.duration || '00:00',
        downloadUrl: saveFromData.video.download_url || saveFromData.video.url || '',
        format: format || 'video'
      });
    }

    // Semua API gagal
    return res.status(500).json({ error: 'Semua API gagal. Coba link lain.' });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
