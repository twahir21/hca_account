import { component$ } from "@builder.io/qwik";

const menuItems = [
    {
    title: "MENU",
    items: [
        {
            icon: "/assets/home.png",
            label: "Home",
            section: "home"
        },
        {
            icon: "/assets/student.png",
            label: "Students",
            section: "students"
        },
        {
            icon: "/assets/parent.png",
            label: "Parents",
            section: "parents"
        },
        {
            icon: "/assets/lesson.png",
            label: "Lessons",
            section: "lessons"
        },
        {
            icon: "/assets/exam.png",
            label: "Exams",
            section: "exams"
        },
        {
            icon: "/assets/assignment.png",
            label: "Assignments",
            section: "assignments"
        },
        {
            icon: "/assets/result.png",
            label: "Results",
            section: "results"
        },
        {
            icon: "/assets/attendance.png",
            label: "Attendances",
            section: "attendances"
        },
        {
            icon: "/assets/calendar.png",
            label: "Events",
            section: "events"
        },
        {
            icon: "/assets/message.png",
            label: "Bulk SMS",
            section: "bulkSMS"
        },
        {
            icon: "/assets/announcement.png",
            label: "Announcements",
            section: "announcements"
        },
    ],
    },{
    title: "OTHERS",
    items: [
        {
            icon: "/assets/profile.png",
            label: "Profile",
            section: "profile"
        },
        {
            icon: "/assets/setting.png",
            label: "Settings",
            section: "settings"
        },
        {
            icon: "/assets/logout.png",
            label: "Logout",
            section: "logout"
        }
    ]
}
]
type MenuProps = {
    selectedSection: { value: string }
}
export const MenuTeachers = component$<MenuProps>(({ selectedSection }) => {
    return (
        // <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
        //     <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" />
        // </svg>
        <div class="mt-4 text-sm">
            {menuItems.map(item => (
                <div key={item.title} class="flex flex-col gap-2">
                    <span class="hidden lg:block text-gray-400 my-4">{item.title}</span>
                    {item.items.map(item => (
                        <button key={item.label} class={`flex items-center justify-center lg:justify-start gap-4 text-gray-500 ${selectedSection.value === item.section ? 'bg-purple-50 border border-purple-500' : ''} py-2 hover:bg-yellow-50 rounded-xl  lg:pl-3`}
                            onClick$={() => selectedSection.value = item.section}
                        >
                            <img src={item.icon} alt={item.label} height={20} width={20} />
                            <span class="hidden lg:block">{item.label}</span>
                        </button>
                    ))}
                </div>
            ))}
        </div>
    )
})