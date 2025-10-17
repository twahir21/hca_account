import { component$, useSignal } from "@builder.io/qwik";
import { DocumentHead, Link } from "@builder.io/qwik-city";
import Logo from "~/images/logo.png?jsx";
import { TeacherHome } from "./layout/home/TeacherHome";
import { MenuTeachers } from "./layout/home/menuTeacher";
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
      home: <TeacherHome />,
      bulkSMS: <BulkSMS 
                  count = {bulkSMS.value} 
                  contactsFetch = {contactsGet.value}
                  getGroups = {getGroups.value}
                  smsAnalytics = {smsAnalytics.value}
                  recentSMS = {recentSMS.value}
                />
    };
    return <>
        {/* top-Bar */}
        <div class="h-screen flex">
            <aside class="w-[14%] md:w-[8%] lg:w-[16%] xl:w-[14%] px-4 overflow-scroll">
                <Link href="/" class="flex items-center justify-center lg:justify-start p-4 gap-2">
                        <Logo
                        class="
                        h-6 w-6
                        md:h-8 md:w-8
                        min-h-[24px] min-w-[24px]
                        lg:h-10 lg:w-10
                        xl:h-12 xl:w-12
                        "
                        />
                    <span class="hidden lg:block">HCA</span>
                </Link>
                <MenuTeachers selectedSection={selectedSection} />
            </aside>
            <main class="w-[86%] md:w-[92%] lg:w-[84%] xl:w-[86%] bg-gray-100 overflow-scroll">
                <TopBar username="Alwatan Hussain" role="Teacher"/>
                
                {/* Teacher Sections  */}
                {SectionMap[selectedSection.value] ?? (
                  <p class="p-6 text-gray-500">Section not found</p>
                )}
            </main>
        </div>
    </>
})
export const head: DocumentHead = {
  title: 'Teachers Dashboard | Higher Career Academy (HCA)',
  meta: [
    {
      name: 'description',
      content:
        'Teachers Dashboard for Higher Career Academy. Easily class schedules, academic performance, trip schedules, and important school updates in one secure portal.',
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
      content: 'Teachers Dashboard | Higher Career Academy',
    },
    {
      property: 'og:description',
      content:
        'Secure Teachers portal for Higher Career Academy — view timetables, results, trip schedules, all in one place.',
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
      content: 'Teachers Dashboard | Higher Career Academy',
    },
    {
      name: 'twitter:description',
      content:
        'Log in to the Higher Career Academy Teachers Dashboard to manage child’s education, schedules, and activities securely.',
    },
  ],
};
