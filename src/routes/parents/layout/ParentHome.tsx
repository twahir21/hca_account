import { component$ } from "@builder.io/qwik"

import { Calendar } from "~/components/ui/calendar"
import { TimetableParent } from "./timetable"

export const ParentHome = component$(() => {
    return <>
    <div class="p-4 flex gap-4 flex-col md:flex-row">
    {/* MIDDLE  */}
    <div class="w-full lg:w-2/3 flex flex-col gap-8">
    <TimetableParent />
    </div>
    {/* RIGHT  */}
    <div class="w-full lg:w-1/3 flex flex-col gap-12">
        <Calendar />
    </div>
    </div>
    </>
})