import { component$ } from "@builder.io/qwik";

type UserCardProps = {
    title: string;
    count: number;
    status: "up" | "down" | "neutral";
    percent: number;
}

export const UserCard = component$<UserCardProps>(({ title, count, status, percent }) => {
    return <>
    <div class={`rounded-2xl odd:bg-purple-50 even:bg-yellow-50 p-4 flex-1 min-w-[160px] border  odd:border-purple-300 even:border-yellow-300`}>
        <div class="flex justify-between items-center">
        <h2 class="capitalize text-sm font-medium text-gray-500">{title}</h2>
            <i class="fas fa-users text-purple-500"></i>
        </div>
        <h1 class="text-2xl font-semibold my-4">{count}</h1>
        <p
        class={`text-sm mt-1 ${
            status === "up"
            ? "text-green-600"
            : status === "down"
            ? "text-red-600"
            : "text-gray-600"
        }`}
        >
        <i
            class={`fas ${
            status === "up"
                ? "fa-arrow-up"
                : status === "down"
                ? "fa-arrow-down"
                : "fa-arrow-right"
            }`}
        ></i>{" "}
        {percent}% {status === "neutral" ? "no change" : "since last month"}
        </p>

    </div>
    </>
})