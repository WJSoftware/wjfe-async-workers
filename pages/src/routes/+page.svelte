<script lang="ts">
    import CrossOriginNotIsolated from "$lib/CrossOriginNotIsolated.svelte";
    import Instructions from "$lib/Instructions.svelte";
    import Primes from "$lib/Primes.svelte";
    import TopBanner from "$lib/TopBanner.svelte";
    import { AsyncWorker } from "../../../dist/workers/AsyncWorker.js";
    import svelteLogo from "../assets/svelte.svg";
    import { exampleWorker } from "../workers/exampleWorker.js";
    import urlWorker from '../workers/exampleWorker.js?worker';

    const exWorker = new AsyncWorker(new urlWorker(), exampleWorker);
</script>
<TopBanner />
<main>
    <div class="container pt-5">
        <h1>
            <a href="https://svelte.dev" target="_blank" rel="noreferrer">
                <img src="{svelteLogo}" alt="Svelte Logo" />
            </a>
            Prime Workers
        </h1>
        <CrossOriginNotIsolated />
        <Instructions />
        <div class="row row-cols-sm-2 row-cols-md-3">
            <div class="col">
                <Primes toNumber={100_000} worker={exWorker} />
            </div>
            <div class="col">
                <Primes toNumber={110_000} worker={exWorker} />
            </div>
            <div class="col">
                <Primes toNumber={120_000} worker={exWorker} />
            </div>
        </div>
    </div>
</main>
