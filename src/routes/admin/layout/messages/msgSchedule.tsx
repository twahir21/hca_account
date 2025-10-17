import { $, component$, useStore } from "@builder.io/qwik";

export const SMSSchedule = component$(() => {
      const state = useStore({
        isSchedule: false as boolean,
        scheduleStart: "" as string,
        scheduleEnd: "" as string,
        frequency: "once" as 'once' |'daily'|'weekly'|'monthly',
        ui: {
          contactQuery: '',
          groupQuery: '',
          recentQuery: ''
        },
    
        recent: [
          { id: 1, text: 'School closed on Monday - holiday reminder', date: '2025-09-01', to: 'All Parents' },
          { id: 2, text: 'Fee reminder: pay before 10th', date: '2025-09-05', to: 'Grade 3' },
          { id: 3, text: 'Welcome to new term!', date: '2025-08-20', to: 'All Contacts' }
        ],
      });
      const setFrequency = $((f: 'once' |'daily'|'weekly'|'monthly') => (state.frequency = f));
    
    return <>
        <div>
        <h3 class="pt-8 py-3 text-gray-400">3. Schedule : </h3>
        <div>
        <label class="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={state.isSchedule} onChange$={() => state.isSchedule = !state.isSchedule} />
            Schedule SMS
        </label>

        {/* scheduling panel */}
        <div class="col-span-2 md:col-span-2 mt-3">
            {state.isSchedule ? (
            <div class="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                    <label class="text-xs text-slate-500">Start</label>
                    <input type="datetime-local" value={state.scheduleStart} onInput$={(e: any) => (state.scheduleStart = e.target.value)} class="w-full rounded-lg p-2 mt-1 border border-slate-600" />
                </div>
                <div>
                    <label class="text-xs text-slate-500">End (optional)</label>
                    <input type="datetime-local" value={state.scheduleEnd} onInput$={(e: any) => (state.scheduleEnd = e.target.value)} class="w-full rounded-lg p-2 mt-1 border border-slate-600" />
                </div>
                </div>

                <div class="mt-3">
                <div class="text-xs text-slate-500 mb-2">Frequency</div>
                <div class="flex gap-2">
                    {(['once','daily','weekly','monthly'] as const).map(f => (
                    <button key={f} onClick$={() => setFrequency(f)} class={`px-3 py-1 rounded-full text-sm ${state.frequency === f ? 'bg-amber-500 text-white' : 'bg-white ring-1 ring-slate-100 text-slate-600'}`}>{f.charAt(0).toUpperCase() + f.slice(1)}</button>
                    ))}
                </div>
                </div>
            </div>
            ) : (
            <div class="text-sm text-slate-500">Schedule disabled — message will be sent immediately.</div>
            )}
        </div>
        </div>
        </div>
    </>
})