import { $, component$, Signal, useSignal, useTask$ } from "@builder.io/qwik";
import { Pagination } from "~/components/ui/pagination";
import { fetchContacts } from "../../types/TeacherTypes";
import { useContactPost } from "~/routes/plugin";
import { Form } from "@builder.io/qwik-city";
import { Toast } from "~/components/ui/Toast";
import { SearchInput } from "~/components/ui/Search";

type contactProp = {
    contactsFetch: {
        success: boolean;
        message: string;
        data?: fetchContacts | undefined;
    },
    singlePhone: Signal<string>,
    contactSelection: {
        selectAll: boolean;
        selected: Record<string, boolean>;
    }
}

export const MsgContact = component$<contactProp>(({ contactsFetch, singlePhone, contactSelection }) => {
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


    // server form
    const contactForm = useContactPost();
    
    
    
    // 8.1 track form changes to fire a toast
    useTask$(({ track }) => {
        const form = track(() => contactForm.value); // track contactForm
        if (form) {
            showToast({ toastTypeParam: contactForm.value?.success ? 'success' : 'error', toastMsg: contactForm.value?.message ?? "Something went wrong!"}); // show toast automatically on change
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

        {/* Search Input */}
        <SearchInput placeholder="Enter by contact name or phone ..." name="get-contacts"/>

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

        </div>
    </>
})