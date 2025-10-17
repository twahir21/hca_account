import { component$ } from "@builder.io/qwik";

export const Footer = component$(() => {
    return <>
    <footer class="w-full border-t mt-0 bg-[#2c3e50]">
        <div class="max-w-6xl mx-auto text-center py-4  text-white">
            © 2024 <span class="font-semibold">HCA</span>. All rights reserved.
        </div>
    </footer>

    </>
})