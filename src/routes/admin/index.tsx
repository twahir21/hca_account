import { component$, useSignal } from "@builder.io/qwik";
import { DocumentHead, Link } from "@builder.io/qwik-city";
import Logo from "~/images/logo.png?jsx";
import { Menu } from "~/components/ui/menu";
import { AdminHome } from "./layout/home/adminHome";
import { TopBar } from "~/components/ui/topBar";
import { BulkSMS } from "./layout/messages/msgHome";
import { useBulkSMSGet, useContactGet, useGetGroups, useGetRecentSMS, usesmsAnalytics } from "../plugin";

export default component$(() => {

  // 1. Route Loaders
  const bulkSMS = useBulkSMSGet();
  const contactsGet = useContactGet();
  const getGroups = useGetGroups();
  const smsAnalytics = usesmsAnalytics();
  const recentSMS = useGetRecentSMS();

    const selectedSection = useSignal<string>('home'); 

    // Map of section -> component
    const SectionMap: Record<string, any> = {
      home: <AdminHome />,
      bulkSMS: <BulkSMS 
                  count = {bulkSMS.value} 
                  contactsFetch = {contactsGet.value}
                  getGroups = {getGroups.value}
                  smsAnalytics = {smsAnalytics.value}
                  recentSMS = {recentSMS.value}
                />
    };


    return <>
        <div class="h-screen flex">
            {/* 1. Side-Bar */}
            <aside class="w-[14%] md:w-[8%] lg:w-[16%] xl:w-[14%] px-4 overflow-scroll">
                <Link href="/" class="flex items-center justify-center lg:justify-start p-4 gap-2">
                      <Logo
                        class="
                        h-6 w-6
                        min-h-[24px] min-w-[24px]
                        md:h-8 md:w-8
                        lg:h-10 lg:w-10
                        xl:h-12 xl:w-12
                        "
                       />
                    <span class="hidden lg:block">HCA</span>
                </Link>
                <Menu selectedSection={selectedSection}/>
            </aside>
            {/* 2. Main Content  */}
            <main class="w-[86%] md:w-[92%] lg:w-[84%] xl:w-[86%] bg-gray-100 overflow-scroll">
              
                <TopBar username="Twahir Sudy" role="Admin" />

                {/* Admin Sections  */}
                {SectionMap[selectedSection.value] ?? (
                  <p class="p-6 text-gray-500">Section not found</p>
                )}
            </main>
        </div>
    </>
});


export const head: DocumentHead = {
  title: 'Admin Dashboard | Higher Career Academy (HCA)',
  meta: [
    {
      name: 'description',
      content:
        'Admin Dashboard for Higher Career Academy. Easily access all school management tools in one secure portal.',
    },
    {
      name: 'robots',
      content: 'noindex, nofollow', // keep search engines from indexing
    },
    {
      name: 'author',
      content: 'Higher Career Academy',
    },

    // Open Graph (for sharing)
    {
      property: 'og:title',
      content: 'Admin Dashboard | Higher Career Academy',
    },
    {
      property: 'og:description',
      content:
        'Secure Admin portal for Higher Career Academy — view timetables, results, trip schedules, and manage fees all in one place.',
    },
    {
      property: 'og:type',
      content: 'website',
    },
    {
      property: 'og:site_name',
      content: 'Higher Career Academy',
    },

    // Twitter card
    {
      name: 'twitter:card',
      content: 'summary',
    },
    {
      name: 'twitter:title',
      content: 'Admin Dashboard | Higher Career Academy',
    },
    {
      name: 'twitter:description',
      content:
        'Log in to the Higher Career Academy Admin Dashboard to manage education, schedules, and activities securely.',
    },
  ],
};
