import { component$ } from "@builder.io/qwik";

export const Pagination = component$(() => {
    return <>
            <div class="w-full">
                {/* Pagination ui  */}
                <div class="flex justify-center space-x-2">
                    <button class="pagination-item flex items-center justify-center w-10 h-10 text-purple-600 transition-colors duration-150 bg-purple-100 rounded-full focus:shadow-outline hover:bg-purple-200">
                        <i class="fas fa-chevron-left"></i>
                    </button>
                    
                    <button class="pagination-item flex items-center justify-center w-10 h-10 text-white transition-colors duration-150 bg-purple-600 rounded-full focus:shadow-outline hover:bg-purple-700">
                        1
                    </button>
                    
                    <button class="pagination-item flex items-center justify-center w-10 h-10 text-purple-600 transition-colors duration-150 rounded-full focus:shadow-outline hover:bg-gray-100">
                        2
                    </button>
                    
                    <button class="pagination-item flex items-center justify-center w-10 h-10 text-purple-600 transition-colors duration-150 rounded-full focus:shadow-outline hover:bg-gray-100">
                        3
                    </button>
                    
                    <span class="pagination-dots flex items-center justify-center w-10 h-10 text-gray-400">
                        ...
                    </span>
                    
                    <button class="pagination-item flex items-center justify-center w-10 h-10 text-purple-600 transition-colors duration-150 rounded-full focus:shadow-outline hover:bg-gray-100">
                        10
                    </button>
                    
                    <button class="pagination-item flex items-center justify-center w-10 h-10 text-purple-600 transition-colors duration-150 bg-purple-100 rounded-full focus:shadow-outline hover:bg-purple-200">
                        <i class="fas fa-chevron-right"></i>
                    </button>
                </div>
                {/* Showing text  */}
                <p class="text-center text-gray-500 text-sm m-3">
                    Showing <span class="font-bold">1</span> to <span class="font-bold">5</span> of <span class="font-bold">40</span> results
                </p>
            </div>
    </>
})