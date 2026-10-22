// Music API Configuration (iTunes Search API — no auth required)
// This file is provided for you — no TODOs here!

// Search for tracks using the iTunes Search API
async function searchTracks(searchQuery) {
  try {
    const url = new URL('https://itunes.apple.com/search');
    url.searchParams.append('term', searchQuery);
    url.searchParams.append('media', 'music');
    url.searchParams.append('limit', '10');

    const response = await fetch(url.toString());

    if (response.status === 429) {
      throw new Error('Rate limit exceeded. Please wait and try again.');
    }

    if (!response.ok) {
      throw new Error(`Music search failed: ${response.status}`);
    }

    const data = await response.json();

    // Transform to simplified track objects
    const tracks = data.results.map(track => ({
      id: String(track.trackId),
      name: track.trackName,
      artist: track.artistName || 'Unknown Artist',
      album: track.collectionName || 'Unknown Album',
      preview_url: track.previewUrl || null,
      image: track.artworkUrl100 || null
    }));

    return tracks;
  } catch (error) {
    console.error('Error searching music:', error.message);
    throw error;
  }
}

module.exports = { searchTracks };
