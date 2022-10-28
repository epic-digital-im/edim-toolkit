import Parse from 'parse/dist/parse.min.js';

export async function FetchGraphQL(query: any, variables: any) /* eslint-disable-line @typescript-eslint/no-explicit-any */ {
  const headers: { [key: string]: string } = {
    "Content-Type": "application/json",
    "X-Parse-Application-Id": "epicdm-local",
  }

  try {
    const currentUser = await Parse.User.currentAsync()
    const sessionToken = currentUser && currentUser.getSessionToken();
    if (sessionToken) {
      headers["X-Parse-Session-Token"] = sessionToken;
    }
  } catch (err) {
    console.log(err);
  }

  const response = await fetch("http://localhost:1338/graphql", {
    method: "POST",
    headers,
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  return await response.json();
}

export default FetchGraphQL;