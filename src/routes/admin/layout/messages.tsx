import { component$, useSignal } from "@builder.io/qwik";

export const BulkSMS = component$(() => {
      const currentChar = useSignal("");
      const activeTab = useSignal<'contact' | 'group' | 'upload'>('contact');
    
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
        <div class="flex flex-col md:flex-row w-full">
            <div class="w-full md:w-2/3 border-2 border-gray-200 rounded-2xl">
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
                </div>
            </div>
            <div class="bg-red-300 w-full md:w-1/3">r</div>
        </div>

    </div>
    </>;
});