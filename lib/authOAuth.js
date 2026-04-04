import { supabase } from "./supabase";

/**
 * Parse Supabase OAuth redirect URL (implicit hash or PKCE query) and set session.
 * @param {string} url
 * @returns {Promise<{ error: Error | null }>}
 */
export async function completeOAuthFromUrl(url) {
  if (!url) return { error: new Error("Missing URL") };

  let fragment = "";
  let query = "";

  try {
    const parsed = new URL(url);
    fragment = parsed.hash.startsWith("#")
      ? parsed.hash.slice(1)
      : parsed.hash;
    query = parsed.search.startsWith("?")
      ? parsed.search.slice(1)
      : parsed.search;
  } catch {
    const hashIdx = url.indexOf("#");
    const qIdx = url.indexOf("?");
    if (hashIdx >= 0) fragment = url.slice(hashIdx + 1);
    if (qIdx >= 0) {
      const end = hashIdx >= 0 ? hashIdx : url.length;
      query = url.slice(qIdx + 1, end);
    }
  }

  const params = new URLSearchParams(fragment || query);
  const access_token = params.get("access_token");
  const refresh_token = params.get("refresh_token");
  const code = params.get("code");

  if (access_token && refresh_token) {
    const { error } = await supabase.auth.setSession({
      access_token,
      refresh_token,
    });
    return { error: error ?? null };
  }

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    return { error: error ?? null };
  }

  const desc = params.get("error_description") || params.get("error");
  if (desc) {
    return { error: new Error(desc) };
  }

  return { error: new Error("Không tìm thấy mã đăng nhập trong URL.") };
}
