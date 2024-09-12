<script lang="ts">
    import type { HTMLAttributes } from "svelte/elements";
    import { fly } from "svelte/transition";

    type Props = HTMLAttributes<HTMLSpanElement> & {
        class?: string;
    };

    let {
        class: cssClass,
        ...restProps
    }: Props = $props();
    
    let elapsed = $state(0);
    let startTime: Date;
    let timer = 0;

    let hh = $derived(Math.floor(elapsed / 3600));
    let mm = $derived(Math.floor((elapsed - hh * 3600) / 60));
    let ss = $derived(Math.trunc(elapsed - hh * 3600 - mm * 60));

	// Animation-related.
	const duration = 180;
	const delay = 90;

	function f(value: number) {
		if (value < 10) {
			return `0${value}`;
		}
		return value.toString();
	}

    export function start() {
        startTime = new Date();
        const elapsedSnapshot = $state.snapshot(elapsed);
        timer = setInterval(() => {
            elapsed = elapsedSnapshot + (new Date().getTime() - startTime.getTime()) / 1_000;
        }, 100);
    }

    export function stop() {
        clearInterval(timer);
        return elapsed;
    }

    export function reset() {
        stop();
        elapsed = 0;
    }
</script>

<span class="timer {cssClass}" {...restProps}>
	<span class="value">
		{#key hh}
			<span class="value" in:fly={{ delay, duration, y: '1em'}} out:fly={{ duration, y: '-1em'}}>{f(hh)}</span>
		{/key}
	</span>:<span class="value">
		{#key mm}
			<span class="value" in:fly={{ delay, duration, y: '1em'}} out:fly={{ duration, y: '-1em'}}>{f(mm)}</span>
		{/key}
	</span>:<span class="value">
		{#key ss}
			<span class="value" in:fly={{ delay, duration, y: '1em'}} out:fly={{ duration, y: '-1em'}}>{f(ss)}</span>
		{/key}
	</span>
</span>

<style>
	span.timer {
		padding: 0 0.2em;
	}
	span.value {
		display: inline-flex;
		flex-flow: column;
		height: 1em;
	}
	span.value > span {
		display: inline-block;
	}
</style>
