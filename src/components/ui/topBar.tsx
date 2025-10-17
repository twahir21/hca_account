import { component$ } from "@builder.io/qwik";
import Search from "~/images/search.png?jsx";
import Message from "~/images/message.png?jsx";
import Announcement from "~/images/announcement.png?jsx";
import Avatar from "~/images/avatar.png?jsx";

interface TopBarProps {
    role: string;
    username: string;
}

export const TopBar = component$<TopBarProps>(({ username, role }) => {
    return <>
    <nav class="flex items-center justify-between p-4">
        {/* SEARCH BAR */}
        <div class="hidden md:flex items-center gap-2 text-sm rounded-full ring-[1.5px] ring-gray-400 px-2">
            <Search class="h-[14px] w-[14px]"/>
            <input type="text" placeholder="Search ..." class="w-[200px] p-2 bg-transparent outline-none"/>
        </div>

        {/* OTHERS  */}
        <div class="flex item-center gap-6 justify-end w-full">
            <div class="bg-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer">
                <Message class="w-[20px] h-[20px]"/>
            </div>
            <div class="bg-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer relative">
                <Announcement class="w-[20px] h-[20px]"/>
                <div class="absolute -top-3 -right-3 w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm">
                    1
                </div>
            </div>
            <div class="flex flex-col">
                <span class="text-xs leading-3 font-medium"> {username} </span>
                <span class="text-[12px] text-gray-500 text-right"> {role} </span>
            </div>

            <Avatar class="w-[36px] h-[36px] rounded-full cursor-pointer"/>
        </div>
    </nav>
    </>
})