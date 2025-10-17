import { $, component$, Signal, useSignal, useStore, useTask$ } from "@builder.io/qwik";
import { Pagination } from "~/components/ui/pagination";
import { SearchInput } from "~/components/ui/Search";
import { fetchContacts, fileResponseTypes, validRows } from "../../types/adminTypes";
import { useBulkContactFile, useContactDel, useContactEdit, useContactPost } from "~/routes/plugin";
import { links } from "~/const/api.const";
import { Form } from "@builder.io/qwik-city";
import { Toast } from "~/components/ui/Toast";

type contactProp = {
    contactsFetch: {
        success: boolean;
        message: string;
        data?: fetchContacts | undefined;
    },
    singlePhone: Signal<string>,
    fileName: Signal<string>,
    contactSelection: {
        selectAll: boolean;
        selected: Record<string, boolean>;
    }
}

export const MsgContact = component$<contactProp>(({ contactsFetch, singlePhone, fileName, contactSelection }) => {
    // 1. toast consts
    const isToastOpen = useSignal(false);
    const toastType = useSignal<'success' | 'error'>('success');
    const toastMessage = useSignal('');

    const showToast = $(({ toastTypeParam, toastMsg } : { toastTypeParam: "success" | "error"; toastMsg: string;}) => {
    toastType.value = toastTypeParam;
    toastMessage.value = toastMsg;
    isToastOpen.value = true;
    });

    const showContactModal = useSignal(false);
    const editContactModal = useSignal(false);
    const deleteContactModal = useSignal(false);


    // server form
    const contactForm = useContactPost();
    const bulkContactFileForm = useBulkContactFile();
    const contactEditForm = useContactEdit();
    const contactDelForm = useContactDel();
    
    
    
    // 8.1 track form changes to fire a toast
    useTask$(({ track }) => {
        const form = track(() => contactForm.value); // track contactForm
        if (form) {
            showToast({ toastTypeParam: contactForm.value?.success ? 'success' : 'error', toastMsg: contactForm.value?.message ?? "Something went wrong!"}); // show toast automatically on change
        }
    });
    
      // 8.3 file handling in massive contact tab saving
      // 8.3.1 file response state
      const contactFileRes = useStore({
        isExist: false as boolean,
        success: false as boolean,
        message: "" as string,
        details: "" as string,
        validData: {
          validRows: [] as validRows,
          validLength: 0
        }
      });
      // 8.3.2 file name in contact
      const contactFileName = useSignal<string>("");
        // 8.3.3 send bulk contacts after file
      const sendBulkContacts = $(async () => {
        const payload = contactFileRes.success ? contactFileRes.validData.validRows : [];
    
    
        if (payload.length === 0) return; // do nothing
        const data = await bulkContactFileForm.submit({ payload }) // for auto trigger fetching
    
        showToast({ toastTypeParam: data.value.success ? 'success' : 'error', toastMsg: data.value.message ?? "Something went wrong!"});
      });
      // 8.3.4 file change in contact
      const contactsFileChange = $(async (e: Event) => {
        const target = e.target as HTMLInputElement;
        const file = target.files?.[0];
        
        contactFileName.value = file ? file.name : "";
        
        if (!file) return;
    
        const formData = new FormData();
        formData.append("file", file);
    
        const res = await fetch(`${links.serverLink}/sms/send-via-excel`, {
          method: "POST",
          body: formData,
        });
    
        const data: fileResponseTypes = await res.json();
        contactFileRes.isExist = true;
    
        // assign validation data
        contactFileRes.success = data.success;
        contactFileRes.message = data.message;
        contactFileRes.details = data.details;
    
        if (data.validData){
          contactFileRes.validData.validRows = data.validData.validRows;
          contactFileRes.validData.validLength = data.validData.validLength;
        }
        // show toast
        showToast({ toastTypeParam: contactFileRes.success ? 'success' : 'error', toastMsg: contactFileRes.details ?? "Something went wrong!"});
        // call send bulk contacts
        await sendBulkContacts();
      });
    
      // 8.2 Edit form in contact
      const selectedContact = useSignal <{ id: string; name: string; phone: string;}> ();
      
      useTask$(({ track }) => {
        track (() => contactEditForm.value);
        if (contactEditForm.value) {
          showToast({ toastTypeParam: contactEditForm.value?.success ? 'success' : 'error', toastMsg: contactEditForm.value?.message ?? "Something went wrong!"});
        }
      });
      // 8.3 Delete form toast
        useTask$(({ track }) => {
        const form = track(() => contactDelForm.value); // track contactForm
        if (form) {
          showToast({ toastTypeParam: contactDelForm.value?.success ? 'success' : 'error', toastMsg: contactDelForm.value?.message ?? "Something went wrong!"}); // show toast automatically on change
        }
      });
    
    return <>
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
            bind:value={singlePhone}
            maxLength={13}
            minLength={10}
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
            <div class="flex justify-end gap-5 mb-4">

            <button class="border border-purple-500 bg-purple-50 px-4 py-2 rounded-xl cursor-pointer"
                onClick$={() => (showContactModal.value = true)}>
                <i class="fas fa-add"></i> Add Contact
            </button>

            <label 
                class="border border-yellow-500 bg-yellow-50 px-4 rounded-xl cursor-pointer inline-flex items-center"
            >
                <input 
                type="file" 
                class="hidden" 
                accept=".xlsx"
                onChange$={contactsFileChange}
                />
                <i class="fas fa-download mr-2"></i> {!fileName.value.length ? "Import" : "Change File"}
            </label>

            </div>
            {/* Left frame */}
            <div class="flex flex-col items-end">
                {/* Example download link */}
                <a
                href="/contact.example.xlsx"
                download
                class="text-sm text-blue-600 mb-4 hover:underline"
                >
                Download contact.example.xlsx
                </a>
                {/* Filename preview */}
                {contactFileName.value && (
                <div class="text-sm text-gray-600 mb-4 ">Selected file: {contactFileName.value}</div>
                )}
            </div>
        
            {/* Search Input */}
            <SearchInput placeholder="Enter by contact name or phone ..." name="get-contacts"/>
        </div>

        {/* Contact fields list */}
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
                        contactsFetch.data?.data?.forEach((c) => (contactSelection.selected[c.id] = checked));
                    }}
                    />
                    Name
                </th>
                <th class="py-3 px-4 font-medium">Phone Number</th>
                <th class="py-3 px-4 font-medium text-right">Actions</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
                {!contactsFetch.data?.data || contactsFetch.data.data.length === 0 ? 
                <tr><td class="py-4 px-4">No contacts available</td></tr> : 
                contactsFetch.data.data?.map((i) => {
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
                            if (!checked) contactSelection.selectAll = false;
                            else if (contactsFetch.data?.data?.every((c) => contactSelection.selected[c.id])) {
                                contactSelection.selectAll = true;
                            }
                            }}
                        />
                        <div
                            class={`w-10 h-10 rounded-full flex items-center justify-center mr-3 bg-blue-100`}
                        >
                            <i class={`fas fa-user text-blue-500`} />
                        </div>
                        <div>
                            <p class="font-semibold">{i.name}</p>
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
                        <button class="w-8 h-8 flex items-center justify-center text-green-500 hover:bg-green-100 rounded-full"
                        onClick$={() => { 
                            editContactModal.value = true;
                            selectedContact.value = i;
                            }}>
                            <i class="fas fa-pen"></i>
                        </button>
                        <button class="w-8 h-8 flex items-center justify-center text-red-500 hover:bg-red-100 rounded-full"
                        onClick$={() => { deleteContactModal.value = true; selectedContact.value = i } }>
                            <i class="fas fa-trash"></i>
                        </button>
                        </div>
                    </td>
                    </tr>
                );
                }) }
            </tbody>
            </table>
        </div>

        {/* Pagination  */}
        {contactsFetch.data && (
            <Pagination totalItems={contactsFetch.data.total ?? 0} name="get-contacts" />
        )}
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

        {/* create Modal  */}
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
                type="button"
                class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition"
                onClick$={() => (showContactModal.value = false)}
                >
                Cancel
                </button>
                <button
                type="submit"
                disabled={contactForm.isRunning}
                class={[
                    "px-4 py-2 rounded text-white transition cursor-pointer flex items-center gap-2",
                    contactForm.isRunning
                    ? "bg-purple-300 cursor-wait"
                    : "bg-purple-500 hover:bg-purple-600",
                ]}
                >
                {contactForm.isRunning ? (
                    <>
                    <span class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Loading...
                    </>
                ) : (
                    "Submit"
                )}
                </button>
            </div>
            </Form>
            </div>
        </div>
        )}

        {/* Delete Modal */}
        {deleteContactModal.value && <div class="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div class="bg-white rounded-xl shadow-lg p-6 w-96 relative">
            {/* Header */}
            <div class="flex justify-between items-center mb-4">
                <h2 class="text-lg font-semibold">Delete Contact</h2>
                <i
                class="fas fa-times-circle text-gray-500 cursor-pointer hover:text-gray-700 transition"
                onClick$={() => (deleteContactModal.value = false)}
                ></i>
            </div>
            <Form action={contactDelForm}>
                <p class="text-gray-700 text-sm mb-4">
                Are you sure you want to delete {selectedContact.value?.name} with phone {selectedContact.value?.phone}?
                </p>
                {/* Hidden id input  */}
                <input type="hidden" name="id" value={selectedContact.value?.id} />
                {/* Actions */}
                <div class="flex justify-end gap-3 mt-4">
                <button
                    type="button"
                    class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition"
                    onClick$={() => (deleteContactModal.value = false)}
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={contactDelForm.isRunning}
                    class={[
                    "px-4 py-2 rounded text-white transition cursor-pointer flex items-center gap-2",
                    contactDelForm.isRunning
                        ? "bg-red-300 cursor-wait"
                        : "bg-red-500 hover:bg-red-600",
                    ]}
                >
                    {contactDelForm.isRunning ? (
                    <>
                        <span class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        Loading...
                    </>
                    ) : (
                    "Delete"
                    )}
                </button>
                </div>
                </Form>
            </div>
        </div>}

        {/* Edit Modal */}
        {editContactModal.value && <div class="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div class="bg-white rounded-xl shadow-lg p-6 w-96 relative">
            {/* Header */}
            <div class="flex justify-between items-center mb-4">
                <h2 class="text-lg font-semibold">Edit Contact</h2>
                <i
                class="fas fa-times-circle text-gray-500 cursor-pointer hover:text-gray-700 transition"
                onClick$={() => (editContactModal.value = false)}
                ></i>
            </div>
                <Form action={contactEditForm}>
                {/* Hidden id input */}
                <input type="hidden" name="id" value={selectedContact.value?.id} />
                {/* Name Field */}
                <label class="text-gray-500 text-sm mb-1 block">Name : </label>
                <div class="relative mb-3">
                <i class="fas fa-user absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                <input
                    class="w-full border rounded px-10 py-2 focus:ring-2 focus:ring-green-400 focus:outline-none"
                    value={selectedContact.value?.name}
                    name="name"
                />
                </div>
    
                {/* Phone Field */}
                <label class="text-gray-500 text-sm mb-1 block">Phone : </label>
                <div class="relative mb-3">
                <i class="fas fa-phone absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                <input
                    class="w-full border rounded px-10 py-2 focus:ring-2 focus:ring-green-400 focus:outline-none"
                    value={selectedContact.value?.phone}
                    name="phone"
                />
                </div>
    
                {/* Actions */}
                <div class="flex justify-end gap-3 mt-4">
                <button
                    type="button"
                    class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition"
                    onClick$={() => (editContactModal.value = false)}
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={contactEditForm.isRunning}
                    class={[
                    "px-4 py-2 rounded text-white transition cursor-pointer flex items-center gap-2",
                    contactEditForm.isRunning
                        ? "bg-green-500 cursor-wait"
                        : "bg-green-600 hover:bg-green-400",
                    ]}
                >
                    {contactEditForm.isRunning ? (
                    <>
                        <span class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        Loading...
                    </>
                    ) : (
                    "Submit"
                    )}
                </button>
                </div>
                </Form>
            </div>
        </div>}


        
        </div>
    </>
})