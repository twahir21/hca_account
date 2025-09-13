import { $, component$, useSignal, useStore } from "@builder.io/qwik";
import { SendIcon } from "lucide-qwik";
import { links } from "~/const/api.const";
import { bulkLoaderProp, fileResponseTypes } from "../types/adminTypes";
import { SearchInput } from "~/components/ui/Search";
import { Form } from "@builder.io/qwik-city";
import { useBulkSMSPost } from "~/routes/plugin";

export const BulkSMS = component$<bulkLoaderProp>(({ count }) => {
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

      const fileName = useSignal<string>("");

      const handleDrop = $((event: DragEvent) => {
        event.preventDefault();
        const file = event.dataTransfer?.files[0];
        if (file && file.name.endsWith(".xlsx")) {
          fileName.value = file.name;
        }
      });

      const handleDragOver = $((event: DragEvent) => {
        event.preventDefault();
      });

      // File validation
      const fileResponse = useStore({
        isExist: false as boolean,
        success: false as boolean,
        message: "" as string,
        details: "" as string,
        validData: {
          validRows: [] as { name: string; phone: string; message: string}[],
          validLength: 0
        }
      })
      const handleFileChange = $(async (e: Event) => {
        const target = e.target as HTMLInputElement;
        const file = target.files?.[0];
        fileName.value = file ? file.name : "";
        
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch(`${links.serverLink}/file`, {
          method: "POST",
          body: formData,
        });

        const data: fileResponseTypes = await res.json();
        fileResponse.isExist = true;

        // assign validation data
        fileResponse.success = data.success;
        fileResponse.message = data.message;
        fileResponse.details = data.details;

        if (data.validData){
          fileResponse.validData.validRows = data.validData.validRows;
          fileResponse.validData.validLength = data.validData.validLength;
        }
      });

      // Server forms
      const bulkSMSForm = useBulkSMSPost();

    return <>
    <div class="flex flex-col gap-4 w-full p-4">
        {/* Stats grid  */}
        <div class="flex flex-col gap-4">
            {/* Title  */}
            <div>
                <h1 class="text-2xl font-semibold">Bulk SMS Sender</h1>
                <p class="text-sm text-gray-500">Send messages to multiple recipients at once.</p>
            </div>

            {/* Cards  */}
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
                            <p class="text-2xl font-bold text-gray-800">{count}</p>
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

        {/* Form and Recent messages  */}
        <div class="flex flex-col md:flex-row w-full gap-5">
            <div class="w-full md:w-2/3 border-2 border-sky-500 rounded-2xl">
              {/* Form  */}
                <Form action={bulkSMSForm}>
                  <div class="bg-white p-6 rounded-2xl shadow-lg ring-1 ring-slate-100">
                  <div class="flex items-start justify-between">
                      <h2 class="text-xl font-semibold text-slate-800">Compose SMS</h2>
                      <div class="text-sm text-slate-400"><span class="hidden sm:inline">Characters:</span> {currentChar.value.length}/{charLimit}</div>
                  </div>
                  <h3 class="pt-3 text-gray-400">1. Message : </h3>
                  {/* Message input  */}
                  <textarea
                      placeholder="Type your message here..."
                      onInput$={(e) => currentChar.value = (e.target as HTMLInputElement).value.slice(0, charLimit)}
                      value={currentChar.value}
                      maxLength={charLimit}
                      required
                      name="message"
                      class={`mt-4 w-full rounded-xl px-4 py-2 resize-none h-36 border-2 ${currentChar.value.length >= charLimit ? 'text-red-500 border-red-500' : 'text-black border-slate-200'} focus:outline-none focus:ring-2 focus:ring-sky-200`}
                  />
                  
                  {/* Clear Button  */}
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
                                {tab === 'upload' ? 'Upload Excel sheet' : tab}
                              </button>
                            ))}
                          </div>

                          {/* Tab Content */}
                          <div class="mt-6">
                            {activeTab.value === 'contact' && (
                              <div class="space-y-6 p-6 bg-white rounded-xl shadow border border-slate-200">
                                {/* Title */}
                                <h2 class="text-lg font-semibold text-slate-700">
                                  Enter Phone Number for Instant Sending
                                </h2>

                                {/* Phone Input */}
                                <div>
                                  <label class="block text-sm font-medium text-slate-600 mb-1">
                                    Phone Number : 
                                  </label>
                                  <input
                                    type="number"
                                    name="singlePhone"
                                    placeholder="e.g. 255700123456"
                                    class="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-200 focus:border-sky-200"
                                  />
                                </div>

                                {/* Divider */}
                                <div class="flex items-center">
                                  <div class="flex-grow border-t border-slate-300"></div>
                                  <span class="px-3 text-sm text-slate-500">Or</span>
                                  <div class="flex-grow border-t border-slate-300"></div>
                                </div>

                                {/* Search Input */}
                                <div>
                                  <label class="block text-sm font-medium text-slate-600 mb-1">
                                    Search Contacts : 
                                  </label>
                                  <SearchInput placeholder="Enter by contacts ..." />
                                </div>

                                {/* Dropdown List */}
                                <div class="max-h-64 overflow-y-auto space-y-2 pr-2 border border-slate-200 rounded-lg p-2 bg-slate-50">
                                  {/* Example items */}
                                  <div class="p-2 rounded-md bg-white shadow-sm hover:bg-sky-50 cursor-pointer">
                                    John Doe - 255700111222
                                  </div>
                                  <div class="p-2 rounded-md bg-white shadow-sm hover:bg-sky-50 cursor-pointer">
                                    Jane Smith - 255700333444
                                  </div>
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
                            <div class="space-y-3">
                              {/* Drop Zone */}
                              <div
                                class="flex flex-col items-center justify-center border-2 border-dashed border-sky-400 rounded-xl p-8 bg-sky-50 hover:bg-sky-100 transition-colors duration-200"
                                onDrop$={handleDrop}
                                onDragOver$={handleDragOver}
                              >
                                <i class="fas fa-file-excel text-green-600 text-xl mb-2"></i>
                                <p class="text-sky-700 font-semibold">Drag & Drop your Excel file here</p>
                                <p class="text-slate-500 text-sm mt-1">or click to browse</p>

                                <input
                                  type="file"
                                  accept=".xlsx"
                                  id="file-upload"
                                  class="hidden"
                                  onChange$={handleFileChange}
                                />
                                <label
                                  for="file-upload"
                                  class="mt-4 cursor-pointer bg-sky-500 text-white px-4 py-2 rounded-lg hover:bg-sky-600 transition-colors"
                                >
                                  {!fileName.value.length ? "Choose File" : "Change File"}
                                </label>
                              </div>

                              {/* Filename preview */}
                              {fileName.value && (
                                <div class="text-sm text-gray-600">Selected file: {fileName.value}</div>
                              )}

                              {/* Example download link */}
                              <a
                                href="/example.xlsx"
                                download
                                class="inline-block text-sm text-blue-600 hover:underline"
                              >
                                Download example.xlsx
                              </a>
                                {/* Modal for file validation  */}
                                {fileResponse.isExist && <div class="space-y-4">                                
                                  <div 
                                    class = {`flex items-start gap-3 
                                            rounded-lg border p-4
                                          ${
                                              fileResponse.success ?
                                              "border-green-400 bg-green-100 text-green-800":
                                              "border-red-400 bg-red-100 p-4 text-red-800"
                                          } 
                                          shadow`}>
                                    <i class={`fa-solid  
                                                text-2xl mt-1 ${fileResponse.success ? 
                                                  "fa-circle-check text-green-600" : 
                                                  "fa-circle-xmark text-red-600"}
                                              `}></i>
                                    <div>
                                      <h2 class="font-bold">{fileResponse.message}</h2>
                                      <p class="text-sm">{fileResponse.details}.</p>
                                    </div>
                                  </div>
                                </div>}
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
                    </div>
                  </div>
                  </div>

                  {/* Send button  */}
                  <button
                    class="px-5 py-2 mt-6 rounded-xl border-4 border-double border-purple-800 
                          bg-gradient-to-r from-purple-100 to-yellow-100 text-gray-600 
                          font-medium shadow-md flex gap-2 items-center justify-center
                          transition-all duration-300 ease-in-out 
                          hover:from-purple-200 hover:to-yellow-200 
                          hover:scale-105 hover:shadow-lg hover:shadow-purple-400/50 
                          hover:text-purple-800 active:scale-95
                          cursor-pointer"
                    type="submit"
                  >
                    <SendIcon /> Send SMS
                  </button>
                  </div>
                </Form>
            </div>
            <div class="w-full md:w-1/3">
              {/* recent messages column */}
              <div>
                <div class="p-5 rounded-2xl shadow ring-1 ring-slate-100 border-2 border-sky-500 bg-sky-50">
                  <div class="flex flex-col gap-3">
                    <h3 class="text-lg font-semibold">Recent Messages</h3>
                    <SearchInput placeholder="Enter by Message Title ..."/>
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