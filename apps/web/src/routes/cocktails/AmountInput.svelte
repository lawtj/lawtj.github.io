<script lang="ts">
    import { Input } from "$lib/components/ui/input";
    import { untrack } from "svelte";

    let {
        value,
        min = 0,
        fallback = 0,
        id,
        class: className = "",
        onCommit
    }: {
        value: number;
        min?: number;
        fallback?: number;
        id?: string;
        class?: string;
        onCommit: (value: number) => void;
    } = $props();

    // While the field is focused the user owns the text, so intermediate input
    // such as "" or "1." is not reformatted. Valid numbers are still emitted
    // immediately so the recipe calculations update as the user types.
    let draft: string = $state(untrack(() => String(value)));
    let focused: boolean = $state(false);

    $effect(() => {
        const incoming = String(value);
        if (!untrack(() => focused)) draft = incoming;
    });

    function commit(): void {
        const parsed = parseFloat(draft);
        const next = Number.isFinite(parsed) ? Math.max(min, parsed) : fallback;
        draft = String(next);
        if (next !== value) onCommit(next);
    }

    function handleInput(e: Event): void {
        const parsed = parseFloat((e.currentTarget as HTMLInputElement).value);
        if (Number.isFinite(parsed)) {
            const next = Math.max(min, parsed);
            if (next !== value) onCommit(next);
        }
    }

    function handleBlur(): void {
        focused = false;
        commit();
    }

    function handleKeydown(e: KeyboardEvent): void {
        if (e.key === 'Enter') {
            e.preventDefault();
            (e.currentTarget as HTMLInputElement).blur();
        }
    }
</script>

<Input
    {id}
    type="text"
    inputmode="decimal"
    autocomplete="off"
    bind:value={draft}
    oninput={handleInput}
    onfocus={() => (focused = true)}
    onblur={handleBlur}
    onkeydown={handleKeydown}
    class={className}
/>
