import { component$ } from "@builder.io/qwik";
import { smsAnalytics } from "../../types/TeacherTypes";

type msgCardsProps = {
    count: number;
    smsAnalytics: smsAnalytics
}

export const MsgCards = component$<msgCardsProps>(({ count, smsAnalytics }) => {
    return <>
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
                            <p class="text-2xl font-bold text-gray-800">{smsAnalytics.data.smsToday}</p>
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
                            <p class="text-2xl font-bold text-gray-800">{smsAnalytics.data.totalGroups}</p>
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
                            <p class="text-2xl font-bold text-gray-800">{smsAnalytics.data.totalContacts}</p>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </>
})