import { component$, useStore } from "@builder.io/qwik";

export const BulkSMS = component$(() => {
      const state = useStore({
        totalSmsToday: 124,
        smsBalance: 2380,
        contactsCount: 842,
    
        composer: {
          text: '',
          toType: 'contact' as 'contact' | 'group' | 'upload',
          selectedContact: null as null | { id: number; name: string; phone: string },
          selectedGroup: null as null | { id: number; name: string; count: number },
          fileName: '',
          scheduled: false,
          start: '',
          end: '',
          frequency: 'once' as 'once' | 'daily' | 'weekly' | 'monthly'
        },
    
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
    
        contacts: Array.from({ length: 12 }).map((_, i) => ({ id: i + 1, name: `Contact ${i + 1}`, phone: `+2556${700000 + i}` })),
        groups: [
          { id: 1, name: 'All Parents', count: 400 },
          { id: 2, name: 'Grade 3', count: 78 },
          { id: 3, name: 'Teachers', count: 32 }
        ]
      });
    
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
            <div class="bg-blue-300 w-full md:w-2/3">
                <div class="bg-white p-6 rounded-2xl shadow-lg ring-1 ring-slate-100">
                <div class="flex items-start justify-between">
                    <h2 class="text-xl font-semibold text-slate-800">Compose SMS</h2>
                    <div class="text-sm text-slate-400">Max {charLimit} chars</div>
                </div>

                <textarea
                    placeholder="Type your message here..."
                    class={`mt-4 w-full rounded-xl p-4 resize-none h-36 border ${state.composer.text.length >= charLimit ? 'border-red-400' : 'border-slate-200'} focus:outline-none focus:ring-2 focus:ring-sky-200`}
                />

                </div>
            </div>
            <div class="bg-red-300 w-full md:w-1/3">r</div>
        </div>

    </div>
    </>;
});