import { component$, useStore } from "@builder.io/qwik";

export default component$(() => {
  const state = useStore({
    selectAll: false,
    selected: {} as Record<number, boolean>,
  });

  const contacts = [
    { id: 1, name: "Alice Johnson", phone: "123-456-7890", role: "parent" },
    { id: 2, name: "Bob Smith", phone: "987-654-3210", role: "admin" },
    { id: 3, name: "Charlie Brown", phone: "555-123-4567", role: "teacher" },
  ];

  const roleColors: Record<string, { bg: string; text: string }> = {
    parent: { bg: "bg-blue-100", text: "text-blue-500" },
    admin: { bg: "bg-red-100", text: "text-red-500" },
    teacher: { bg: "bg-green-100", text: "text-green-500" },
  };

  return (
    <div class="overflow-x-auto border rounded-lg">
      <table class="w-full text-sm">
        <thead>
          <tr class="text-left text-gray-600 border-b bg-gray-50">
            <th class="py-3 px-4 font-medium">
              <input
                type="checkbox"
                class="mr-3 w-4 h-4"
                checked={state.selectAll}
                onChange$={(e) => {
                  const checked = (e.target as HTMLInputElement).checked;
                  state.selectAll = checked;
                  contacts.forEach((c) => (state.selected[c.id] = checked));
                }}
              />
              Name
            </th>
            <th class="py-3 px-4 font-medium">Phone Number</th>
            <th class="py-3 px-4 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          {contacts.map((i) => {
            const roleColor = roleColors[i.role] || roleColors.parent;
            return (
              <tr key={i.id} class="hover:bg-gray-50 transition">
                <td class="py-4 px-4">
                  <div class="flex items-center">
                    <input
                      type="checkbox"
                      class="mr-3 w-4 h-4"
                      checked={state.selected[i.id] || false}
                      onChange$={(e) => {
                        const checked = (e.target as HTMLInputElement).checked;
                        state.selected[i.id] = checked;
                        // If any row is unchecked, uncheck selectAll
                        if (!checked) state.selectAll = false;
                        // If all are checked, set selectAll
                        else if (
                          contacts.every((c) => state.selected[c.id])
                        ) {
                          state.selectAll = true;
                        }
                      }}
                    />
                    <div
                      class={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${roleColor.bg}`}
                    >
                      <i class={`fas fa-user ${roleColor.text}`} />
                    </div>
                    <div>
                      <p class="font-semibold">{i.name}</p>
                      <p class="text-gray-500 text-xs capitalize">{i.role}</p>
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
                    <button class="w-8 h-8 flex items-center justify-center text-green-500 hover:bg-green-100 rounded-full">
                      <i class="fas fa-pen"></i>
                    </button>
                    <button class="w-8 h-8 flex items-center justify-center text-red-500 hover:bg-red-100 rounded-full">
                      <i class="fas fa-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {/* Pagination */}
<div class="flex items-center justify-between border-t px-4 py-3 bg-white">
  <div class="text-sm text-gray-600">
    Showing <span class="font-medium">1</span> to <span class="font-medium">10</span> of{" "}
    <span class="font-medium">50</span> results
  </div>
  <div class="flex items-center space-x-1">
    <button class="px-3 py-1 rounded-md border text-gray-500 hover:bg-gray-100">
      Prev
    </button>
    <button class="px-3 py-1 rounded-md border bg-blue-500 text-white">
      1
    </button>
    <button class="px-3 py-1 rounded-md border hover:bg-gray-100">2</button>
    <button class="px-3 py-1 rounded-md border hover:bg-gray-100">3</button>
    <span class="px-2 text-gray-400">...</span>
    <button class="px-3 py-1 rounded-md border hover:bg-gray-100">5</button>
    <button class="px-3 py-1 rounded-md border text-gray-500 hover:bg-gray-100">
      Next
    </button>
  </div>
</div>

    </div>
  );
});
