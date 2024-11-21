export function GET(request) {
  const x = 15;
  const nbPostsThreshold = 10;
  const now = new Date();
  const xMinutesAgo = new Date(now.getTime() - x * 60 * 1000);

  return fetch(
    `https://public.api.bsky.app/xrpc/app.bsky.feed.searchPosts?q=neige+paris&sort=latest&since=${xMinutesAgo.toISOString()}&limit=20`
  )
    .then((response) => {
      return response.json();
    })
    .then((json) => {
      if (
        json &&
        json.posts &&
        json.posts.length &&
        json.posts.length >= nbPostsThreshold
      ) {
        return fetch(process.env.SET_SNOWING_TRUE).then(() => {
          return new Response(
            JSON.stringify({
              message: `Found ${json.posts.length} posts on Bluesky talking about 'neige paris', sounds like it's snowing!`,
            }),
            {
              status: 200,
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
        });
      } else {
        return fetch(process.env.SET_SNOWING_FALSE).then(() => {
          return new Response(
            JSON.stringify({
              message: `Found less than ${nbPostsThreshold} posts on Bluesky talking about "neige paris", sounds like it's not snowing :(`,
            }),
            {
              status: 200,
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
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
