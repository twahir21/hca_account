import { component$ } from "@builder.io/qwik";
import Logo from "~/images/logo.png?jsx";

export const HomeNav = component$(() => {
    return <>
      <header class="w-full bg-white border-b-5 border-double border-[#4a90e2] shadow-sm">
        <nav class="max-w-6xl mx-auto flex items-center justify-between p-4">
          <a href="https://www.highercareer.academy" class="flex items-center space-x-2">
            <Logo alt="Higher Career" class="h-10 w-10 min-h-[24px] min-w-[24px] rounded-full"/>
            <span class="font-bold text-[#253c6a]">HigherCareer</span>
          </a>
          <div>
            <a href="https://www.highercareer.academy" class="font-semibold text-[#4a90e2] hover:underline">
              ← Back to Home
            </a>
          </div>
        </nav>
      </header>
    </>
})