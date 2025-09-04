// // define routeLoaders for fetching API 
// // define routeAction for posting to API
// // this is SSR not executed by browser

// import { routeAction$, routeLoader$, z, zod$ } from "@builder.io/qwik-city";

// // example
// export const useUsers = routeLoader$(async ({ redirect, cookie, pathname }) => {
//     const token = cookie.get("jwtToken")?.value;
//     if (!token && pathname.startsWith("/admin")) throw redirect(302, "/auth");
//     return await createApi.user(token!)
// });

// export const useLogin = routeAction$(async(data, { cookie, redirect }) => {
//     const result = await createApi.login(data);

//     if (result.success) {
//         cookie.set("jwtToken", result.token, { path: "/", expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7) });
//         cookie.set("username", result.username, { path: "/", expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7) });
//         cookie.set("role", result.role, { path: "/", expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7) });
//         throw redirect(302, "/admin")
//     }
//     throw redirect(302, "/auth");

// },  zod$({
//     username: z.string().min(2),
//     password: z.string().min(3)
//   })
// )