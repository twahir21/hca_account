import { $, component$, useSignal, useTask$ } from "@builder.io/qwik";
import { useNavigate } from "@builder.io/qwik-city";

type PaginationProps = {
  totalItems: number;
  name: 'recent-sms' | 'get-groups' | 'get-contacts';
};

export const Pagination = component$<PaginationProps>(({ totalItems, name }) => {
  const currentPage = useSignal(1);
  const pageSize = useSignal(5); // items per page
  const totalPages = Math.ceil(totalItems / pageSize.value);

  const nav = useNavigate();
  useTask$(({ track, cleanup }) => {
    track(() => [currentPage.value, pageSize.value]);

    const timeout = setTimeout(() => {
      nav(`?name=${encodeURIComponent(name)}&page=${encodeURIComponent(currentPage.value)}&limit=${encodeURIComponent(pageSize.value)}`, {replaceState: true});
    })
    cleanup(() => clearTimeout(timeout));
  })

  const goToPage = $((page: number) => {
    if (page >= 1 && page <= totalPages) {
      currentPage.value = page;
    }
  });

  const handlePageSizeChange = $((newSize: number) => {
    pageSize.value = newSize;
    // Reset to first page when page size changes
    currentPage.value = 1;
  });

  const start = (currentPage.value - 1) * pageSize.value + 1;
  const end = Math.min(currentPage.value * pageSize.value, totalItems);

  return (
    <>
      <div class="w-full">
        {/* Pagination UI */}
        <div class="flex justify-center space-x-2">
          {/* Prev */}
          <button
            onClick$={() => goToPage(currentPage.value - 1)}
            disabled={currentPage.value === 1}
            class={`pagination-item flex items-center justify-center w-10 h-10 text-purple-600 transition-colors duration-150 rounded-full focus:shadow-outline ${
              currentPage.value === 1
                ? "bg-gray-200 cursor-not-allowed"
                : "bg-purple-100 hover:bg-purple-200"
            }`}
          >
            <i class="fas fa-chevron-left"></i>
          </button>

          {/* Example pages (you can make it dynamic if needed) */}
          {Array.from({ length: totalPages }).map((_, i) => {
            const page = i + 1;
            // Show first, last, current ±1, and dots
            if (
              page === 1 ||
              page === totalPages ||
              (page >= currentPage.value - 1 && page <= currentPage.value + 1)
            ) {
              return (
                <button
                  key={page}
                  onClick$={() => goToPage(page)}
                  class={`pagination-item flex items-center justify-center w-10 h-10 transition-colors duration-150 rounded-full focus:shadow-outline ${
                    currentPage.value === page
                      ? "bg-purple-600 text-white hover:bg-purple-700"
                      : "text-purple-600 hover:bg-gray-100"
                  }`}
                >
                  {page}
                </button>
              );
            } else if (
              page === currentPage.value - 2 ||
              page === currentPage.value + 2
            ) {
              return (
                <span
                  key={`dots-${page}`}
                  class="pagination-dots flex items-center justify-center w-10 h-10 text-gray-400"
                >
                  ...
                </span>
              );
            }
            return null;
          })}

          {/* Next */}
          <button
            onClick$={() => goToPage(currentPage.value + 1)}
            disabled={currentPage.value === totalPages}
            class={`pagination-item flex items-center justify-center w-10 h-10 text-purple-600 transition-colors duration-150 rounded-full focus:shadow-outline ${
              currentPage.value === totalPages
                ? "bg-gray-200 cursor-not-allowed"
                : "bg-purple-100 hover:bg-purple-200"
            }`}
          >
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>

        {/* Other info  */}
        <div class="flex flex-col md:flex-row justify-between items-center mt-4 gap-5">
            {/* Showing text */}
            <p class="text-center text-gray-500 text-sm">
            Showing <span class="font-bold">{start}</span> to{" "}
            <span class="font-bold">{end}</span> of{" "}
            <span class="font-bold">{totalItems}</span> results
            </p>

            {/* Page size selector */}
            <div class="flex justify-center">
            <label class="text-gray-600 text-sm mr-1.5">Items per page:</label>
            <select
                value={pageSize.value}
                onChange$={(event) => {
                  const newSize = parseInt((event.target as HTMLSelectElement).value, 10);
                  handlePageSizeChange(newSize);
                }}
                class="border border-gray-300 rounded p-1 text-sm focus:ring-2 focus:ring-purple-400"
            >
                {Array.from({ length: 7 }, (_, i) => i + 3).map((num) => (
                <option key={num} value={num}>
                    {num.toString()}
                </option>
                ))}
            </select>
            </div>
        </div>
      </div>
    </>
  );
});