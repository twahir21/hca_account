import { component$, Signal, useTask$ } from "@builder.io/qwik";
import { SearchInput } from "~/components/ui/Search";
import { recentSMS } from "../../types/TeacherTypes";
import { Pagination } from "~/components/ui/pagination";

type recentSMSProp = {
  recentSMS: recentSMS;
  message: Signal<string>;
}

export const RecentMsg = component$<recentSMSProp>(({ recentSMS, message }) => {
  // 🧩 Hardcoded example data
// const state = useStore({
//   ui: {
//     recentQuery: '',
//   },

//   recent: [
//     {
//       id: 1,
//       text: 'School closed on Monday - holiday reminder',
//       date: '2025-09-01',
//       to: 'All Parents',
//       schedule: {
//         enabled: true,
//         start: '2025-08-28',
//         end: '2025-09-01',
//         frequency: 'once' as 'once' | 'daily' | 'weekly' | 'monthly',
//       },
//     },
//     {
//       id: 2,
//       text: 'Fee reminder: pay before 10th',
//       date: '2025-09-05',
//       to: 'Grade 3',
//       schedule: {
//         enabled: true,
//         start: '2025-09-01',
//         end: '2025-09-10',
//         frequency: 'daily' as 'once' | 'daily' | 'weekly' | 'monthly',
//       },
//     },
//     {
//       id: 3,
//       text: 'Welcome to new term!',
//       date: '2025-08-20',
//       to: 'All Contacts',
//       schedule: { enabled: false },
//     },
//   ],
// });

useTask$(({ track }) => {
  track(() => recentSMS.data);
  console.log("changes ")
})

return (
  <>
    <div class="rounded-2xl shadow ring-1 ring-slate-100 border-2 border-sky-500 bg-sky-50">
      <div class="p-5">
        <div class="flex flex-col gap-3">
          <h3 class="text-lg font-semibold">Recent Messages</h3>
            <SearchInput placeholder="Enter by Message Title ..." name="recent-sms" />
        </div>

        <div class="mt-3 space-y-7">
          {recentSMS.data
            .map((r) => (
              <div
                key={r.id}
                class="p-4 rounded-xl bg-white border border-gray-300 hover:border-sky-400 transition flex flex-col gap-3"
              >
                {/* Message Info */}
                <div class="flex items-start justify-between">
                  <div class="min-w-0">
                    <div class="text-md font-medium text-slate-800 truncate">{r.message}</div>
                    <div class="shrink-0 text-yellow-50text-sm text-slate-400">
                      To: {r.groupName} • {new Date(r.createdAt).toDateString()}
                    </div>
                  </div>
                  <div class="flex flex-col gap-2">
                    <button class="m-1 px-3 py-1 text-xs rounded-full bg-white ring-1 ring-sky-500 hover:bg-sky-100 transition"
                      onClick$={() => message.value = r.message}>
                      Refetch
                    </button>
                  </div>
                </div>

                {/* Schedule Section — if enabled */}
                {/* {r.schedule?.enabled && (
                  <div class="p-3 rounded-lg bg-yellow-50 border border-yellow-500">
                    <div class="flex items-center justify-between mb-2">
                      <h4 class="text-sm font-semibold text-yellow-700">
                        Scheduled Message
                      </h4>
                      <span class="text-xs px-2 py-0.5 rounded-full bg-purple-50 text-purple-900 border border-purple-950 capitalize">
                        {r.schedule.frequency}
                      </span>
                    </div>

                    <div class="text-sm text-slate-700 space-y-1">
                      <div class="flex justify-between">
                        <span class="font-medium">Start:</span>
                        <span>{r.schedule.start}</span>
                      </div>
                      <div class="flex justify-between">
                        <span class="font-medium">End:</span>
                        <span>{r.schedule.end}</span>
                      </div>
                    </div>

                    <div class="mt-3 flex gap-2">
                      <button class="px-3 py-1 text-sm cursor-pointer rounded-xl bg-emerald-50 border border-emerald-600 text-emerald-600 transition">
                        <i class="pr-1 fa-solid fa-pen"></i> Edit
                      </button>
                      <button class="px-3 py-1 text-sm cursor-pointer rounded-xl bg-red-50 ring-1 ring-red-400 text-red-500 transition">
                        <i class="pr-1 fa-solid fa-ban"></i> Disable
                      </button>
                    </div>
                  </div>
                )} */}
              </div>
            ))}

          {recentSMS.data.length === 0 && (
            <div class="text-sm text-slate-400">No recent messages</div>
          )}
        </div>

      </div>
      {/* Pagination */}
      <div class="m-2">
        {recentSMS.data.length > 0 && <Pagination totalItems={recentSMS.totalSMS} name="recent-sms" />}
      </div>
    </div>
  </>
);
})