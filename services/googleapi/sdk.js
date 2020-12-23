const api = "https://www.googleapis.com/youtube/v3/playlistItems";

async function getPlaylist(id) {
  let url = new URLSearchParams();

  url.set('key', process.env.GOOGLE_API_KEY);
  url.set('part', 'id');
  url.set('playlistId', id);

  let request = await fetch(api + '?' + url.toString());
  let response = await request.json();

  return response;
}

async function getPlaylistItemCount(id) {
  let response = await getPlaylist(id);
  console.log(response);
  
  return response.pageInfo.totalResults;
}

export { getPlaylist, getPlaylistItemCount };