<div class="alert alert-info">
    <h3><i class="bi bi-journal-text"></i>&nbsp;Instructions</h3>
    <p>
        Play around with the three work items below.  Each will run the same example worker, which is a worker that 
        calculates prime numbers using a not-so-good algorithm that runs up to the specified number in the slider.  All 
        three work items use the same worker object, so they run serially between each other.
    </p>
    {#if crossOriginIsolated}
        <p>
            Since cross origin is isolated (see 
            <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer#security_requirements" target="_blank">
                the requirements
            </a> here), you may pause or cancel the worker at any time.
        </p>
        <p>
            <strong>NOTE ON PERFORMANCE:</strong>  Atomic operations are less performant than polling.  Don't go crazy 
            with the synchronization objects, and see if polling fits the bill first.  For example, the primes worker 
            in this demo page does polling to condition the wait as opposed to blindly waiting:
        </p>
        <code class="fs-5"><pre>if (!ManualResetEvent.isSignaled(pause)) &#123;
    ManualResetEvent.wait(pause);
&#125;</pre></code>
        <p>
            Still, even with this modification, you'll see a big difference in times between a pausable and a 
            non-pausable run for the same numerical limit.
        </p>
    {:else}
        <p>
            Since cross origin is not isolated (see 
            <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer#security_requirements" target="_blank">
                the requirements
            </a> here), you may only cancel the worker before it starts.  Furthermore, you cannot pause the worker.
        </p>
        <p>
            To experience the power of the synchronization objects, head to the 
            <a href="https://github.com/WJSoftware/wjfe-async-workers" target="_blank">GitHub repository</a> and clone 
            the source code.  This demonstration's code is inside the folder named <code>pages</code>.  Open a console, 
            change to the <code>pages</code> folder, install the packages running <code>npm ci</code>, and then execute 
            the development server with <code>npm run dev</code>.
        </p>
    {/if}
</div>