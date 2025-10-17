import { component$, useSignal } from "@builder.io/qwik";
import { DocumentHead, Link } from "@builder.io/qwik-city";
import Logo from "~/images/logo.png?jsx";
import { MenuParent } from "./layout/menuParent";
import { ParentHome } from "./layout/ParentHome";
import { TopBar } from "~/components/ui/topBar";
import { Profile } from "./layout/Profile";

export default component$(() => {
    const selectedSection = useSignal<string>('home');

    // Map of section -> component
    const SectionMap: Record<string, any> = {
      home: <ParentHome />,
      profile: <Profile />
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
                        lg:h-10 lg:w-10
                        min-h-[24px] min-w-[24px]
                        xl:h-12 xl:w-12
                        "
                       />
                    <span class="hidden lg:block">HCA</span>
                </Link>
                <MenuParent selectedSection={selectedSection}/>
            </aside>
            <main class="w-[86%] md:w-[92%] lg:w-[84%] xl:w-[86%] bg-gray-100 overflow-scroll">
                <TopBar username="Salim Amir" role="Parent" />
                {/* Parent Sections  */}
                {SectionMap[selectedSection.value] ?? (
                  <p class="p-6 text-gray-500">Section not found</p>
                )}
            </main>
        </div>
    </>
});

export const head: DocumentHead = {
  title: 'Parents Dashboard | Higher Career Academy (HCA)',
  meta: [
    {
      name: 'description',
      content:
        'Parents Dashboard for Higher Career Academy. Easily access your children’s class timetables, academic performance, trip schedules, fee management, and important school updates in one secure portal.',
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
      content: 'Parents Dashboard | Higher Career Academy',
    },
    {
      property: 'og:description',
      content:
        'Secure parents portal for Higher Career Academy — view timetables, results, trip schedules, and manage fees all in one place.',
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
      content: 'Parents Dashboard | Higher Career Academy',
    },
    {
      name: 'twitter:description',
      content:
        'Log in to the Higher Career Academy Parents Dashboard to manage your child’s education, schedules, and activities securely.',
    },
  ],
};
