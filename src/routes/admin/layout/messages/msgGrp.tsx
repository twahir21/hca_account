import { $, component$, Signal, useSignal, useStore, useTask$ } from "@builder.io/qwik";
import { Pagination } from "~/components/ui/pagination";
import { SearchInput } from "~/components/ui/Search";
import { fetchContacts, getGroupsResult } from "../../types/adminTypes";
import { useDeleteGrp, useGrpCreate, useGrpEdit } from "~/routes/plugin";
import { Form, useNavigate } from "@builder.io/qwik-city";
import { Toast } from "~/components/ui/Toast";

type Props = {
    getGroups: {
        success: boolean;
        message: string;
        data?: getGroupsResult | undefined;
        totalGroups?: number;
    }
    contactsFetch: {
        success: boolean;
        message: string;
        data?: fetchContacts | undefined;
    },
    selectedGroup: Signal<{
        groupName: string;
        totalContacts: number;
        groupId: string;
        contacts: {
            contactName: string;
            contactPhone: string;
        }[];
    } | null>
};

export const MsgGrp = component$<Props>(({ getGroups, contactsFetch, selectedGroup }) => {
    // 1. Server Forms
    const createGrpForm = useGrpCreate();
    const deleteGrpForm = useDeleteGrp();
    const editGrpForm = useGrpEdit();


    // Toast

      const showGroupModal = useSignal(false);
    
      const deleteGrpModal = useSignal(false);
      const editGrpModal = useSignal(false);
    
      // 7. Toast States
      const isToastOpen = useSignal(false);
      const toastType = useSignal<'success' | 'error'>('success');
      const toastMessage = useSignal('');
    
      const showToast = $(({ toastTypeParam, toastMsg } : { toastTypeParam: "success" | "error"; toastMsg: string;}) => {
        toastType.value = toastTypeParam;
        toastMessage.value = toastMsg;
        isToastOpen.value = true;
      });


      
        // 9. Group states
        const groupForm = useStore({ name: "", search: "", selected: [] as string[] });
            
         const expandedGroup = useSignal<string | null>(null);
      
        const sendGroup = $(async () => {
          const payload = {
            groupName: groupForm.name,
            contacts: groupForm.selected
          }
      
          const data = await createGrpForm.submit({ payload }) // for auto trigger fetching
          showToast({ toastTypeParam: data.value.success ? 'success' : 'error', toastMsg: data.value.message ?? "Something went wrong!"});
        });
        const sendEditGroup = $(async () => {
          const payload = {
            groupName: groupForm.name,
            contacts: groupForm.selected,
            groupId: selectedGroup.value?.groupId
          }
      
          const selectedContacts = contactsFetch.data?.data.filter((c) =>
        groupForm.selected.includes(c.id)
      );
      console.log(selectedContacts);
      
      
          const data = await editGrpForm.submit({ payload }) // for auto trigger fetching
          showToast({ toastTypeParam: data.value.success ? 'success' : 'error', toastMsg: data.value.message ?? "Something went wrong!"});
        })
        useTask$(({ track }) => {
          const form = track(() => deleteGrpForm.value); // track 
          if (form) {
            showToast({ toastTypeParam: deleteGrpForm.value?.success ? 'success' : 'error', toastMsg: deleteGrpForm.value?.message ?? "Something went wrong!"}); // show toast automatically on change
          }
        });
        
        const nav = useNavigate();
        
      

    return <>
        <div class="bg-gray-50 border border-gray-400 rounded-2xl p-6">
        
        {/* Header */}
        <div class="flex flex-col sm:flex-row sm:justify-between items-center mb-6">
            <h2 class="text-lg font-semibold mb-2 sm:mb-0">Select Group:</h2>

            <button
            class="w-full sm:w-auto mt-2 sm:mt-0 px-5 py-2 border border-yellow-600 cursor-pointer bg-yellow-50 rounded-xl shadow hover:bg-yellow-200 sm:ml-auto"
            onClick$={() => (showGroupModal.value = true)}
            >
            <i class="fas fa-add mr-1"></i> Add Group
            </button>
        </div>

        {/* Search */}
        <div class="mb-6">
            <SearchInput placeholder="Search by Group Name..." name="get-groups" />
        </div>

        {/* Groups List */}
        {getGroups.success === false ? (
            <div class="text-gray-500 text-center py-8">
            <i class="fas fa-folder-open text-3xl mb-2"></i>
            <p class="font-medium">{getGroups.message ?? "No groups found."}</p>
            </div>
        ) : (
        <div class="grid gap-4">
            {getGroups.data?.map((g) => (
            <div key={g.groupId} class="bg-white rounded-xl shadow hover:shadow-md transition">
                {/* Group Row */}
                <div
                class="flex items-center gap-4 p-4 cursor-pointer"
                >
                <input
                    type="checkbox"
                    class="w-5 h-5 accent-blue-600 cursor-pointer"
                    checked={selectedGroup.value?.groupId === g.groupId}
                    onChange$={(e) => {
                    const checked = (e.target as HTMLInputElement).checked;
                    selectedGroup.value = checked ? g : null;
                    }}
                />


                {/* Avatar */}
                <div class="w-12 h-12 flex items-center justify-center bg-blue-100 text-blue-700 font-bold rounded-full">
                    {g.groupName.charAt(0).toUpperCase()}
                </div>

                {/* Details */}
                <div class="flex-1">
                    <h2 class="text-lg font-semibold">{g.groupName}</h2>
                    <p class="text-sm text-gray-500">{g.totalContacts} contacts</p>
                </div>

                {/* Action buttons */}
                <div class="flex items-center">
                    <button
                    class="p-2 w-10 h-10 rounded-full text-blue-600 hover:bg-blue-100"
                    title="View Contacts"
                    onClick$={() => (expandedGroup.value = expandedGroup.value === g.groupId ? null : g.groupId)}
                    >
                    <i
                        class={`fas ${
                        expandedGroup.value === g.groupId
                            ? "fa-eye-slash"
                            : "fa-eye"
                        }`}
                    ></i>
                    </button>

                    {/* <button
                    class="p-2 w-10 h-10 rounded-full text-green-600 hover:bg-green-100"
                    title="Edit"
                    onClick$={() => { editGrpModal.value = true; selectedGroup.value = g } }
                    >
                    <i class="fas fa-pen"></i>
                    </button> */}

                    <button
                    class="p-2 w-10 h-10 rounded-full text-red-600 hover:bg-red-100"
                    title="Delete"
                    onClick$={() => { deleteGrpModal.value = true; selectedGroup.value = g } }
                    >
                    <i class="fas fa-trash"></i>
                    </button>
                </div>
                </div>

                {/* Contact List (Expandable) */}
                {expandedGroup.value === g.groupId && (
                <div class="mt-2 border-t border-gray-200 pt-3 px-4 pb-3 space-y-2 animate-fadeIn">
                    {g.contacts.map((c) => (
                    <div
                        key={c.contactPhone}
                        class="flex items-center gap-3 border-b border-gray-300 last:border-none hover:bg-gray-100 px-3 py-2"
                    >
                        <div class="w-9 h-9 flex items-center justify-center rounded-full bg-green-100 text-green-600 font-bold">
                        <i class="fas fa-user text-sm"></i>
                        </div>
                        <div>
                        <p class="font-medium text-gray-800">{c.contactName}</p>
                        <p class="text-sm text-gray-500 flex items-center gap-1">
                            <i class="fas fa-phone text-xs text-gray-400"></i>{" "}
                            {c.contactPhone}
                        </p>
                        </div>
                    </div>
                    ))}
                </div>
                )}
            </div>
            ))}

            {getGroups.data?.length === 0 && (
            <p class="text-gray-500 text-center col-span-full py-6">
                No groups found.
            </p>
            )}
        </div>
        )}

        {/* Empty fallback */}
        {getGroups.data?.length === 0 && getGroups.success !== false && (
            <p class="text-gray-500 text-center py-6">No groups found.</p>
        )}

        {/* Pagination */}
        {getGroups.data  && (
            <div class="flex justify-center mt-6">
            <Pagination totalItems={getGroups.totalGroups ?? 0} name="get-groups"/>
            </div>
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
        
        {/* Group Modal */}
        {showGroupModal.value && (
        <div class="fixed inset-0 flex items-center justify-center bg-black/50">
            <div class="bg-white rounded-xl shadow-lg p-6 w-[28rem]">
            <h2 class="text-lg font-semibold mb-4">Add Group</h2>

            {/* Group Name Field */}
            <label class="text-gray-500 text-sm mb-1 block">Group Name : </label>
            <div class="relative mb-3">
                <i class="fas fa-user-group absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                <input
                class="w-full border rounded px-10 py-2 focus:ring-2 focus:ring-purple-400 focus:outline-none mb-2"
                placeholder="e.g. Teachers"
                name="groupName"
                value={groupForm.name}
                onInput$={(e) => (groupForm.name = (e.target as HTMLInputElement).value)} 
                />
            </div>

            {/* Search bar */}
            <label class="text-gray-500 text-sm mb-1 block">Search Contacts : </label>
            <SearchInput placeholder="Search Contacts by name or phone ..." name="get-contacts" />

            {/* Contact list */}
            <div class="max-h-40 overflow-y-auto border rounded p-2 my-3">
                {!contactsFetch.data?.data || contactsFetch.data.data.length === 0 ? 
                    <div class="flex flex-col items-center justify-center py-6 text-center text-gray-500">
                    <i class="fas fa-address-book text-3xl text-gray-400 mb-2"></i>
                    
                    <p class="font-medium">{ contactsFetch.message }</p>
                    <p class="text-sm text-gray-400">Please add or import contacts to continue</p>
                </div>
                : (contactsFetch.data.data
                .filter((c) =>
                    c.name.toLowerCase().includes(groupForm.search.toLowerCase())
                )
                .map((c) => (
                    <label
                    key={c.id}
                    class="flex items-center gap-2 px-2 py-2 my-1 hover:bg-gray-100 cursor-pointer border-b last:border-none"
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
                    {/* Display name and phone in phone contact way */}
                    <div class="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 transition">
                        <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                        <i class="fas fa-user text-lg"></i>
                        </div>
                        <div class="flex flex-col">
                        <p class="font-medium text-gray-800">{c.name}</p>
                        <p class="text-sm text-gray-500 flex items-center gap-1">
                            <i class="fas fa-phone text-xs text-gray-400"></i>
                            {c.phone}
                        </p>
                        </div>
                    </div>

                    </label>
                )))}

            </div>

            {/* Pagination  */}
            {contactsFetch.data && (
                <Pagination totalItems={contactsFetch.data.total ?? 0} name="get-contacts" />
            )}

            <div class="flex justify-end gap-3 mt-2">
                <button
                class="px-4 py-2 bg-gray-200 rounded"
                onClick$={() => (showGroupModal.value = false)}
                >
                Cancel
                </button>

                <button
                type="submit"
                disabled={createGrpForm.isRunning}
                onClick$={sendGroup}
                class={[
                    "px-4 py-2 rounded text-white transition cursor-pointer flex items-center gap-2",
                    createGrpForm.isRunning
                    ? "bg-purple-300 cursor-wait"
                    : "bg-purple-500 hover:bg-purple-600",
                ]}
                >
                {createGrpForm.isRunning ? (
                    <>
                    <span class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Loading...
                    </>
                ) : (
                    "Create"
                )}
                </button>
            </div>
            </div>
        </div>
        )}

        {/* Edit Modals  */}
        {editGrpModal.value && (
        <div class="fixed inset-0 flex items-center justify-center bg-black/50">
            <div class="bg-white rounded-xl shadow-lg p-6 w-[28rem]">
            <h2 class="text-lg font-semibold mb-4">Edit Group</h2>

            {/* Group Name Field */}
            <label class="text-gray-500 text-sm mb-1 block">Group Name : </label>
            <div class="relative mb-3">
                <i class="fas fa-user-group absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                <input
                class="w-full border rounded px-10 py-2 focus:ring-2 focus:ring-purple-400 focus:outline-none mb-2"
                placeholder="e.g. Teachers"
                name="groupName"
                value={selectedGroup.value?.groupName}
                onInput$={(e) => (groupForm.name = (e.target as HTMLInputElement).value)} 
                />
            </div>

            {/* Search bar */}
            <label class="text-gray-500 text-sm mb-1 block">Search Contacts : </label>
            <SearchInput placeholder="Search Contacts by name or phone ..." name="get-contacts" />

            {/* Contact list */}
            <div class="max-h-60 overflow-y-auto border border-gray-200 rounded-xl p-3 my-3 bg-white shadow-sm">
                {/* 🧩 Empty State */}
                {!contactsFetch.data?.data || contactsFetch.data.data.length === 0 ? (
                <div class="flex flex-col items-center justify-center py-8 text-center text-gray-500">
                    <i class="fas fa-address-book text-4xl text-gray-400 mb-3"></i>
                    <p class="font-medium">{contactsFetch.message}</p>
                    <p class="text-sm text-gray-400">Please add or import contacts to continue</p>
                </div>
                ) : (
                /* 🧠 Contacts List */
                <div class="divide-y divide-gray-100">
                    {contactsFetch.data.data.map((c) => {
                    const isPreselected =
                        !!selectedGroup.value?.contacts.some(
                        (gc) =>
                            gc.contactName === c.name &&
                            gc.contactPhone === c.phone
                        );

                    // Merge preselected contacts into groupForm.selected (run once)
                    if (isPreselected && !groupForm.selected.includes(c.id)) {
                        groupForm.selected = [...groupForm.selected, c.id];
                    }

                    const isChecked =
                        isPreselected || groupForm.selected.includes(c.id);


                    return (
                        <label
                        key={c.id}
                        class="flex items-center gap-3 py-2 px-2 hover:bg-gray-50 cursor-pointer transition rounded-lg"
                        >
                        <input
                            type="checkbox"
                            checked={isChecked}
                            class="w-4 h-4 accent-blue-600 cursor-pointer"
                            onChange$={(e) => {
                            const checked = (e.target as HTMLInputElement).checked;

                            if (checked) {
                                // Add only if not already in the list
                                if (!groupForm.selected.includes(c.id)) {
                                groupForm.selected = [...groupForm.selected, c.id];
                                }
                            } else {
                                // Remove if unchecked
                                groupForm.selected = groupForm.selected.filter((id) => id !== c.id);
                            }

                            }}

                        />

                        {/* Avatar */}
                        <div class="w-10 h-10 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 font-semibold">
                            <i class="fas fa-user text-lg"></i>
                        </div>

                        {/* Name + Phone */}
                        <div class="flex flex-col">
                            <p class="font-medium text-gray-800">{c.name}</p>
                            <p class="text-sm text-gray-500 flex items-center gap-1">
                            <i class="fas fa-phone text-xs text-gray-400"></i>
                            {c.phone}
                            </p>
                        </div>
                        </label>
                    );
                    })}
                </div>
                )}
            </div>


            {/* Pagination  */}
            {contactsFetch.data && (
                <Pagination totalItems={contactsFetch.data.total ?? 0} name="get-contacts" />
            )}

            <div class="flex justify-end gap-3 mt-2">
                <button
                class="px-4 py-2 bg-gray-200 rounded"
                onClick$={() => { editGrpModal.value = false; nav(`?page=1&limit=5`); groupForm.selected = []}}
                >
                Cancel
                </button>

                <button
                type="submit"
                disabled={editGrpForm.isRunning}
                onClick$={sendEditGroup}
                class={[
                    "px-4 py-2 rounded text-white transition cursor-pointer flex items-center gap-2",
                    editGrpForm.isRunning
                    ? "bg-purple-300 cursor-wait"
                    : "bg-purple-500 hover:bg-purple-600",
                ]}
                >
                {editGrpForm.isRunning ? (
                    <>
                    <span class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Loading...
                    </>
                ) : (
                    "Submit"
                )}
                </button>
            </div>
            </div>
        </div>
        )}
        
        
        {/* Delete Modals  */}
        {deleteGrpModal.value && <div class="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
        <div class="bg-white rounded-xl shadow-lg p-6 w-96 relative">
            {/* Header */}
            <div class="flex justify-between items-center mb-4">
            <h2 class="text-lg font-semibold">Delete Group</h2>
            <i
                class="fas fa-times-circle text-gray-500 cursor-pointer hover:text-gray-700 transition"
                onClick$={() => (deleteGrpModal.value = false)}
            ></i>
            </div>
            <Form action={deleteGrpForm}>
            <p class="text-gray-700 text-sm mb-4">
                Are you sure you want to delete the group named {selectedGroup.value?.groupName} ?
            </p>
            {/* Hidden id input  */}
            <input type="hidden" name="id" value={selectedGroup.value?.groupId} />
            {/* Actions */}
            <div class="flex justify-end gap-3 mt-4">
                <button
                type="button"
                class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition"
                onClick$={() => (deleteGrpModal.value = false)}
                >
                Cancel
                </button>
                <button
                type="submit"
                disabled={deleteGrpForm.isRunning}
                class={[
                    "px-4 py-2 rounded text-white transition cursor-pointer flex items-center gap-2",
                    deleteGrpForm.isRunning
                    ? "bg-red-300 cursor-wait"
                    : "bg-red-500 hover:bg-red-600",
                ]}
                >
                {deleteGrpForm.isRunning ? (
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
        </div>
    </>
});