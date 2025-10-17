import { component$ } from "@builder.io/qwik"

import { Calendar } from "~/components/ui/calendar"
import { TimetableTeacher } from "./timetableTeacher"

export const TeacherHome = component$(() => {
    return <>
    <div class="p-4 flex gap-4 flex-col md:flex-row">      
        {/* MIDDLE  */}
        <div class="w-full lg:w-2/3 flex flex-col gap-8">
            <TimetableTeacher />
        </div>

        {/* RIGHT  */}
        <div class="w-full lg:w-1/3 flex flex-col gap-12">
            <Calendar />
        </div>
    </div>
    </>
})