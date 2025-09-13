import { component$ } from "@builder.io/qwik";
import { SearchIcon } from "lucide-qwik";

type SearchProps = {
    placeholder: string;
}
export const SearchInput = component$<SearchProps>(({ placeholder }) => {
    return <>
    <div class="flex items-center gap-2 rounded-lg border border-slate-400 px-3 py-2 
                    bg-white
                focus-within:border-sky-200 focus-within:ring-2 focus-within:ring-sky-200
                transition-all duration-200">
        <SearchIcon class="w-5 h-5 text-slate-500" />
        <input 
        type="text"
        placeholder={placeholder}
        class="w-full bg-transparent outline-none placeholder-slate-400"
        />
    </div>
    </>
})