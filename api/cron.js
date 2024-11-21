export function GET(request) {
  const now = new Date();
  const tenMinutesAgo = new Date(now.getTime() - 10 * 60 * 1000);

  return fetch(
    `https://public.api.bsky.app/xrpc/app.bsky.feed.searchPosts?q=neige+paris&sort=latest&since=${tenMinutesAgo.toISOString()}&limit=20`
  )
    .then((response) => {
      return response.json();
    })
    .then((json) => {
      if (json && json.posts && json.posts.length && json.posts.length > 10) {
        return fetch(process.env.SET_SNOWING_TRUE).then(() => {
          return new Response(null, { status: 200 });
        });
      } else {
        return fetch(process.env.SET_SNOWING_FALSE).then(() => {
          return new Response(null, { status: 200 });
        });
      }
    })
    .catch(() => {
      return new Response(null, { status: 500 });
    });
}

export const config = {
  runtime: "edge",
};
