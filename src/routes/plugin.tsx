// define routeLoaders for fetching API 
// define routeAction for posting to API
// this is SSR not executed by browser

import { routeAction$, routeLoader$ } from "@builder.io/qwik-city";
import { LoginAPI } from "~/api/login.api";
import { useSMSAPI } from "~/api/sms.api";
import { isProduction } from "~/const/api.const";

// import { routeAction$ } from "@builder.io/qwik-city";

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

// export const useFileAPI = routeAction$(async (file) => {
//     console.log("DATA: ", file);
//   const formData = new FormData();
//   formData.append("file", file); // "file" must match the body field name in Elysia

//   const response = await fetch("http://localhost:3000/file", {
//     method: "POST",
//     body: formData,
//   });

//   const data = await response.json();
//   console.log(data);
// })


/**
 * ============================================================
 * @description 📨 SMS API FORMS SECTION
 * ------------------------------------------------------------
 * Contains all `useAction$` and `useRouteLoader$` hooks
 * related to SMS API forms.
 * ============================================================
 */

// 1. bulk SMS
export const useBulkSMSPost = routeAction$(async (data) => await useSMSAPI.sendViaExcel(data))
export const useBulkSMSGet = routeLoader$(async() => await useSMSAPI.getTotalSMS());

// 2. contact form
export const useContactPost = routeAction$(async (data) => { return await useSMSAPI.contactPost(data) });
export const useBulkContactFile = routeAction$(async (data) => {  return await useSMSAPI.massiveContactFile(data.payload) });
export const useContactEdit = routeAction$(async (data) => {  return await useSMSAPI.contactUpdate(data) });
export const useContactDel = routeAction$(async (data) => { return await useSMSAPI.deleteContact(data) })

export const useContactGet = routeLoader$(async ({ url }: { url: URL }) => {
  const limit = url.searchParams.get("limit") ?? "5";
  const currentPage = url.searchParams.get("page") ?? "1";
  const search = url.searchParams.get("search") ?? "";

  const name = url.searchParams.get("name") as 'recent-sms' | 'get-groups' | 'get-contacts'
  
  if(name != "get-contacts") {
    return await useSMSAPI.contactsGet({ currentPage: "1", limit: "5", search: "" });
  }

  return await useSMSAPI.contactsGet({ currentPage, limit, search });
});


// 3. group forms
export const useGrpCreate = routeAction$(async (data) => {
  return await useSMSAPI.createGroup(data.payload);
})
export const useGetGroups = routeLoader$(async ({ url }: { url: URL }) => {
  const limit = url.searchParams.get("limit") ?? "5";
  const currentPage = url.searchParams.get("page") ?? "1";
  const search = url.searchParams.get("search") ?? "";

  const name = url.searchParams.get("name") as 'recent-sms' | 'get-groups' | 'get-contacts'
  
  if(name != "get-groups") {
    return await useSMSAPI.getGroups({ currentPage: "1", limit: "5", search: "" });
  }

  return await useSMSAPI.getGroups({ currentPage, limit, search });
});
export const useGrpEdit = routeAction$(async (data) => {  return await useSMSAPI.editGroup(data.payload) });
export const useDeleteGrp = routeAction$(async (data) => { return await useSMSAPI.deleteGrp(data) })

// 4. sms anlytics
export const usesmsAnalytics = routeLoader$(async ({ cookie }) => { 
  const authToken = cookie.get('authToken')?.value || "";

  if (!authToken) {
    return { 
      success: false, 
      message: "Unauthorized", 
      data: {
        totalContacts: 0,
        totalGroups: 0,
        smsToday: 0
      }
    };
  }

  return await useSMSAPI.smsAnalytics(authToken) 
});

// 5. Get recent sms
export const useGetRecentSMS = routeLoader$(async ({ url }: { url: URL }) => { 
  const limit = url.searchParams.get("limit") ?? "5";
  const currentPage = url.searchParams.get("page") ?? "1";
  const search = url.searchParams.get("search") ?? "";

  const name = url.searchParams.get("name") as 'recent-sms' | 'get-groups' | 'get-contacts'
  
  if(name != "recent-sms") {
    return await useSMSAPI.getRecentSMS({ currentPage: "1", limit: "5", search: "" });
  }

  return await useSMSAPI.getRecentSMS({ currentPage, limit, search }) 
});


// ===============================================================
// 📨  Login FORM (useAction$, useRouteLoader$)
// ===============================================================

// 1. Login 
export const useLogin = routeAction$(async (data, { cookie }) => { 
  const sessionId = cookie.get("sessionId");

  const loginReturn = await LoginAPI.login({ data, sessionId: sessionId?.value });

  if (loginReturn.sessionId.length !== 0) {
    cookie.set("sessionId", loginReturn.sessionId, {
      path: "/",
      httpOnly: true,
      sameSite: "strict", // or "strict" if you prefer tighter rules
      secure: isProduction ? true : false,   // use true if running on HTTPS
    }
  );
  } 
  return loginReturn
});

export const useOTP = routeAction$(async (data, { cookie }) => { 
  const otp = Object.values(data).join(""); // convert object to string
  const sessionId = cookie.get("sessionId");

  const otpReturn = await LoginAPI.otp({ otpInput: otp, sessionId: sessionId?.value }); 
  if (otpReturn.authToken) {
    cookie.set("authToken", otpReturn.authToken, {
      path: "/",
      httpOnly: true,
      sameSite: "strict", // or "strict" if you prefer tighter rules
      secure: isProduction ? true : false,   // use true if running on HTTPS
    });
  }

  if (otpReturn.username) {
    cookie.set("username", otpReturn.username, {
      path: "/",
      httpOnly: true,
      sameSite: "strict", // or "strict" if you prefer tighter rules
      secure: isProduction ? true : false,   // use true if running on HTTPS
    });
  }

  if(otpReturn.role) {
    cookie.set("role", otpReturn.role, {
      path: "/",
      httpOnly: true,
      sameSite: "strict", // or "strict" if you prefer tighter rules
      secure: isProduction ? true : false,   // use true if running on HTTPS
    });
  }

  return otpReturn;
});

export const useResendOTP = routeAction$(async (data, { cookie }) => { 
  const sessionId = cookie.get("sessionId");
  if (!sessionId) return { success: false, message: "Session ID not found" };
  return await LoginAPI.resendOTP({ sessionId: sessionId?.value });
});