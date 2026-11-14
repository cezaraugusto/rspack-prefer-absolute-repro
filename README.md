# Rspack `resolve.preferAbsolute` reproduction

With `resolve.roots` set and `resolve.preferAbsolute: true`, an absolute request that also exists below a root should resolve to the absolute path. webpack does that. Rspack resolves to the file below the root.

```sh
npm install
npm run repro
```

Output (macOS and Linux):

```
webpack: <tmp>/project/src/a.js
rspack:  <tmp>/project<tmp>/project/src/a.js
```

Expected: both lines print `<tmp>/project/src/a.js`.
