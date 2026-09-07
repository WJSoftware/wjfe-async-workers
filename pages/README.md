# Online Demo for @wjfe/async-workers

This is a Sveltekit project that is deployed to GH pages.

To use it to test-drive changes in the package itself, remove the package and then link to the built project:

```bash
# In the workspace folder (not this, the pages/ folder):
npm run build && npm link
```

Now complete the link:

```bash
# In the pages/ folder:
npm remove @wjfe/async-workers
npm link @wjfe/async-workers
```

If you're not working on the package itself, just work with the deployed `@wjfe/async-workers` package as per normal.
