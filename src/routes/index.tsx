import { component$ } from "@builder.io/qwik";
import { type DocumentHead } from "@builder.io/qwik-city";

export default component$(() => {
  return (
    <div class="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-purple-100 p-6">
      <h1 class="text-4xl font-bold mb-10 text-gray-800">Landing Page</h1>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
        {/* Admin */}
        <a
          href="/admin"
          class="p-6 text-center rounded-2xl shadow-lg bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold text-lg transform transition hover:scale-105 hover:shadow-2xl"
        >
          👑 Admin
        </a>

        {/* Teachers */}
        <a
          href="/teachers"
          class="p-6 text-center rounded-2xl shadow-lg bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold text-lg transform transition hover:scale-105 hover:shadow-2xl"
        >
          📚 Teachers
        </a>

        {/* Parents */}
        <a
          href="/parents"
          class="p-6 text-center rounded-2xl shadow-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold text-lg transform transition hover:scale-105 hover:shadow-2xl"
        >
          👨‍👩‍👧 Parents
        </a>
      </div>
    </div>
  );
});



export const head: DocumentHead = {
  title: "HCA | Accounts and School Management System",
  meta: [
    {
      name: "description",
      content:
        "Secure login portal for HigherCareer Academy’s Accounts and School Management System. Manage students, staff, admissions, and finances in one place.",
    },
    {
      name: "keywords",
      content:
        "School Management System, Accounts, Student Portal, Teacher Portal, Parent Portal, HigherCareer Academy, Admissions, Finance, Qwik App, Tanzania",
    },
    {
      name: "author",
      content: "HigherCareer Academy",
    },
    {
      name: "robots",
      content: "index, follow",
    },
    // Open Graph / Facebook
    {
      property: "og:type",
      content: "website",
    },
    {
      property: "og:url",
      content: "https://hca-account.vercel.app/",
    },
    {
      property: "og:title",
      content: "HCA | Accounts and School Management System",
    },
    {
      property: "og:description",
      content:
        "Centralized school management system for HigherCareer Academy. Manage students, teachers, parents, admissions, and finances with ease.",
    },
    {
      property: "og:image",
      content: "https://hca-account.vercel.app/hca_acc.webp",
    },
    {
      property: "og:image:alt",
      content: "HigherCareer Academy - Accounts and School Management Dashboard",
    },
    {
      property: "og:site_name",
      content: "HigherCareer Academy",
    },
    {
      property: "og:locale",
      content: "en_TZ",
    },
    // Twitter
    {
      name: "twitter:card",
      content: "summary_large_image",
    },
    {
      name: "twitter:site",
      content: "@highercareer",
    },
    {
      name: "twitter:creator",
      content: "@highercareer",
    },
    {
      name: "twitter:title",
      content: "HCA | Accounts and School Management System",
    },
    {
      name: "twitter:description",
      content:
        "Lightning-fast, secure school management system built with Qwik. For students, teachers, parents, and admins.",
    },
    {
      name: "twitter:image",
      content: "https://hca-account.vercel.app/og-image.webp",
    },
    {
      name: "twitter:image:alt",
      content: "HigherCareer Academy - School Management System",
    },
  ],
  links: [
    {
      rel: "canonical",
      href: "https://hca-account.vercel.app/",
    },
    {
      rel: "icon",
      href: "/favicon.ico",
      type: "image/x-icon",
    },
  ],
};
