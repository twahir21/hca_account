import { $, component$, useSignal, useStore, useTask$ } from "@builder.io/qwik";
import { links } from "~/const/api.const";
import { fetchContacts, getGroupsResult, recentSMS, smsAnalytics, validRows } from "../../types/TeacherTypes";
import { MsgCards } from "./msgCard";
import { RecentMsg } from "./recentMsg";
import { Toast } from "~/components/ui/Toast";
import { buildPayload, SmsPayload } from "./sendPayload";
import { MsgContact } from "./msgContact";
import { SMSSchedule } from "./msgSchedule";
import { MsgGrp } from "./msgGrp";
import { MsgFile } from "./msgFile";

type bulkSMSProps = {
  count: { success: boolean; message: string; count?: number; },
  contactsFetch: { success: boolean; message: string; data?: fetchContacts},
  getGroups: {
    success: boolean;
    message: string;
    data?: getGroupsResult;
    totalGroups?: number;
  },
  smsAnalytics: smsAnalytics;
  recentSMS: recentSMS;
}

export const BulkSMS = component$<bulkSMSProps>(({ count, contactsFetch, getGroups, smsAnalytics, recentSMS }) => {

  // 1. Generate Server forms

  // 2. char handling and store
  const currentChar = useSignal("");
  const singlePhone= useSignal("");
  const charLimit = 160;

  // 3. Tabs
  const activeTab = useSignal<'contact' | 'group' | 'upload'>('contact');

  // 4. Schedule timetable
      
  // 5. File handling in upload tab
  const fileName = useSignal<string>("");

  const fileResponse = useStore({
    isExist: false as boolean,
    success: false as boolean,
    message: "" as string,
    details: "" as string,
    validData: {
      validRows: [] as validRows,
      validLength: 0
    }
  });

  // 7. Toast States
  const isToastOpen = useSignal(false);
  const toastType = useSignal<'success' | 'error'>('success');
  const toastMessage = useSignal('');

  const showToast = $(({ toastTypeParam, toastMsg } : { toastTypeParam: "success" | "error"; toastMsg: string;}) => {
    toastType.value = toastTypeParam;
    toastMessage.value = toastMsg;
    isToastOpen.value = true;
  });
  
  // 8. Contacts tab
  const contactSelection = useStore({
    selectAll: false,
    selected: {} as Record<string, boolean>,
  });


  // 9. Group states
  const selectedGroup = useSignal<{ groupName: string; totalContacts: number; groupId: string; contacts: { contactName: string; contactPhone: string; }[];  } | null>(null);

  // 10. Prepare sendSMS payload
  const preparedPayload = useSignal<SmsPayload | null>(null);
  // 10.1 Tracking changes in payload inputs
  useTask$(({ track }) => {

    // track all inputs
    track(() => activeTab.value);   
    track(() => singlePhone.value);
    track(() => currentChar.value);
    track(() => contactSelection);
    track(() => fileResponse.validData.validRows)
    track(() => selectedGroup.value);

      preparedPayload.value = buildPayload(activeTab.value, {
        selectedGroup: selectedGroup.value,
        singlePhone: Number(singlePhone.value) || 0,
        uploadFile: fileResponse.validData.validRows,
        message: currentChar.value,
        contactSelection
      });

      if(activeTab.value === "upload" && preparedPayload.value.type === "upload" && preparedPayload.value.file === null){
            console.error("File required for upload");
            return
      }

  });

  // 10.2 function to send sms payload
  const isSendSMSRun = useSignal(false);

  const sendSms = $(async () => {
    if (!preparedPayload.value) return;

    isSendSMSRun.value = true;


    const value: { success: boolean; message: string; } = await fetch(`${links.serverLink}/sms/sendSMS`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(preparedPayload.value),
    }).then((res) => res.json());


    isSendSMSRun.value = false;

    showToast({ toastTypeParam: value.success ? 'success' : 'error', toastMsg: value.message ?? "Something went wrong!"});
  });

    return <>
    <div class="flex flex-col gap-4 w-full p-4">
        {/* Stats grid  */}
        <MsgCards count={count.count ?? 0} smsAnalytics={smsAnalytics}/>

        {/* Form and Recent messages  */}
        <div class="flex flex-col md:flex-row w-full gap-5">
            <div class="w-full md:w-2/3 border-2 border-sky-500 rounded-2xl">
              {/* Form  */}
                  <div class="bg-white p-6 rounded-2xl shadow-lg ring-1 ring-slate-100">
                  <div class="flex items-start justify-between">
                      <h2 class="text-xl font-semibold text-slate-800">Compose SMS</h2>
                      <div class="text-sm text-slate-400"><span class="hidden sm:inline">Characters:</span> {currentChar.value.length}/{charLimit}</div>
                  </div>
                  
                  <h3 class="pt-3 text-gray-400">1. Message : </h3>
                  {/* Message input  */}
                  <textarea
                      autocomplete="on"
                      autoFocus={true}
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

                          {/* Tab Contents */}
                          <div class="mt-6">
                            {activeTab.value === 'contact' && (
                              <MsgContact 
                                contactsFetch={contactsFetch} 
                                singlePhone={singlePhone} 
                                contactSelection={contactSelection} 
                              />
                            )}
 
                            {activeTab.value === 'group' && (
                              <MsgGrp
                                getGroups={getGroups}
                                contactsFetch={contactsFetch}
                                selectedGroup={selectedGroup}
                              />
                            )}
         

                            {activeTab.value === 'upload' && (
                              <MsgFile 
                                fileName={fileName}
                                fileResponse={fileResponse}
                              />
                            )}
                          </div>
                      </div>
                  </div>

                  {/* Schedule */}
                  <SMSSchedule />

                  {/* Send button  */}
                  <button
                    class={`px-5 py-2 mt-6 rounded-xl border-4 border-double border-purple-800 
                          bg-gradient-to-r from-purple-100 to-yellow-100 text-gray-600 
                          font-medium shadow-md flex gap-2 items-center justify-center
                          transition-all duration-300 ease-in-out 
                          hover:from-purple-200 hover:to-yellow-200 
                          hover:scale-105 hover:shadow-lg hover:shadow-purple-400/50 
                          hover:text-purple-800 active:scale-95
                          cursor-pointer ${preparedPayload.value ? 'opacity-100' : 'opacity-50 pointer-events-none cursor-wait'}`}
                    type="button"
                    disabled={!preparedPayload.value || preparedPayload.value === null}
                    onClick$={sendSms}
                  >
                    
              {isSendSMSRun.value ? (
                <>
                  <span class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Loading...
                </>
              ) : (
                <>
                  <i class="fas fa-paper-plane"></i> Send SMS
                </>
              )}
                  </button>
                  </div>
            </div>
            <div class="w-full md:w-1/3">
              <div class="flex flex-col gap-10">
              {/* recent messages column */}
              <RecentMsg recentSMS={recentSMS} message={currentChar}/>
              </div>                      
            </div>
        </div>

    </div>

    {/* Toast  */}
    { isToastOpen.value  &&  (
      
      <Toast
        message={toastMessage.value}
        isOpen={isToastOpen.value}
        duration={3000}
        type={toastType.value}
        onClose$={() => (isToastOpen.value = false)}
      />
    )}

    </>;
});