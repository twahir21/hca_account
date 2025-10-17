import { component$, useSignal, useTask$ } from "@builder.io/qwik";

interface EventItem {
  id: number;
  title: string;
  time: string;
  description: string;
  type: "meeting" | "appointment" | "deadline" | "event";
}

// Mock API (replace with real fetch)
const fetchEvents = async (date: Date): Promise<EventItem[]> => {
  const events: Record<string, EventItem[]> = {
    "2025-08-30": [
      {
        id: 1,
        title: "Team Meeting",
        time: "10:00 AM",
        description: "Weekly sync",
        type: "meeting",
      },
      {
        id: 2,
        title: "Lunch with Client",
        time: "12:30 PM",
        description: "Discuss updates",
        type: "appointment",
      },
    ],
  };

  const key = date.toISOString().split("T")[0];
  return events[key] || [];
};

export const Calendar = component$(() => {
  const today = new Date();
  const currentDate = useSignal(new Date());
  const selectedDate = useSignal(new Date());
  const events = useSignal<EventItem[]>([]);
  const loading = useSignal(false);

  useTask$(async ({ track }) => {
    track(() => selectedDate.value);
    loading.value = true;
    events.value = await fetchEvents(selectedDate.value);
    loading.value = false;
  });

  const daysInMonth = (year: number, month: number) =>
    new Date(year, month + 1, 0).getDate();

  const firstDay = (year: number, month: number) =>
    new Date(year, month, 1).getDay();

  return (
    <div class="max-w-md w-full bg-white border-2 border-purple-400 rounded-2xl shadow-lg overflow-hidden">
      {/* Header */}
      <div class="bg-gradient-to-r from-indigo-100 to-yellow-100 text-gray-800 p-4">
        <div class="flex justify-between items-center mb-4">
          <button
            onClick$={() => {
              currentDate.value = new Date(
                currentDate.value.getFullYear(),
                currentDate.value.getMonth() - 1,
                1
              );
            }}
            class="p-2 rounded-full hover:bg-indigo-300 transition"
          >
            ‹
          </button>
          <h2 class="text-xl font-bold">
            {currentDate.value.toLocaleString("default", {
              month: "long",
            })}{" "}
            {currentDate.value.getFullYear()}
          </h2>
          <button
            onClick$={() => {
              currentDate.value = new Date(
                currentDate.value.getFullYear(),
                currentDate.value.getMonth() + 1,
                1
              );
            }}
            class="p-2 rounded-full hover:bg-yellow-300 transition"
          >
            ›
          </button>
        </div>
        <div class="grid grid-cols-7 text-center font-medium gap-1">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <div key={d}>{d}</div>
          ))}
        </div>
      </div>

      {/* Days */}
      <div class="p-5 grid grid-cols-7 gap-2 text-center">
        {Array.from({ length: firstDay(currentDate.value.getFullYear(), currentDate.value.getMonth()) }).map(
          (_, i) => (
            <div key={`empty-${i}`} class="h-10"></div>
          )
        )}

        {Array.from({
          length: daysInMonth(
            currentDate.value.getFullYear(),
            currentDate.value.getMonth()
          ),
        }).map((_, i) => {
          const day = i + 1;
          const date = new Date(
            currentDate.value.getFullYear(),
            currentDate.value.getMonth(),
            day
          );

          const isToday =
            date.toDateString() === today.toDateString();
          const isSelected =
            date.toDateString() === selectedDate.value.toDateString();

          return (
            <button
              key={day}
              onClick$={() => (selectedDate.value = date)}
              class={[
                "h-10 w-10 flex items-center justify-center rounded-full transition",
                "hover:bg-indigo-100 hover:text-indigo-700",
                isToday && "border border-indigo-500 text-indigo-600 font-semibold",
                isSelected &&
                  "bg-indigo-500 text-white font-bold shadow-md",
              ]}
            >
              {day}
            </button>
          );
        })}
      </div>

      {/* Events */}
      <div class="p-5 border-t border-gray-400">
        <h3 class="font-semibold text-gray-800 mb-3">
          Events for{" "}
          {selectedDate.value.toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </h3>

        {loading.value ? (
          <p class="text-gray-500">Loading...</p>
        ) : events.value.length === 0 ? (
          <p class="text-gray-400 text-sm flex items-center gap-2">
            <span>📭</span> No events for this date
          </p>
        ) : (
          <ul class="space-y-2">
            {events.value.map((ev) => (
              <li
                key={ev.id}
                class="p-3 rounded-lg border bg-gray-50 hover:bg-gray-100 transition"
              >
                <div class="flex justify-between items-center">
                  <h4 class="font-medium text-indigo-700">{ev.title}</h4>
                  <span class="text-sm text-gray-600">{ev.time}</span>
                </div>
                <p class="text-sm text-gray-600">{ev.description}</p>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Footer */}
      <div class="bg-gray-50 p-4 border-t flex justify-center">
        <button
          onClick$={() => {
            currentDate.value = new Date();
            selectedDate.value = new Date();
          }}
          class="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition"
        >
          Go to Today
        </button>
      </div>
    </div>
  );
});
