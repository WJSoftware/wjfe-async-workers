<div class="alert alert-info">
    <h3><i class="bi bi-journal-text"></i>&nbsp;Instructions</h3>
    <p>
        Play around with the three work items below.  Each will run the same example worker, which is a worker that 
        calculates prime numbers using a not-so-good algorithm that runs up to the shown number.  All three work items 
        use the same worker object, so they run serially between each other.
    </p>
    {#if crossOriginIsolated}
        <p>
            Since cross origin is isolated (see 
            <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer#security_requirements" target="_blank">
                the requirements
            </a> here), you may pause or cancel the worker at any time.
        </p>
        <p>
            <strong>NOTE:</strong>  Notice how significant the pause wait is in terms of performance.  Waiting on the 
            token is expensive for sure, so do this only on well-thought-out scenarios.
        </p>
    {:else}
        Since cross origin is not isolated (see 
        <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer#security_requirements" target="_blank">
            the requirements
        </a> here), you may only cancel the worker before it starts.  Furthermore, you cannot pause the worker.
    {/if}
</div>