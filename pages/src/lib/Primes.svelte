<script lang="ts">
    import { untrack } from "svelte";
    import { CancelledMessage, ManualResetEvent, WorkItemStatus, type AsyncWorker, type WorkItem } from "../../../dist/index.js";
    import { type ExampleWorker } from "../workers/exampleWorker.js";
    import { nextControlId } from "./nextControlId.js";
    import Stopwatch from "./Stopwatch.svelte";

    type Props = {
        toNumber: number;
        worker: AsyncWorker<ExampleWorker>
    };

    let {
        toNumber,
        worker,
    }: Props = $props();

    let numFormatter = new Intl.NumberFormat(navigator.languages, {
        maximumFractionDigits: 0
    });
    let primeCount = $state(0);
    let work = $state<WorkItem<void>>();
    let maxPrime = $state(0);
    let running = $state(false);
    let pausable = $state(false);
    let paused = $state(false);
    let pauseEvent = crossOriginIsolated ? new ManualResetEvent() : undefined;
    const id = nextControlId();
    let sw: Stopwatch;

    $effect(() => {
        if (pausable && paused) {
            pauseEvent?.reset();
            untrack(() => sw.stop());
        }
        else if (pausable && running) {
            pauseEvent?.signal();
            untrack(() => sw.start());
        }
    });

    $effect(() => {
        if (running) {
            untrack(() => sw.reset());
            untrack(() => sw.start());
        }
        else {
            untrack(() => sw.stop());
        }
    });

    function processPrimeMessage(data: number | string) {
        if (typeof data === 'number') {
            ++primeCount;
            maxPrime = data;
        }
        else if (data === undefined) {
            running = false;
            return true;
        }
        else {
            console.warn('Unknown message from prime worker: %o', data);
        }
        return false;
    }

    function startOrTogglePauseCalculation() {
        if (work?.status === WorkItemStatus.Started) {
            paused = !paused;
            return;
        }
        maxPrime = 0;
        primeCount = 0;
        running = true;
        work = worker.enqueue.calculatePrimes(
                { to: toNumber, pause: pausable ? pauseEvent?.token : undefined },
                { processMessage: processPrimeMessage, cancellable: crossOriginIsolated });
    }

    function cancelCalculation() {
        work?.cancel();
        running = false;
    }
</script>

{#snippet numeric(value: number)}
    {numFormatter.format(value)}
{/snippet}

{#snippet result(variant: string)}
    <div class="alert alert-{variant} d-flex flex-column justify-content-center">
        <span class="display-2">
            {@render numeric(maxPrime)}
        </span>
        <span class="fs-6">
            Total primes: {@render numeric(primeCount)}
        </span>
    </div>
{/snippet}

<div class="card h-100">
    <div class="card-header d-flex flex-row flex-nowrap align-items-baseline">
        <h5>Primes to {@render numeric(toNumber)}</h5>
        {#if work?.id}
            <span class="badge text-bg-secondary ms-auto">
                ID: {work.id}
            </span>
        {/if}
    </div>
    <div class="card-body text-center d-flex flex-column justify-content-center align-items-center">
        <div class="row w-100">
            <div class="col">
                <input
                    type="range"
                    id="{id}_toNumber"
                    bind:value={toNumber}
                    class="form-range"
                    min={10_000}
                    max={1_000_000}
                    step={10_000}
                >
            </div>
        </div>
        {#if !work}
            <p>Press <span class="badge text-bg-primary">Start</span> to discover primes.</p>
        {:else}
            {#await work.promise}
                <span class="display-2">
                    {@render numeric(maxPrime)}
                </span>
            {:then}
                {@render result('success')}
            {:catch reason}
                {#if reason instanceof CancelledMessage}
                    {@render result('danger')}
                {:else}
                    <div class="class alert alert-danger">
                        <h3>An Error Occurred</h3>
                        <details>
                            <summary>Details</summary>
                            <pre>{reason?.toString()}</pre>
                        </details>
                    </div>
                {/if}
            {/await}
        {/if}
    </div>
    <ul class="list-group list-group-flush">
        <li class="list-group-item">
            <input
                type="checkbox"
                {id}
                class="form-check-input"
                bind:checked={pausable}
                disabled={!crossOriginIsolated || running}
            >
            <label for="{id}">Run as pausable</label>
        </li>
        <li class="list-group-item d-flex flex-row flex-nowrap gap-2">
            <button
                type="button"
                class="btn btn-{running && pausable ? 'info' : 'primary'}"
                onclick={startOrTogglePauseCalculation}
                disabled={running && !pausable}
            >
                {running ? pausable && paused ? 'Resume' : pausable ? 'Pause' : 'Running' : 'Start'}
            </button>
            <button
                type="button"
                class="btn btn-warning"
                onclick={cancelCalculation}
                disabled={!running}
            >
                Cancel process
            </button>
        </li>
        <li class="list-group-item text-center fs-2">
            <Stopwatch bind:this={sw} />
        </li>
    </ul>
</div>
