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

    // While the field is focused the user owns the text; we don't reformat or
    // coerce it. Validation happens on blur/Enter only. The initial read is a
    // seed only; the effect below keeps it in sync from here on.
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
    onfocus={() => (focused = true)}
    onblur={handleBlur}
    onkeydown={handleKeydown}
    class={className}
/>
