export function getBrightDataOptions() {
  const username = process.env.BRIGHT_DATA_USERNAME;
  const password = process.env.BRIGHT_DATA_PASSWORD;
  const port = 22225;
  const session_id = (1000000 * Math.random()) | 0;

  return {
    auth: {
      username: `${username}-session-${session_id} `,
      password,
    },
    host: "brd.superproxy.io",
    port,
    rejectUnauthorized: false,
  };
}
