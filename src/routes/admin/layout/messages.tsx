import { $, component$, useSignal, useStore } from "@builder.io/qwik";
import { links } from "~/const/api.const";
import { bulkLoaderProp, fileResponseTypes } from "../types/adminTypes";
import { SearchInput } from "~/components/ui/Search";
import { Form } from "@builder.io/qwik-city";
import { useContactPost } from "~/routes/plugin";
import { Pagination } from "~/components/ui/pagination";

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

      
        const showContactModal = useSignal(false);
        const showGroupModal = useSignal(false);
      
        // Dummy contacts
        const contacts = [
          { id: 1, name: "Alice Johnson", phone: "123-456-7890", role: "parent" },
          { id: 2, name: "Bob Smith", phone: "987-654-3210", role: "admin" },
          { id: 3, name: "Charlie Brown", phone: "555-123-4567", role: "teacher" },
        ];

        const contactSelection = useStore({
          selectAll: false,
          selected: {} as Record<number, boolean>,
        });

        // Role → color mapping
        const roleColors: Record<string, { bg: string; text: string }> = {
          parent: { bg: "bg-blue-100", text: "text-blue-500" },
          admin: { bg: "bg-red-100", text: "text-red-500" },
          teacher: { bg: "bg-green-100", text: "text-green-500" },
        };

      
        // Form states
        const groupForm = useStore({ name: "", search: "", selected: [] as number[] });
      
      
        const handleGroupSubmit = $(() => {
          console.log("New group:", {
            name: groupForm.name,
            members: contacts.filter((c) => groupForm.selected.includes(c.id)),
          });
          showGroupModal.value = false;
        });


      

      // Server forms
      // const bulkSMSForm = useBulkSMSPost();
      const contactForm = useContactPost();

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
                {/* <Form action={bulkSMSForm}> */}
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

                                {/* Import and Add contact buttons */}
                                <div>
                                  <label class="block text-sm font-medium text-slate-600 mb-1">
                                    Contacts : 
                                  </label>
                                  <div class="flex justify-end gap-5 mb-5">
                                    <button 
                                      class="border border-yellow-500 bg-yellow-50 px-4 rounded-xl cursor-pointer"
                                       >
                                        <i class="fas fa-download"></i> Import
                                    </button>
                                    <button class="border border-purple-500 bg-purple-50 px-4 py-2 rounded-xl cursor-pointer"
                                     onClick$={() => (showContactModal.value = true)}>
                                      <i class="fas fa-add"></i> Add Contact
                                    </button>
                                  </div>
                                  {/* Search Input */}
                                  <SearchInput placeholder="Enter by contacts ..." />
                                </div>

                                {/* Contact fields lists */}
                                <div class="overflow-x-auto border rounded-lg">
                                  <table class="w-full text-sm">
                                    <thead>
                                      <tr class="text-left text-gray-600 border-b bg-gray-50">
                                        <th class="py-3 px-4 font-medium">
                                          <input
                                            type="checkbox"
                                            class="mr-3 w-4 h-4"
                                            checked={contactSelection.selectAll}
                                            onChange$={(e) => {
                                              const checked = (e.target as HTMLInputElement).checked;
                                              contactSelection.selectAll = checked;
                                              contacts.forEach((c) => (contactSelection.selected[c.id] = checked));
                                            }}
                                          />
                                          Name
                                        </th>
                                        <th class="py-3 px-4 font-medium">Phone Number</th>
                                        <th class="py-3 px-4 font-medium text-right">Actions</th>
                                      </tr>
                                    </thead>
                                    <tbody class="divide-y divide-gray-200">
                                      {contacts.map((i) => {
                                        const roleColor = roleColors[i.role] || roleColors.parent;
                                        return (
                                          <tr key={i.id} class="hover:bg-gray-50 transition">
                                            <td class="py-4 px-4">
                                              <div class="flex items-center">
                                                <input
                                                  type="checkbox"
                                                  class="mr-3 w-4 h-4"
                                                  checked={contactSelection.selected[i.id] || false}
                                                  onChange$={(e) => {
                                                    const checked = (e.target as HTMLInputElement).checked;
                                                    contactSelection.selected[i.id] = checked;
                                                    // If any row is unchecked, uncheck selectAll
                                                    if (!checked) contactSelection.selectAll = false;
                                                    // If all are checked, set selectAll
                                                    else if (
                                                      contacts.every((c) => contactSelection.selected[c.id])
                                                    ) {
                                                      contactSelection.selectAll = true;
                                                    }
                                                  }}
                                                />
                                                <div
                                                  class={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${roleColor.bg}`}
                                                >
                                                  <i class={`fas fa-user ${roleColor.text}`} />
                                                </div>
                                                <div>
                                                  <p class="font-semibold">{i.name}</p>
                                                  <p class="text-gray-500 text-xs capitalize">{i.role}</p>
                                                </div>
                                              </div>
                                            </td>
                                            <td class="py-4 px-4">
                                              <div class="flex items-center text-gray-700">
                                                <i class="fas fa-phone text-gray-400 mr-2" />
                                                {i.phone}
                                              </div>
                                            </td>
                                            <td class="py-4 px-4 text-right">
                                              <div class="flex justify-end gap-2">
                                                <button class="w-8 h-8 flex items-center justify-center text-green-500 hover:bg-green-100 rounded-full">
                                                  <i class="fas fa-pen"></i>
                                                </button>
                                                <button class="w-8 h-8 flex items-center justify-center text-red-500 hover:bg-red-100 rounded-full">
                                                  <i class="fas fa-trash"></i>
                                                </button>
                                              </div>
                                            </td>
                                          </tr>
                                        );
                                      })}
                                    </tbody>
                                  </table>
                                </div>
                                {/* Pagination  */}
                                <Pagination />
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
                    <i class="fas fa-paper-plane"></i> Send SMS
                  </button>
                  </div>
                {/* </Form> */}
            </div>
            <div class="w-full md:w-1/3">
              <div class="flex flex-col gap-10">
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

    </div>

    {/* MODALS  */}
    {/* Contact Modal */}
    {showContactModal.value && (
      <div class="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
        <div class="bg-white rounded-xl shadow-lg p-6 w-96 relative">
          {/* Header */}
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-lg font-semibold">Add Contact</h2>
            <i
              class="fas fa-times-circle text-gray-500 cursor-pointer hover:text-gray-700 transition"
              onClick$={() => (showContactModal.value = false)}
            ></i>
          </div>
          <Form action={contactForm}>
          {/* Name Field */}
          <label class="text-gray-500 text-sm mb-1 block">Name : </label>
          <div class="relative mb-3">
            <i class="fas fa-user absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
            <input
              class="w-full border rounded px-10 py-2 focus:ring-2 focus:ring-purple-400 focus:outline-none"
              placeholder="e.g. Salim Juma"
              name="name"
            />
          </div>

          {/* Phone Field */}
          <label class="text-gray-500 text-sm mb-1 block">Phone : </label>
          <div class="relative mb-3">
            <i class="fas fa-phone absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
            <input
              class="w-full border rounded px-10 py-2 focus:ring-2 focus:ring-purple-400 focus:outline-none"
              placeholder="e.g. 2556123456789"
              name="phone"
            />
          </div>

          {/* Actions */}
          <div class="flex justify-end gap-3 mt-4">
            <button
              class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition"
              onClick$={() => (showContactModal.value = false)}
            >
              Cancel
            </button>
            <button
              class="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition cursor-pointer"
              type="submit"
            >
              Submit
            </button>
          </div>
          </Form>
        </div>
      </div>
    )}


    {/* Group Modal */}
    {showGroupModal.value && (
      <div class="fixed inset-0 flex items-center justify-center bg-black/50">
        <div class="bg-white rounded-xl shadow-lg p-6 w-[28rem]">
          <h2 class="text-lg font-semibold mb-4">Add Group</h2>
          <input
            class="w-full border rounded px-3 py-2 mb-3"
            placeholder="Group Name"
            name="name"
          />

          {/* Search bar */}
          <input
            class="w-full border rounded px-3 py-2 mb-3"
            placeholder="Search Contacts"
            name="search"
          />

          {/* Contact list */}
          <div class="max-h-40 overflow-y-auto border rounded p-2 mb-3">
            {contacts
              .filter((c) =>
                c.name.toLowerCase().includes(groupForm.search.toLowerCase())
              )
              .map((c) => (
                <label
                  key={c.id}
                  class="flex items-center gap-2 px-2 py-1 hover:bg-gray-100 rounded cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={groupForm.selected.includes(c.id)}
                    onChange$={() => {
                      if (groupForm.selected.includes(c.id)) {
                        groupForm.selected = groupForm.selected.filter(
                          (id) => id !== c.id
                        );
                      } else {
                        groupForm.selected = [...groupForm.selected, c.id];
                      }
                    }}
                  />
                  {c.name} ({c.phone})
                </label>
              ))}
          </div>

          <div class="flex justify-end gap-3">
            <button
              class="px-4 py-2 bg-gray-200 rounded"
              onClick$={() => (showGroupModal.value = false)}
            >
              Cancel
            </button>
            <button
              class="px-4 py-2 bg-green-600 text-white rounded"
              onClick$={handleGroupSubmit}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    )}
    </>;
});