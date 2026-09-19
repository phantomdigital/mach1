export async function verifyTurnstileToken(token: string | undefined, ip?: string) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    console.error("TURNSTILE_SECRET_KEY is not configured; form verification is skipped");
    return true;
  }

  if (!token) return false;

  const body = new URLSearchParams({
    secret,
    response: token,
  });
  if (ip && ip !== "unknown") body.set("remoteip", ip);

  try {
    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });
    const data = (await response.json()) as { success?: boolean };
    return data.success === true;
  } catch (error) {
    console.error("Turnstile verification failed:", error);
    return false;
  }
}
