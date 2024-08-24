{#if !crossOriginIsolated}
    <div class="row">
        <div class="col">
            <div class="alert alert-warning">
                <h3><i class="bi bi-house-lock-fill"></i>&nbsp;Cross-Origin Not Isolated</h3>
                <p>
                    Unfortunately, cross-origin isolation requirements are not fulfilled.  This means that synchronization 
                    objects cannot be used as they depend on <code>SharedArrayBuffer</code>.
                </p>
                <p>
                    Without the possiblity of using <code>SharedArrayBuffer</code>, the only way to cancel a work item 
                    (task) is by cancelling it before it starts.  Generally speaking, the following cannot be used:
                </p>
                <ul>
                    <li><code>ManualResetEvent</code></li>
                    <li><code>AutoResetEvent</code></li>
                    <li><code>CancellationSource</code></li>
                </ul>
                <p>
                    In order to solve this problem in your own project/site, 
                    <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer#security_requirements" target="_blank">
                        read about the security requirements in the MDN website
                    </a>.
                </p>
            </div>
        </div>
    </div>
{/if}
