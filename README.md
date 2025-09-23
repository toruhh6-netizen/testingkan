# EVM Multi Wallet Tracker (GitHub Pages)
Single-page React app to track native + ERC-20 balances for multiple EVM wallets across chains.

## Quick start
```bash
npm install
npm run dev
```

## Configure GitHub Pages
1) Edit `vite.config.js` and set `base` to `/<REPO_NAME>/`. If your repo is `evm-tracker`, it's `/evm-tracker/`.
2) Commit & push to GitHub.
3) Deploy with:
```bash
npm run deploy
```
This publishes the `dist/` folder to the `gh-pages` branch. In your repo settings, enable GitHub Pages: Branch = `gh-pages`, folder = `/ (root)`.

## Notes
- Some RPC endpoints don't allow browser CORS; switch to a CORS-enabled public RPC or use a tiny backend proxy.
- Add more chains, wallets, and tokens in the UI; export results to CSV.
