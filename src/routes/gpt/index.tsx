import { component$, useStore } from "@builder.io/qwik";
import { SearchInput } from "~/components/ui/Search";

export default component$(() => {
  // 🧩 Hardcoded example data
const state = useStore({
  ui: {
    recentQuery: '',
  },

  recent: [
    {
      id: 1,
      text: 'School closed on Monday - holiday reminder',
      date: '2025-09-01',
      to: 'All Parents',
      schedule: {
        enabled: true,
        start: '2025-08-28',
        end: '2025-09-01',
        frequency: 'once' as 'once' | 'daily' | 'weekly' | 'monthly',
      },
    },
    {
      id: 2,
      text: 'Fee reminder: pay before 10th',
      date: '2025-09-05',
      to: 'Grade 3',
      schedule: {
        enabled: true,
        start: '2025-09-01',
        end: '2025-09-10',
        frequency: 'daily' as 'once' | 'daily' | 'weekly' | 'monthly',
      },
    },
    {
      id: 3,
      text: 'Welcome to new term!',
      date: '2025-08-20',
      to: 'All Contacts',
      schedule: { enabled: false },
    },
  ],
});

return (
  <>
    <div class="p-5 rounded-2xl shadow ring-1 ring-slate-100 border-2 border-sky-500 bg-sky-50">
      <div class="flex flex-col gap-3">
        <h3 class="text-lg font-semibold">Recent Messages</h3>
        <SearchInput placeholder="Enter by Message Title ..." name="get-contacts" />
      </div>

      <div class="mt-3 space-y-3 max-h-96 overflow-auto">
        {state.recent
          .filter(
            (r) =>
              r.text.toLowerCase().includes(state.ui.recentQuery.toLowerCase()) ||
              r.to.toLowerCase().includes(state.ui.recentQuery.toLowerCase())
          )
          .map((r) => (
            <div
              key={r.id}
              class="p-3 rounded-xl bg-white border border-gray-300 hover:border-sky-400 transition flex flex-col gap-3"
            >
              {/* Message Info */}
              <div class="flex items-start justify-between">
                <div>
                  <div class="text-sm font-medium text-slate-800">{r.text}</div>
                  <div class="text-xs text-slate-400">
                    To: {r.to} • {r.date}
                  </div>
                </div>
                <div class="flex flex-col gap-2">
                  <button class="px-3 py-1 text-xs rounded-full bg-white ring-1 ring-sky-500 hover:bg-sky-100 transition">
                    Refetch
                  </button>
                </div>
              </div>

              {/* Schedule Section — if enabled */}
              {r.schedule?.enabled && (
                <div class="p-3 rounded-lg bg-emerald-50 border border-emerald-400">
                  <div class="flex items-center justify-between mb-2">
                    <h4 class="text-sm font-semibold text-emerald-700">
                      Scheduled Message
                    </h4>
                    <span class="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-600 capitalize">
                      {r.schedule.frequency}
                    </span>
                  </div>

                  <div class="text-xs text-slate-700 space-y-1">
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
                    <button class="px-3 py-1 text-xs rounded-full bg-emerald-600 text-white hover:bg-emerald-700 transition">
                      Edit
                    </button>
                    <button class="px-3 py-1 text-xs rounded-full bg-white ring-1 ring-emerald-400 text-emerald-600 hover:bg-emerald-100 transition">
                      Disable
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}

        {state.recent.length === 0 && (
          <div class="text-sm text-slate-400">No recent messages</div>
        )}
      </div>
    </div>
  </>
);

});
