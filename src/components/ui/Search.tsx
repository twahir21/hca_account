import { component$, useSignal, useTask$ } from "@builder.io/qwik";
import { useNavigate } from "@builder.io/qwik-city";
import { SearchIcon } from "lucide-qwik";

type SearchProps = {
    placeholder: string;
    name: 'recent-sms' | 'get-groups' | 'get-contacts';

}
export const SearchInput = component$<SearchProps>(({ placeholder, name }) => {
    const nav = useNavigate();
    const search = useSignal("");

    // re-run when search changes (best way is debounce to wait 300ms)
    useTask$(({ track, cleanup }) => {
    const query = track(() => search.value);

    const timeout = setTimeout(() => {
        if (query) {
            nav(`?name=${encodeURIComponent(name)}&search=${encodeURIComponent(query)}`);
        } else {
            nav("?");
        }
    }, 300);

    cleanup(() => clearTimeout(timeout));
    });


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
        onInput$={(e) => (search.value = (e.target as HTMLInputElement).value)}
        />
    </div>
    </>
})