import { component$, useSignal, useVisibleTask$ } from '@builder.io/qwik';

// ----- TYPES -----
type Day = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri';
type Hour =
  | '7:00 AM'
  | '8:00 AM'
  | '9:00 AM'
  | '10:00 AM'
  | '11:00 AM'
  | '12:00 PM'
  | '1:00 PM'
  | '2:00 PM'
  | '3:00 PM';

type Subject =
  | 'Math'
  | 'English'
  | 'Science'
  | 'Biology'
  | 'Physics'
  | 'Chemistry'
  | 'History'
  | 'Geography'
  | 'ICT'
  | 'Art'
  | 'Music'
  | 'PE'
  | 'Civics'
  | ''; // empty slot

type Timetable = Record<Day, Subject[]>;

// ----- DATA -----
const timetable: Timetable = {
  Mon: ['Math', 'English', 'Science', 'Geography', 'Art', 'PE', 'History', 'Biology', 'Music'],
  Tue: ['English', 'Physics', 'Chemistry', 'Math', 'ICT', 'Art', 'Civics', 'Biology', 'PE'],
  Wed: ['Math', 'English', 'Geography', 'History', 'PE', 'Biology', 'Chemistry', 'ICT', 'Music'],
  Thu: ['Physics', 'Math', 'English', 'Civics', 'Geography', 'Biology', 'PE', 'Chemistry', 'ICT'],
  Fri: ['English', 'Math', 'History', 'ICT', 'Art', 'PE', 'Biology', 'Physics', 'Music'],
};

const hours: Hour[] = [
  '7:00 AM',
  '8:00 AM',
  '9:00 AM',
  '10:00 AM',
  '11:00 AM',
  '12:00 PM',
  '1:00 PM',
  '2:00 PM',
  '3:00 PM',
];

const subjectColors: Record<Exclude<Subject, ''>, string> = {
  Math: 'bg-blue-100 text-blue-800',
  English: 'bg-green-100 text-green-800',
  Science: 'bg-purple-100 text-purple-800',
  Biology: 'bg-emerald-100 text-emerald-800',
  Physics: 'bg-indigo-100 text-indigo-800',
  Chemistry: 'bg-rose-100 text-rose-800',
  History: 'bg-orange-100 text-orange-800',
  Geography: 'bg-yellow-100 text-yellow-800',
  ICT: 'bg-teal-100 text-teal-800',
  Art: 'bg-pink-100 text-pink-800',
  Music: 'bg-red-100 text-red-800',
  PE: 'bg-gray-100 text-gray-800',
  Civics: 'bg-cyan-100 text-cyan-800',
};

// ----- COMPONENT -----
export const TimetableParent = component$(() => {
  const viewMode = useSignal<'week' | 'day'>('week');
  const currentDay = useSignal<Day>('Mon');

  // Detect current day
  useVisibleTask$(() => {
    const daysMap: (Day | 'Sun' | 'Sat')[] = [
      'Sun',
      'Mon',
      'Tue',
      'Wed',
      'Thu',
      'Fri',
      'Sat',
    ];
    const today = new Date().getDay();
    const day = daysMap[today];
    currentDay.value = day === 'Sun' || day === 'Sat' ? 'Mon' : (day as Day);
  });

  return (
    <div class="w-full p-4 bg-white rounded-2xl border border-yellow-600">
      {/* Header */}
      <div class="flex items-center justify-between mb-4">
        <h2
          class="
            inline-flex items-center gap-3
            px-2
            text-lg md:text-xl font-semibold text-[#253c6a]
          "
        >
          <span class="inline-block h-3 w-3 rounded-full bg-blue-500"></span>
          <span>Twahir</span>
          <span class="text-gray-500">—</span>
          <span class="text-indigo-600 font-medium">Class 1A</span>
        </h2>
        <button
          aria-pressed={viewMode.value === 'day'}
          onClick$={() => {
            viewMode.value = viewMode.value === 'week' ? 'day' : 'week';
          }}
          class="
            relative rounded-lg px-4 py-2 font-medium text-white 
            bg-gradient-to-r from-blue-500 to-indigo-500 
            shadow-md 
            transition-all duration-300 ease-out
            hover:from-indigo-500 hover:to-blue-500 
            hover:shadow-lg hover:scale-105 
            focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2
            active:scale-95
          "
        >
          {viewMode.value === 'week' ? 'Daily' : 'Weekly View'}
        </button>
      </div>

      {/* WEEK VIEW */}
      {viewMode.value === 'week' && (
        <div class="overflow-x-auto">
          <table class="min-w-full border-collapse text-sm">
            <thead>
              <tr class="bg-gray-100">
                <th scope="col" class="px-2 py-4 text-left border-b border-gray-200">
                  Time
                </th>
                {Object.keys(timetable).map((day) => (
                  <th
                    scope="col"
                    key={day}
                    class="px-2 py-2 text-center border-b border-gray-200"
                  >
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {hours.map((hour, i) => (
                <tr key={hour} class="bg-white">
                  <td class="px-2 py-2 font-medium bg-gray-50 border-b border-gray-200 sticky left-0">
                    {hour}
                  </td>
                  {(Object.keys(timetable) as Day[]).map((day, idx) => {
                    const subj = timetable[day][i] ?? '';
                    return (
                      <td
                        key={day + i}
                        class={`px-2 py-6 text-center border-b border-gray-200 ${
                          subj ? subjectColors[subj] : 'bg-white'
                        } ${idx !== Object.keys(timetable).length - 1 ? 'mr-2' : ''}`}
                        style={{ border: '8px solid #fff' }}
                      >
                        {subj || <span class="text-gray-400 italic">Free</span>}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* DAY VIEW */}
      {viewMode.value === 'day' && (
        <div class="mt-6">
          <h3 class="font-semibold text-lg text-[#253c6a] mb-2">{currentDay.value}</h3>
          <div class="grid grid-cols-1 gap-3">
            {timetable[currentDay.value]?.map((subj, i) => (
              <div
                key={i}
                class={`flex flex-col rounded-xl border border-gray-200 p-4 shadow-sm ${
                  subj ? subjectColors[subj] : 'bg-white'
                }`}
              >
                <p class="font-medium text-gray-700">{hours[i]}</p>
                <p class="text-sm">{subj || <span class="text-gray-400 italic">Free</span>}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
});
