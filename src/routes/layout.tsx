import { component$, Slot } from "@builder.io/qwik";
import { type RequestHandler } from "@builder.io/qwik-city";
 
export const onGet: RequestHandler = async ({ cacheControl }) => {
  cacheControl({
    // Always serve a cached response by default, up to a week stale
    staleWhileRevalidate: 60 * 60 * 24 * 7,
    // Max once every 5 seconds, revalidate on the server to get a fresh version of this page
    maxAge: 5,
  });

  // case scenarios:
  // 1. If has authToken and tries to access /auth or /otp page → go /admin dashboard (other routes should be allowed, they are public including /admin for the dashboard)
  // 2. If has sessionId and tries to access /admin or /auth but no authToken → only allow /otp (other routes should be allowed, they are public)
  // 3. If not logged in at all (no authToken or sessionId) and tries to access /admin or /otp → redirects to /auth
};

export const onRequest: RequestHandler = async ({ url, cookie, next, redirect }) => {
  // Parse cookies

  const authToken = cookie.get('authToken');   // your real cookie names
  const sessionId = cookie.get('sessionId');

  console.log("Session ID:", sessionId?.value);
  console.log("authToken: ", authToken?.value)
  console.log("Role: ", cookie.get('role')?.value);
  console.log("Username: ", cookie.get('username')?.value);

  const pathname = url.pathname;

  console.log("Current Path:", pathname, "SessionID:", !!sessionId?.value, "AuthToken:", !!authToken?.value);


  // helper to avoid redirect loops: only redirect when not already at destination
  const safeRedirect = (to: string) => {
    if (pathname.startsWith(to)) return; // already there — do nothing
    // use throw with redirect to stop processing and redirect
    throw redirect(302, to);
  };

  // 1) If has authToken and tries to access /auth or /otp -> go /admin
  if (authToken) {
    if (pathname.startsWith('/auth') || pathname.startsWith('/otp')) {
      safeRedirect('/admin');
    }
    // allow other routes (including /admin) — no redirect
    return next();
  }

  // 2) If has sessionId and tries to access /admin or /auth but no authToken -> only allow /otp
  if (sessionId && !authToken) {
    if (pathname.startsWith('/otp')) {
      return next(); // allowed
    }
    // allow public routes except /admin and /auth — redirect those to /otp
    if (pathname.startsWith('/admin') || pathname.startsWith('/auth')) {
      safeRedirect('/otp');
    }
    return next();
  }

  // 3) If not logged in at all and tries to access /admin or /otp -> redirect to /auth
  if (!authToken && !sessionId) {
    if (pathname.startsWith('/admin') || pathname.startsWith('/otp')) {
      safeRedirect('/auth');
    }
    return next();
  }

  // default: continue
  return next();
};


export default component$(() => {
  return (
    <main class="mx-auto max-w-[2200px] relative">
      <Slot />
    </main>
  );
});