import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";


export default component$(() => {

  return (
  <>
    <h1>Landing page ...</h1>
  </>
  );
});

export const head: DocumentHead = {
  title: 'HCA | Accounts and School Management System',
  meta: [
    {
      name: 'description',
      content: 'Secure login portal for HigherCareer Academy’s Accounts and School Management System. Manage students, staff, admissions, and finances in one place.',
    },
  ],

};
