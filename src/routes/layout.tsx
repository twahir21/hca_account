import { component$, Slot } from "@builder.io/qwik";
import { type RequestHandler } from "@builder.io/qwik-city";
 
export const onGet: RequestHandler = async ({ cacheControl }) => {
  cacheControl({
    // Always serve a cached response by default, up to a week stale
    staleWhileRevalidate: 60 * 60 * 24 * 7,
    // Max once every 5 seconds, revalidate on the server to get a fresh version of this page
    maxAge: 5,
  });
};

// export const onRequest: RequestHandler = async ({ redirect }) => {
//   if (!isLoggedIn()) {
//     throw redirect(308, '/login');
//   }
// };


export default component$(() => {
  return (
    <main class="mx-auto max-w-[2200px] relative">
      <Slot />
    </main>
  );
});