import { component$, useStore, useSignal, $ } from '@builder.io/qwik';

// Single-file Qwik page (TSX) for Bulk SMS sending.
// TailwindCSS classes assumed to be available in the project.

export default component$(() => {
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
  const composing = useSignal(false);

  const onComposeInput = $((e: any) => {
    const v = e.target.value as string;
    // enforce limit — trim if beyond
    if (v.length > charLimit) {
      state.composer.text = v.slice(0, charLimit);
    } else {
      state.composer.text = v;
    }
  });

  const pickContact = $((c: any) => {
    state.composer.selectedContact = c;
    state.composer.selectedGroup = null;
    state.composer.toType = 'contact';
  });

  const pickGroup = $((g: any) => {
    state.composer.selectedGroup = g;
    state.composer.selectedContact = null;
    state.composer.toType = 'group';
  });

  const onFileChange = $((e: any) => {
    const file = e.target.files?.[0];
    if (file) {
      state.composer.fileName = file.name;
      state.composer.toType = 'upload';
      state.composer.selectedContact = null;
      state.composer.selectedGroup = null;
    }
  });

  const toggleSchedule = $(() => {
    state.composer.scheduled = !state.composer.scheduled;
  });

  const setFrequency = $((f: any) => (state.composer.frequency = f));

  const sendSms = $(() => {
    // Basic validation
    if (!state.composer.text.trim()) {
      alert('Message is empty.');
      return;
    }

    if (state.composer.toType === 'contact' && !state.composer.selectedContact) {
      alert('Please select a contact.');
      return;
    }

    if (state.composer.toType === 'group' && !state.composer.selectedGroup) {
      alert('Please select a group.');
      return;
    }

    // Pretend to send
    const previewTo =
      state.composer.toType === 'contact'
        ? state.composer.selectedContact?.name
        : state.composer.toType === 'group'
        ? state.composer.selectedGroup?.name
        : state.composer.fileName || 'Uploaded list';

    alert(`Sending message to: ${previewTo}\nText: ${state.composer.text}\nScheduled: ${state.composer.scheduled ? 'Yes' : 'No'}`);

    // Add to recent
    state.recent.unshift({ id: Date.now(), text: state.composer.text, date: new Date().toISOString().slice(0, 10), to: String(previewTo) });

    // clear composer
    state.composer.text = '';
    state.composer.fileName = '';
    state.composer.selectedContact = null;
    state.composer.selectedGroup = null;
    state.composer.scheduled = false;
  });

  const resend = $((msg: any) => {
    state.composer.text = msg.text;
    // optionally preselect target
    state.composer.toType = 'contact';
    state.composer.selectedContact = null;
    state.composer.selectedGroup = null;
    // focus composer UI hint
    composing.value = true;
  });

  return (
    <div class="min-h-screen bg-gradient-to-br from-slate-50 via-white to-sky-50 p-6 font-sans">
      <div class="max-w-6xl mx-auto">
        {/* top stat cards */}
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div class="bg-white shadow-md rounded-2xl p-5 ring-1 ring-slate-100">
            <div class="text-sm text-slate-500">Total SMS Today</div>
            <div class="mt-2 text-3xl font-semibold text-sky-700">{state.totalSmsToday}</div>
            <div class="mt-1 text-xs text-slate-400">Updated just now</div>
          </div>

          <div class="bg-white shadow-md rounded-2xl p-5 ring-1 ring-slate-100">
            <div class="text-sm text-slate-500">SMS Balance</div>
            <div class="mt-2 text-3xl font-semibold text-indigo-700">{state.smsBalance}</div>
            <div class="mt-1 text-xs text-slate-400">You can top up at any time</div>
          </div>

          <div class="bg-white shadow-md rounded-2xl p-5 ring-1 ring-slate-100">
            <div class="text-sm text-slate-500">Contacts</div>
            <div class="mt-2 text-3xl font-semibold text-emerald-700">{state.contactsCount}</div>
            <div class="mt-1 text-xs text-slate-400">Active contacts</div>
          </div>
        </div>

        {/* main single page layout: composer + sidebar-like recent (but page is single, no topbar/sidebar) */}
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div class="lg:col-span-2">
            <div class="bg-white p-6 rounded-2xl shadow-lg ring-1 ring-slate-100">
              <div class="flex items-start justify-between">
                <h2 class="text-xl font-semibold text-slate-800">Compose SMS</h2>
                <div class="text-sm text-slate-400">Max {charLimit} chars</div>
              </div>

              <textarea
                placeholder="Type your message here..."
                value={state.composer.text}
                onInput$={onComposeInput}
                class={`mt-4 w-full rounded-xl p-4 resize-none h-36 border ${state.composer.text.length >= charLimit ? 'border-red-400' : 'border-slate-200'} focus:outline-none focus:ring-2 focus:ring-sky-200`}
              />

              <div class="flex items-center justify-between mt-3">
                <div class="text-sm text-slate-500">Characters: <span class={`${state.composer.text.length >= charLimit ? 'text-red-600 font-semibold' : 'text-slate-600'}`}>{state.composer.text.length}/{charLimit}</span></div>

                <div class="flex items-center gap-3">
                  <label class="flex items-center gap-2 text-sm text-slate-600">
                    <input type="checkbox" checked={state.composer.scheduled} onChange$={toggleSchedule} />
                    Schedule SMS
                  </label>

                  <button onClick$={() => { state.composer.text = ''; }} class="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-sm">Clear</button>
                </div>
              </div>

              {/* recipient selection */}
              <div class="mt-5 grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* Contact select */}
                <div class="col-span-1">
                  <div class="text-xs text-slate-500 mb-1">Send to</div>
                  <div class="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <div class="flex gap-2 items-center mb-2">
                      <button onClick$={() => (state.composer.toType = 'contact')} class={`text-sm px-3 py-1 rounded-full ${state.composer.toType === 'contact' ? 'bg-sky-600 text-white' : 'bg-white text-slate-600 ring-1 ring-slate-100'}`}>Contact</button>
                      <button onClick$={() => (state.composer.toType = 'group')} class={`text-sm px-3 py-1 rounded-full ${state.composer.toType === 'group' ? 'bg-sky-600 text-white' : 'bg-white text-slate-600 ring-1 ring-slate-100'}`}>Group</button>
                      <button onClick$={() => (state.composer.toType = 'upload')} class={`text-sm px-3 py-1 rounded-full ${state.composer.toType === 'upload' ? 'bg-sky-600 text-white' : 'bg-white text-slate-600 ring-1 ring-slate-100'}`}>Upload XLSX</button>
                    </div>

                    {/* dynamic panes */}
                    {state.composer.toType === 'contact' && (
                      <div>
                        <input
                          placeholder="Search contacts..."
                          value={state.ui.contactQuery}
                          onInput$={(e: any) => (state.ui.contactQuery = e.target.value)}
                          class="w-full rounded-lg p-2 text-sm border border-slate-100 bg-white"
                        />

                        <div class="max-h-36 overflow-auto mt-2">
                          {state.contacts.filter(c => c.name.toLowerCase().includes(state.ui.contactQuery.toLowerCase())).map(c => (
                            <div key={c.id} class="flex items-center justify-between p-2 hover:bg-slate-50 rounded-md cursor-pointer" onClick$={() => pickContact(c)}>
                              <div>
                                <div class="text-sm font-medium">{c.name}</div>
                                <div class="text-xs text-slate-400">{c.phone}</div>
                              </div>
                              <div class="text-xs text-slate-500">Select</div>
                            </div>
                          ))}
                        </div>

                        {state.composer.selectedContact && <div class="mt-3 text-sm text-slate-600">Selected: <span class="font-medium">{state.composer.selectedContact.name}</span></div>}
                      </div>
                    )}

                    {state.composer.toType === 'group' && (
                      <div>
                        <input placeholder="Search groups..." value={state.ui.groupQuery} onInput$={(e: any) => (state.ui.groupQuery = e.target.value)} class="w-full rounded-lg p-2 text-sm border border-slate-100 bg-white" />
                        <div class="max-h-36 overflow-auto mt-2">
                          {state.groups.filter(g => g.name.toLowerCase().includes(state.ui.groupQuery.toLowerCase())).map(g => (
                            <div key={g.id} class="flex items-center justify-between p-2 hover:bg-slate-50 rounded-md cursor-pointer" onClick$={() => pickGroup(g)}>
                              <div>
                                <div class="text-sm font-medium">{g.name}</div>
                                <div class="text-xs text-slate-400">{g.count} contacts</div>
                              </div>
                              <div class="text-xs text-slate-500">Select</div>
                            </div>
                          ))}
                        </div>

                        {state.composer.selectedGroup && <div class="mt-3 text-sm text-slate-600">Selected: <span class="font-medium">{state.composer.selectedGroup.name}</span></div>}
                      </div>
                    )}

                    {state.composer.toType === 'upload' && (
                      <div>
                        <label class="block text-sm text-slate-500 mb-1">Upload .xlsx</label>
                        <input type="file" accept=".xlsx,.xls" onChange$={onFileChange} class="text-sm" />
                        {state.composer.fileName && <div class="mt-2 text-sm text-slate-600">Uploaded: <span class="font-medium">{state.composer.fileName}</span></div>}
                        <div class="mt-2 text-xs text-slate-400">Download template: <a class="underline">contacts-template.xlsx</a></div>
                      </div>
                    )}
                  </div>
                </div>

                {/* scheduling panel */}
                <div class="col-span-2 md:col-span-2">
                  {state.composer.scheduled ? (
                    <div class="bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label class="text-xs text-slate-500">Start</label>
                          <input type="datetime-local" value={state.composer.start} onInput$={(e: any) => (state.composer.start = e.target.value)} class="w-full rounded-lg p-2 mt-1 border border-slate-100" />
                        </div>
                        <div>
                          <label class="text-xs text-slate-500">End (optional)</label>
                          <input type="datetime-local" value={state.composer.end} onInput$={(e: any) => (state.composer.end = e.target.value)} class="w-full rounded-lg p-2 mt-1 border border-slate-100" />
                        </div>
                      </div>

                      <div class="mt-3">
                        <div class="text-xs text-slate-500 mb-2">Frequency</div>
                        <div class="flex gap-2">
                          {(['once','daily','weekly','monthly'] as const).map(f => (
                            <button key={f} onClick$={() => setFrequency(f)} class={`px-3 py-1 rounded-full text-sm ${state.composer.frequency === f ? 'bg-amber-500 text-white' : 'bg-white ring-1 ring-slate-100 text-slate-600'}`}>{f.charAt(0).toUpperCase() + f.slice(1)}</button>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div class="text-sm text-slate-500 p-3">Schedule disabled — message will be sent immediately.</div>
                  )}

                  <div class="mt-4 flex items-center gap-3">
                    <button onClick$={sendSms} class="px-5 py-2 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 text-white font-medium shadow-md">Send SMS</button>
                    <button onClick$={() => { alert('Preview:\n' + state.composer.text); }} class="px-4 py-2 rounded-xl bg-white ring-1 ring-slate-200 text-slate-700">Preview</button>
                  </div>
                </div>
              </div>
            </div>

            {/* helpful tips / logs */}
            <div class="mt-4 p-4 rounded-2xl text-sm bg-white ring-1 ring-slate-100">
              <div class="font-medium text-slate-800">Delivery Tips</div>
              <ul class="mt-2 text-slate-500 list-disc list-inside">
                <li>Keep messages under 160 characters for 1 SMS segment.</li>
                <li>Use scheduling for non-urgent bulk sends.</li>
                <li>Upload contacts with phone numbers in international format.</li>
              </ul>
            </div>
          </div>

          {/* recent messages column */}
          <div>
            <div class="bg-white p-5 rounded-2xl shadow ring-1 ring-slate-100">
              <div class="flex items-center justify-between">
                <h3 class="text-lg font-semibold">Recent Messages</h3>
                <input placeholder="Search" value={state.ui.recentQuery} onInput$={(e:any)=> state.ui.recentQuery = e.target.value} class="text-sm rounded-lg p-2 border border-slate-100" />
              </div>

              <div class="mt-3 space-y-3 max-h-96 overflow-auto">
                {state.recent.filter(r => r.text.toLowerCase().includes(state.ui.recentQuery.toLowerCase()) || r.to.toLowerCase().includes(state.ui.recentQuery.toLowerCase())).map(r => (
                  <div key={r.id} class="p-3 rounded-lg bg-slate-50 flex items-start justify-between">
                    <div>
                      <div class="text-sm font-medium text-slate-800">{r.text}</div>
                      <div class="text-xs text-slate-400">To: {r.to} • {r.date}</div>
                    </div>
                    <div class="flex flex-col gap-2">
                      <button onClick$={() => resend(r)} class="px-3 py-1 text-xs rounded-full bg-white ring-1 ring-slate-200">Resend</button>
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
  );
});
