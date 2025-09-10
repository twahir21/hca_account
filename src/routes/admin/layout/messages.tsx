import { $, component$, useSignal, useStore } from "@builder.io/qwik";
import { SendIcon } from "lucide-qwik";
import { SearchIcon } from "lucide-qwik";

export const BulkSMS = component$(() => {
      const currentChar = useSignal("");
      const activeTab = useSignal<'contact' | 'group' | 'upload'>('contact');

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
      
    
      const charLimit = 160;
    return <>
    <div class="flex flex-col gap-4 w-full p-4">
        {/* Top  */}
        <div class="flex flex-col gap-4">
            {/* Title  */}
            <div>
                <h1 class="text-2xl font-semibold">Bulk SMS Sender</h1>
                <p class="text-sm text-gray-500">Send messages to multiple recipients at once.</p>
            </div>

            {/* Stats grid  */}
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div class="bg-white rounded-xl shadow p-6">
                    <div class="flex items-center">
                        <div class="p-3 rounded-lg bg-blue-100">
                            <i class="fas fa-sms text-blue-600 text-xl"></i>
                        </div>
                        <div class="ml-4">
                            <h2 class="text-gray-500 text-sm">SMS Sent Today</h2>
                            <p class="text-2xl font-bold text-gray-800">1,243</p>
                        </div>
                    </div>
                </div>

                <div class="bg-white rounded-xl shadow p-6">
                    <div class="flex items-center">
                        <div class="p-3 rounded-lg bg-orange-100">
                            <i class="fas fa-user-group text-orange-600 text-xl"></i>
                        </div>
                        <div class="ml-4">
                            <h2 class="text-gray-500 text-sm">Total Groups</h2>
                            <p class="text-2xl font-bold text-gray-800">12</p>
                        </div>
                    </div>
                </div>
            
                <div class="bg-white rounded-xl shadow p-6">
                    <div class="flex items-center">
                        <div class="p-3 rounded-lg bg-green-100">
                            <i class="fas fa-wallet text-green-600 text-xl"></i>
                        </div>
                        <div class="ml-4">
                            <h2 class="text-gray-500 text-sm">SMS Balance</h2>
                            <p class="text-2xl font-bold text-gray-800">5,728</p>
                        </div>
                    </div>
                </div>
            
                <div class="bg-white rounded-xl shadow p-6">
                    <div class="flex items-center">
                        <div class="p-3 rounded-lg bg-purple-100">
                            <i class="fas fa-address-book text-purple-600 text-xl"></i>
                        </div>
                        <div class="ml-4">
                            <h2 class="text-gray-500 text-sm">Total Contacts</h2>
                            <p class="text-2xl font-bold text-gray-800">2,415</p>
                        </div>
                    </div>
                </div>
            </div>

        </div>

        {/* Bottom  */}
        <div class="flex flex-col md:flex-row w-full gap-5">
            {/* RHS  */}
            <div class="w-full md:w-2/3 border-2 border-sky-500 rounded-2xl">
                <div class="bg-white p-6 rounded-2xl shadow-lg ring-1 ring-slate-100">
                <div class="flex items-start justify-between">
                    <h2 class="text-xl font-semibold text-slate-800">Compose SMS</h2>
                    <div class="text-sm text-slate-400"><span class="hidden sm:inline">Characters:</span> {currentChar.value.length}/{charLimit}</div>
                </div>
                    <h3 class="pt-3 text-gray-400">1. Message : </h3>
                <textarea
                    placeholder="Type your message here..."
                    onInput$={(e) => currentChar.value = (e.target as HTMLInputElement).value.slice(0, charLimit)}
                    value={currentChar.value}
                    maxLength={charLimit}
                    required
                    class={`mt-4 w-full rounded-xl px-4 py-2 resize-none h-36 border-2 ${currentChar.value.length >= charLimit ? 'text-red-500 border-red-500' : 'text-black border-slate-200'} focus:outline-none focus:ring-2 focus:ring-sky-200`}
                />

                <div class="flex justify-end p-3">
                    <button 
                        class="bg-purple-100 px-3 py-1 border-2 border-purple-600 rounded-xl text-gray-600"
                        onClick$={() => currentChar.value = ""}
                    >Clear</button>
                </div>

                {/* Send to: */}
                <div>
                    <h3 class="pt-3 text-gray-400">2. Send to :</h3>
                    <div class="w-full max-w-3xl mx-auto">
                        {/* Tabs */}
                        <div class="flex flex-col sm:flex-row gap-2 sm:gap-4 pt-3">
                          {['contact', 'group', 'upload'].map((tab) => (
                            <button
                              key={tab}
                              class={`px-3 py-2 border-b-2 capitalize transition-colors duration-200
                                ${activeTab.value === tab
                                  ? 'border-sky-500 text-sky-700 font-semibold'
                                  : 'border-transparent text-slate-600 hover:text-sky-500'}`}
                              onClick$={() => (activeTab.value = tab as any)}
                            >
                              {tab === 'upload' ? 'Upload XLSX' : tab}
                            </button>
                          ))}
                        </div>

                        {/* Tab Content */}
                        <div class="mt-6">
                          {activeTab.value === 'contact' && (
                            <div class="space-y-4">
                              {/* Search */}
                              <input
                                type="text"
                                placeholder="Search contact..."
                                class="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400"
                              />
                              {/* Dropdowns */}
                              <div class="max-h-64 overflow-y-auto space-y-2 pr-2">
                                {[...Array(6)].map((_, i) => (
                                  <select
                                    key={i}
                                    class="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400"
                                  >
                                    <option value="">Dropdown 3</option>
                                    <option value="a">Option A</option>
                                    <option value="b">Option B</option>
                                  </select>
                                ))}
                              </div>
                            </div>
                          )}

                          {activeTab.value === 'group' && (
                            <div class="space-y-4">
                              {/* Search */}
                              <input
                                type="text"
                                placeholder="Search group..."
                                class="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400"
                              />
                              {/* Dropdowns */}
                              <div class="max-h-64 overflow-y-auto space-y-2 pr-2">
                                {[...Array(6)].map((_, i) => (
                                  <select
                                    key={i}
                                    class="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400"
                                  >
                                    <option value="">Dropdown 4 </option>
                                    <option value="a">Option A</option>
                                    <option value="b">Option B</option>
                                  </select>
                                ))}
                              </div>
                            </div>
                          )}

                          {activeTab.value === 'upload' && (
                            <div class="flex flex-col items-center justify-center border-2 border-dashed border-sky-400 rounded-xl p-8 bg-sky-50 hover:bg-sky-100 transition-colors duration-200">
                              <i class="fas fa-file-excel text-green-600 text-xl mb-2"></i>
                              <p class="text-sky-700 font-semibold">Drag & Drop your XLSX file here</p>
                              <p class="text-slate-500 text-sm mt-1">or click to browse</p>
                              <input type="file" accept=".xlsx" class="hidden" id="file-upload" />
                              <label
                                for="file-upload"
                                class="mt-4 cursor-pointer bg-sky-500 text-white px-4 py-2 rounded-lg hover:bg-sky-600 transition-colors"
                              >
                                Choose File
                              </label>
                            </div>
                          )}
                        </div>
                    </div>
                </div>

                {/* Schedule */}
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
                    <button
                      class="px-5 py-2 mt-6 rounded-xl border-4 border-double border-purple-800 
                            bg-gradient-to-r from-purple-100 to-yellow-100 text-gray-600 
                            font-medium shadow-md flex gap-2 items-center justify-center
                            transition-all duration-300 ease-in-out 
                            hover:from-purple-200 hover:to-yellow-200 
                            hover:scale-105 hover:shadow-lg hover:shadow-purple-400/50 
                            hover:text-purple-800 active:scale-95
                            cursor-pointer"
                    >
                      <SendIcon /> Send SMS
                    </button>

                  </div>
                </div>
                </div>
                </div>
            </div>
            <div class="w-full md:w-1/3">
              {/* recent messages column */}
              <div>
                <div class="p-5 rounded-2xl shadow ring-1 ring-slate-100 border-2 border-sky-500 bg-sky-50">
                  <div class="flex flex-col gap-3">
                    <h3 class="text-lg font-semibold">Recent Messages</h3>
                    <div class="flex items-center gap-2 rounded-lg border border-slate-400 px-3 py-2 
                                  bg-white
                                focus-within:border-sky-500 focus-within:ring-2 focus-within:ring-sky-300
                                transition-all duration-200">
                      <SearchIcon class="w-5 h-5 text-slate-500" />
                      <input 
                        type="text"
                        placeholder="Search by message title ..." 
                        class="w-full bg-transparent text-sm outline-none placeholder-slate-400"
                      />
                    </div>

                  </div>

                  <div class="mt-3 space-y-3 max-h-96 overflow-auto">
                    {state.recent.filter(r => r.text.toLowerCase().includes(state.ui.recentQuery.toLowerCase()) || r.to.toLowerCase().includes(state.ui.recentQuery.toLowerCase())).map(r => (
                      <div key={r.id} class="p-3 rounded-lg bg-white flex items-start justify-between border border-gray-500">
                        <div>
                          <div class="text-sm font-medium text-slate-800">{r.text}</div>
                          <div class="text-xs text-slate-400">To: {r.to} • {r.date}</div>
                        </div>
                        <div class="flex flex-col gap-2">
                          <button  class="px-3 py-1 text-xs rounded-full bg-white ring-1 ring-sky-500">Refetch</button>
                        </div>
                      </div>
                    ))}

                    {state.recent.length === 0 && <div class="text-center text-sm text-slate-400">No recent messages</div>}
                  </div>
                </div>
              </div>
            </div>
        </div>

    </div>
    </>;
});