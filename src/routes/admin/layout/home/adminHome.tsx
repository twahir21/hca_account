import { component$ } from "@builder.io/qwik"
import { UserCard } from "./userCard"
import { AttendanceGraph } from "./attendance"
import { EnrollGraph } from "./enrollGraph"
import { AcademicChart } from "./academiChart"
import { Calendar } from "~/components/ui/calendar"

export const AdminHome = component$(() => {
    return <>
    <section class="p-4 flex gap-4 flex-col md:flex-row">
    {/* LEFT  */}
    <div class="w-full lg:w-2/3 flex flex-col gap-8">
        <div class="flex gap-4 justify-between flex-wrap">
            <UserCard title="Parents" percent={6} status="down" count={1200} />
            <UserCard title="Students" percent={7} status="up" count={1263}/>
            <UserCard title="Teachers" percent={6} status="neutral" count={1800}/>
            <UserCard title="Streams" percent={6} status="up" count={208}/>
        </div>

        {/* CHARTS  */}
        <AttendanceGraph />
        <AcademicChart />
    </div>
    {/* RIGHT  */}
    <div class="w-full lg:w-1/3 flex flex-col gap-12">
        <Calendar />
        <EnrollGraph />
    </div>
    </section>
    </>
})