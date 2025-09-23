import React, { useEffect, useMemo, useRef, useState } from "react";
import { ethers } from "ethers";
import { saveAs } from "file-saver";
<<<<<<< HEAD

/*
EVM Multi Wallet Tracker (Web) — Dark Mode + Polished UI
- No Tailwind required; pure React + inline styles.
- Dark mode toggle with localStorage persistence and system auto-detect.
- Fixed-decimal number formatting (no scientific notation).
- CSV export rounds to 4 decimals.
=======
import * as XLSX from "xlsx";

/*
EVM Multi Wallet Tracker — Dark UI + CSV/XLSX Export
- Fixed 4 decimals (tidak ada scientific notation)
- RPC publik (Chainlist)
>>>>>>> 56561ae (Update UI, dark mode, CSV/Excel export, RPC chainlist)
*/

const ERC20_ABI = [
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
  "function balanceOf(address) view returns (uint256)",
];
<<<<<<< HEAD

export default function EvmMultiWalletTracker() {
  // ----- Theme (Dark/Light) -----
  const prefersDark = typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  const [dark, setDark] = useState(() => {
    try {
      const saved = localStorage.getItem("evm_tracker_theme");
      return saved ? saved === "dark" : prefersDark;
    } catch {
      return prefersDark;
    }
  });
  useEffect(() => {
    try { localStorage.setItem("evm_tracker_theme", dark ? "dark" : "light"); } catch {}
  }, [dark]);

  const theme = useMemo(() => {
    return dark
      ? {
          bg: "#0b1220",
          text: "#e5e7eb",
          subtext: "#9ca3af",
          panel: "#111827",
          border: "#1f2937",
          input: "#0f172a",
          ring: "#334155",
          accent: "#3b82f6",
          accentText: "#ffffff",
          success: "#22c55e",
          danger: "#ef4444",
          tableHeader: "#0f1627",
          shadow: "0 8px 24px rgba(0,0,0,0.35)",
        }
      : {
          bg: "#f7f7fb",
          text: "#0f172a",
          subtext: "#475569",
          panel: "#ffffff",
          border: "#e5e7eb",
          input: "#ffffff",
          ring: "#cbd5e1",
          accent: "#2563eb",
          accentText: "#ffffff",
          success: "#16a34a",
          danger: "#dc2626",
          tableHeader: "#f8fafc",
          shadow: "0 8px 24px rgba(2, 6, 23, 0.08)",
        };
  }, [dark]);

  // ----- App State -----
=======

export default function App() {
  // ----- Theme (Dark/Light) -----
  const prefersDark =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;

  const [dark, setDark] = useState(() => {
    try {
      const saved = localStorage.getItem("evm_tracker_theme");
      return saved ? saved === "dark" : prefersDark;
    } catch {
      return prefersDark;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem("evm_tracker_theme", dark ? "dark" : "light");
    } catch {}
  }, [dark]);

  const theme = useMemo(
    () =>
      dark
        ? {
            bg: "#0b1220",
            text: "#e5e7eb",
            subtext: "#9ca3af",
            panel: "#111827",
            border: "#1f2937",
            input: "#0f172a",
            ring: "#334155",
            accent: "#3b82f6",
            accentText: "#ffffff",
            success: "#22c55e",
            danger: "#ef4444",
            tableHeader: "#0f1627",
            shadow: "0 8px 24px rgba(0,0,0,0.35)",
          }
        : {
            bg: "#f7f7fb",
            text: "#0f172a",
            subtext: "#475569",
            panel: "#ffffff",
            border: "#e5e7eb",
            input: "#ffffff",
            ring: "#cbd5e1",
            accent: "#2563eb",
            accentText: "#ffffff",
            success: "#16a34a",
            danger: "#dc2626",
            tableHeader: "#f8fafc",
            shadow: "0 8px 24px rgba(2, 6, 23, 0.08)",
          },
    [dark]
  );

  // ----- State -----
>>>>>>> 56561ae (Update UI, dark mode, CSV/Excel export, RPC chainlist)
  const [chains, setChains] = useState([
    { id: "ethereum", rpc: "https://ethereum-rpc.publicnode.com", symbol: "ETH" },
    { id: "polygon", rpc: "https://polygon-bor-rpc.publicnode.com", symbol: "MATIC" },
  ]);
<<<<<<< HEAD
  const [wallets, setWallets] = useState(["0x0000000000000000000000000000000000000000"]);
=======
  const [wallets, setWallets] = useState([
    "0x0000000000000000000000000000000000000000",
  ]);
>>>>>>> 56561ae (Update UI, dark mode, CSV/Excel export, RPC chainlist)
  const [tokens, setTokens] = useState({}); // { chainId: [{address, symbol, decimals}] }
  const [intervalSec, setIntervalSec] = useState(0);
  const [running, setRunning] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const timerRef = useRef(null);

<<<<<<< HEAD
  // ----- Utils -----
=======
  // ----- UI helpers -----
>>>>>>> 56561ae (Update UI, dark mode, CSV/Excel export, RPC chainlist)
  const card = (extra = {}) => ({
    background: theme.panel,
    border: `1px solid ${theme.border}`,
    borderRadius: 16,
    padding: 16,
    boxShadow: theme.shadow,
    ...extra,
  });
  const btn = (bg, color = theme.accentText) => ({
    padding: "8px 12px",
    borderRadius: 10,
    border: `1px solid ${theme.border}`,
    background: bg,
    color,
    cursor: "pointer",
    fontWeight: 600,
  });
<<<<<<< HEAD
  const input = {
=======
  const inputStyle = {
>>>>>>> 56561ae (Update UI, dark mode, CSV/Excel export, RPC chainlist)
    padding: 10,
    borderRadius: 10,
    border: `1px solid ${theme.ring}`,
    background: theme.input,
    color: theme.text,
    outline: "none",
  };
  const label = { fontSize: 12, color: theme.subtext };

<<<<<<< HEAD
  const fmt = (v, digits = 4) => {
    if (v === null || v === undefined || Number.isNaN(v)) return "-";
    const n = typeof v === "number" ? v : Number(v);
    return n.toLocaleString(undefined, { minimumFractionDigits: digits, maximumFractionDigits: digits });
  };

  // ----- Mutators -----
  function addChain() { setChains((c) => [...c, { id: `chain-${Date.now()}`, rpc: "", symbol: "" }]); }
  function updateChain(idx, patch) { setChains((c) => c.map((ch, i) => (i === idx ? { ...ch, ...patch } : ch))); }
  function removeChain(idx) { setChains((c) => c.filter((_, i) => i !== idx)); }

  function addWallet() { setWallets((w) => [...w, ""]); }
  function updateWallet(i, v) { setWallets((w) => w.map((x, idx) => (i === idx ? v : x))); }
  function removeWallet(i) { setWallets((w) => w.filter((_, idx) => idx !== i)); }

  function addToken(chainId) { setTokens((t) => ({ ...t, [chainId]: [...(t[chainId] || []), { address: "", symbol: "", decimals: null }] })); }
  function updateToken(chainId, idx, patch) {
    setTokens((t) => ({ ...t, [chainId]: (t[chainId] || []).map((tk, i) => (i === idx ? { ...tk, ...patch } : tk)) }));
  }
  function removeToken(chainId, idx) { setTokens((t) => ({ ...t, [chainId]: (t[chainId] || []).filter((_, i) => i !== idx) })); }
=======
  // number formatter: fixed 4 decimals
  const fmt = (v, digits = 4) => {
    if (v === null || v === undefined || Number.isNaN(v)) return "-";
    const n = typeof v === "number" ? v : Number(v);
    return n.toLocaleString(undefined, {
      minimumFractionDigits: digits,
      maximumFractionDigits: digits,
    });
  };

  // ----- Mutators -----
  function addChain() {
    setChains((c) => [...c, { id: `chain-${Date.now()}`, rpc: "", symbol: "" }]);
  }
  function updateChain(idx, patch) {
    setChains((c) => c.map((ch, i) => (i === idx ? { ...ch, ...patch } : ch)));
  }
  function removeChain(idx) {
    setChains((c) => c.filter((_, i) => i !== idx));
  }

  function addWallet() {
    setWallets((w) => [...w, ""]);
  }
  function updateWallet(i, v) {
    setWallets((w) => w.map((x, idx) => (i === idx ? v : x)));
  }
  function removeWallet(i) {
    setWallets((w) => w.filter((_, idx) => idx !== i));
  }

  function addToken(chainId) {
    setTokens((t) => ({
      ...t,
      [chainId]: [...(t[chainId] || []), { address: "", symbol: "", decimals: null }],
    }));
  }
  function updateToken(chainId, idx, patch) {
    setTokens((t) => ({
      ...t,
      [chainId]: (t[chainId] || []).map((tk, i) => (i === idx ? { ...tk, ...patch } : tk)),
    }));
  }
  function removeToken(chainId, idx) {
    setTokens((t) => ({
      ...t,
      [chainId]: (t[chainId] || []).filter((_, i) => i !== idx),
    }));
  }
>>>>>>> 56561ae (Update UI, dark mode, CSV/Excel export, RPC chainlist)

  // ----- Core: fetch balances -----
  async function fetchBalancesOnce() {
    setError(null);
    setLoading(true);
    const out = [];
    try {
      for (const ch of chains) {
        if (!ch.rpc || !ch.id) continue;
        let provider;
        try {
          provider = new ethers.JsonRpcProvider(ch.rpc);
          await provider.getBlockNumber();
        } catch (e) {
          out.push({ chain: ch.id, error: `RPC connect error: ${e.message}` });
          continue;
        }
        for (const w of wallets) {
          if (!w) continue;
          let checksum;
<<<<<<< HEAD
          try { checksum = ethers.getAddress(w); }
          catch { out.push({ chain: ch.id, wallet: w, asset: ch.symbol || "native", contract: "native", balance: null, error: "invalid address" }); continue; }

          try {
            const nativeBal = await provider.getBalance(checksum);
            out.push({ chain: ch.id, wallet: checksum, asset: ch.symbol || "native", contract: "native", balance: Number(ethers.formatEther(nativeBal)) });
          } catch (e) {
            out.push({ chain: ch.id, wallet: checksum, asset: ch.symbol || "native", contract: "native", balance: null, error: `native error: ${e.message}` });
          }

=======
          try {
            checksum = ethers.getAddress(w);
          } catch {
            out.push({
              chain: ch.id,
              wallet: w,
              asset: ch.symbol || "native",
              contract: "native",
              balance: null,
              error: "invalid address",
            });
            continue;
          }

          // native
          try {
            const nativeBal = await provider.getBalance(checksum);
            out.push({
              chain: ch.id,
              wallet: checksum,
              asset: ch.symbol || "native",
              contract: "native",
              balance: Number(ethers.formatEther(nativeBal)),
            });
          } catch (e) {
            out.push({
              chain: ch.id,
              wallet: checksum,
              asset: ch.symbol || "native",
              contract: "native",
              balance: null,
              error: `native error: ${e.message}`,
            });
          }

          // tokens
>>>>>>> 56561ae (Update UI, dark mode, CSV/Excel export, RPC chainlist)
          const tlist = tokens[ch.id] || [];
          for (const t of tlist) {
            if (!t.address) continue;
            try {
              const c = new ethers.Contract(t.address, ERC20_ABI, provider);
              let decimals = t.decimals;
              if (decimals === undefined || decimals === null) {
<<<<<<< HEAD
                try { decimals = await c.decimals(); } catch { decimals = 18; }
              }
              let symbol = t.symbol || "";
              if (!symbol) {
                try { symbol = await c.symbol(); } catch { symbol = t.address.slice(0, 6); }
              }
              const raw = await c.balanceOf(checksum);
              const val = Number(ethers.formatUnits(raw, decimals));
              out.push({ chain: ch.id, wallet: checksum, asset: symbol, contract: t.address, balance: val, decimals });
            } catch (e) {
              out.push({ chain: ch.id, wallet: checksum, asset: t.symbol || t.address.slice(0, 6), contract: t.address, balance: null, error: `token error: ${e.message}` });
=======
                try {
                  decimals = await c.decimals();
                } catch {
                  decimals = 18;
                }
              }
              let symbol = t.symbol || "";
              if (!symbol) {
                try {
                  symbol = await c.symbol();
                } catch {
                  symbol = t.address.slice(0, 6);
                }
              }
              const raw = await c.balanceOf(checksum);
              const val = Number(ethers.formatUnits(raw, decimals));
              out.push({
                chain: ch.id,
                wallet: checksum,
                asset: symbol,
                contract: t.address,
                balance: val,
                decimals,
              });
            } catch (e) {
              out.push({
                chain: ch.id,
                wallet: checksum,
                asset: t.symbol || t.address.slice(0, 6),
                contract: t.address,
                balance: null,
                error: `token error: ${e.message}`,
              });
>>>>>>> 56561ae (Update UI, dark mode, CSV/Excel export, RPC chainlist)
            }
          }
        }
      }
      setRows(out);
      setLastUpdated(new Date().toISOString());
    } catch (e) {
      setError(e.message || String(e));
    } finally {
      setLoading(false);
    }
  }

<<<<<<< HEAD
  // Start/stop tracking loop
  useEffect(() => {
    if (running) {
      fetchBalancesOnce();
      if (intervalSec > 0) timerRef.current = setInterval(fetchBalancesOnce, intervalSec * 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); timerRef.current = null; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, intervalSec]);

  // Export CSV with 4-decimals
  function exportCsv() {
    const fix4 = (x) => (x == null ? "" : Number(x).toFixed(4));
    const header = ["chain", "wallet", "asset", "contract", "decimals", "balance", "error"].join(",") + "
";
    const lines = rows
      .map((r) => [r.chain, r.wallet, r.asset, r.contract, r.decimals ?? "", fix4(r.balance), r.error ?? ""]
        .map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","))
      .join("
");
    const blob = new Blob([header + lines], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, `evm_balances_${new Date().toISOString()}.csv`);
=======
  // Loop
  useEffect(() => {
    if (running) {
      fetchBalancesOnce();
      if (intervalSec > 0) {
        timerRef.current = setInterval(fetchBalancesOnce, intervalSec * 1000);
      }
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, intervalSec]);

  // ----- Export: CSV -----
  function exportCsv() {
    const fix4 = (x) => (x == null ? "" : Number(x).toFixed(4));

    // header HARUS satu baris + akhiri \n (jangan ada enter di tengah string)
    const header =
      ["chain", "wallet", "asset", "contract", "decimals", "balance", "error"].join(",") +
      "\n";

    const lines = rows
      .map((r) =>
        [
          r.chain,
          r.wallet,
          r.asset,
          r.contract,
          r.decimals ?? "",
          fix4(r.balance),
          r.error ?? "",
        ]
          // escape " agar CSV valid
          .map((v) => `"${String(v).replace(/"/g, '""')}"`)
          .join(",")
      )
      .join("\n");

    const csv = header + lines;
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, `evm_balances_${new Date().toISOString()}.csv`);
  }

  // ----- Export: Excel (.xlsx) -----
  function exportXlsx() {
    const fix4 = (x) => (x == null ? "" : Number(x).toFixed(4));
    const data = rows.map((r) => ({
      chain: r.chain,
      wallet: r.wallet,
      asset: r.asset,
      contract: r.contract,
      decimals: r.decimals ?? "",
      balance: fix4(r.balance),
      error: r.error ?? "",
    }));

    const ws = XLSX.utils.json_to_sheet(data, {
      header: ["chain", "wallet", "asset", "contract", "decimals", "balance", "error"],
    });
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "balances");
    const fname = `evm_balances_${new Date()
      .toISOString()
      .slice(0, 19)
      .replace(/[:T]/g, "-")}.xlsx`;
    XLSX.writeFile(wb, fname);
>>>>>>> 56561ae (Update UI, dark mode, CSV/Excel export, RPC chainlist)
  }

  // ----- Render -----
  return (
    <div style={{ background: theme.bg, color: theme.text, minHeight: "100vh" }}>
      {/* Header */}
<<<<<<< HEAD
      <div style={{
        padding: 20,
        background: dark
          ? "radial-gradient(1200px 400px at 10% -10%, rgba(59,130,246,0.20), transparent), radial-gradient(900px 300px at 100% 0%, rgba(34,197,94,0.18), transparent)"
          : "radial-gradient(1200px 400px at 10% -10%, rgba(59,130,246,0.12), transparent), radial-gradient(900px 300px at 100% 0%, rgba(34,197,94,0.12), transparent)",
        borderBottom: `1px solid ${theme.border}`,
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: 26, fontWeight: 800, margin: 0 }}>EVM Multi Wallet Tracker</h1>
            <div style={{ fontSize: 13, color: theme.subtext, marginTop: 4 }}>Native + ERC‑20 balances • CSV export • Auto refresh</div>
=======
      <div
        style={{
          padding: 20,
          background: dark
            ? "radial-gradient(1200px 400px at 10% -10%, rgba(59,130,246,0.20), transparent), radial-gradient(900px 300px at 100% 0%, rgba(34,197,94,0.18), transparent)"
            : "radial-gradient(1200px 400px at 10% -10%, rgba(59,130,246,0.12), transparent), radial-gradient(900px 300px at 100% 0%, rgba(34,197,94,0.12), transparent)",
          borderBottom: `1px solid ${theme.border}`,
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: 26, fontWeight: 800, margin: 0 }}>
              EVM Multi Wallet Tracker
            </h1>
            <div style={{ fontSize: 13, color: theme.subtext, marginTop: 4 }}>
              Native + ERC-20 balances • CSV / Excel export • Auto refresh
            </div>
>>>>>>> 56561ae (Update UI, dark mode, CSV/Excel export, RPC chainlist)
          </div>
          <button onClick={() => setDark((d) => !d)} style={btn(theme.panel, theme.text)}>
            {dark ? "🌙 Dark" : "☀️ Light"}
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: 20 }}>
        {/* Chains */}
        <section style={card({ marginBottom: 16 })}>
<<<<<<< HEAD
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <h2 style={{ margin: 0, fontSize: 16 }}>Chains</h2>
            <button onClick={addChain} style={btn(dark ? "#0b1220" : "#f3f4f6", theme.text)}>+ add chain</button>
          </div>

          {chains.map((ch, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 2fr 0.8fr auto", gap: 8, alignItems: "center", marginBottom: 10 }}>
              <div>
                <div style={label}>Chain ID</div>
                <input style={input} placeholder="id (e.g. ethereum)" value={ch.id} onChange={(e) => updateChain(i, { id: e.target.value })} />
              </div>
              <div>
                <div style={label}>RPC URL</div>
                <input style={input} placeholder="https://..." value={ch.rpc} onChange={(e) => updateChain(i, { rpc: e.target.value })} />
              </div>
              <div>
                <div style={label}>Symbol</div>
                <input style={input} placeholder="ETH" value={ch.symbol} onChange={(e) => updateChain(i, { symbol: e.target.value })} />
              </div>
              <div>
                <button onClick={() => removeChain(i)} style={{ ...btn(theme.panel, theme.danger), borderColor: theme.danger }}>Del</button>
              </div>

              {/* Tokens per chain */}
              <div style={{ gridColumn: "1 / -1", marginTop: 6 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>Tokens for {ch.id}</div>
                  <button onClick={() => addToken(ch.id)} style={btn("transparent", theme.accent)} className="underline">+ token</button>
                </div>
                {(tokens[ch.id] || []).map((tk, j) => (
                  <div key={j} style={{ display: "flex", gap: 8, marginTop: 8 }}>
                    <input style={{ ...input, flex: 1 }} placeholder="token address" value={tk.address} onChange={(e) => updateToken(ch.id, j, { address: e.target.value })} />
                    <input style={{ ...input, width: 120 }} placeholder="symbol" value={tk.symbol} onChange={(e) => updateToken(ch.id, j, { symbol: e.target.value })} />
                    <input style={{ ...input, width: 90 }} placeholder="dec" value={tk.decimals ?? ""} onChange={(e) => updateToken(ch.id, j, { decimals: e.target.value ? Number(e.target.value) : null })} />
                    <button onClick={() => removeToken(ch.id, j)} style={{ ...btn(theme.panel, theme.danger), borderColor: theme.danger }}>x</button>
                  </div>
                ))}
              </div>
=======
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 12,
            }}
          >
            <h2 style={{ margin: 0, fontSize: 16 }}>Chains</h2>
            <button onClick={addChain} style={btn(dark ? "#0b1220" : "#f3f4f6", theme.text)}>
              + add chain
            </button>
          </div>

          {chains.map((ch, i) => (
            <div
              key={i}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 2fr 0.8fr auto",
                gap: 8,
                alignItems: "center",
                marginBottom: 10,
              }}
            >
              <div>
                <div style={label}>Chain ID</div>
                <input
                  style={inputStyle}
                  placeholder="id (e.g. ethereum)"
                  value={ch.id}
                  onChange={(e) => updateChain(i, { id: e.target.value })}
                />
              </div>
              <div>
                <div style={label}>RPC URL</div>
                <input
                  style={inputStyle}
                  placeholder="https://..."
                  value={ch.rpc}
                  onChange={(e) => updateChain(i, { rpc: e.target.value })}
                />
              </div>
              <div>
                <div style={label}>Symbol</div>
                <input
                  style={inputStyle}
                  placeholder="ETH"
                  value={ch.symbol}
                  onChange={(e) => updateChain(i, { symbol: e.target.value })}
                />
              </div>
              <div>
                <button
                  onClick={() => removeChain(i)}
                  style={{ ...btn(theme.panel, theme.danger), borderColor: theme.danger }}
                >
                  Del
                </button>
              </div>

              {/* Tokens per chain */}
              <div style={{ gridColumn: "1 / -1", marginTop: 6 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div style={{ fontSize: 13, fontWeight: 600 }}>
                    Tokens for {ch.id}
                  </div>
                  <button
                    onClick={() => addToken(ch.id)}
                    style={btn("transparent", theme.accent)}
                  >
                    + token
                  </button>
                </div>
                {(tokens[ch.id] || []).map((tk, j) => (
                  <div key={j} style={{ display: "flex", gap: 8, marginTop: 8 }}>
                    <input
                      style={{ ...inputStyle, flex: 1 }}
                      placeholder="token address"
                      value={tk.address}
                      onChange={(e) => updateToken(ch.id, j, { address: e.target.value })}
                    />
                    <input
                      style={{ ...inputStyle, width: 120 }}
                      placeholder="symbol"
                      value={tk.symbol}
                      onChange={(e) => updateToken(ch.id, j, { symbol: e.target.value })}
                    />
                    <input
                      style={{ ...inputStyle, width: 90 }}
                      placeholder="dec"
                      value={tk.decimals ?? ""}
                      onChange={(e) =>
                        updateToken(ch.id, j, {
                          decimals: e.target.value ? Number(e.target.value) : null,
                        })
                      }
                    />
                    <button
                      onClick={() => removeToken(ch.id, j)}
                      style={{ ...btn(theme.panel, theme.danger), borderColor: theme.danger }}
                    >
                      x
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>

        {/* Wallets */}
        <section style={card({ marginBottom: 16 })}>
          <h2 style={{ margin: 0, fontSize: 16, marginBottom: 8 }}>Wallets</h2>
          {wallets.map((w, i) => (
            <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
              <input
                style={{ ...inputStyle, flex: 1 }}
                value={w}
                onChange={(e) => updateWallet(i, e.target.value)}
                placeholder="0x..."
              />
              <button
                onClick={() => removeWallet(i)}
                style={{ ...btn(theme.panel, theme.danger), borderColor: theme.danger }}
              >
                Del
              </button>
            </div>
          ))}
          <button onClick={addWallet} style={btn(dark ? "#0b1220" : "#f3f4f6", theme.text)}>
            + add wallet
          </button>
        </section>

        {/* Controls */}
        <section style={card({ marginBottom: 16 })}>
          <h2 style={{ margin: 0, fontSize: 16, marginBottom: 12 }}>Controls</h2>
          <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
            <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={label}>Refresh interval (sec)</span>
              <input
                style={{ ...inputStyle, width: 100 }}
                value={intervalSec}
                onChange={(e) => setIntervalSec(Number(e.target.value) || 0)}
              />
            </label>
            <button
              onClick={() => setRunning((r) => !r)}
              style={btn(running ? theme.danger : theme.success)}
            >
              {running ? "Stop" : "Start"}
            </button>
            <button onClick={fetchBalancesOnce} disabled={loading} style={btn(theme.accent)}>
              Refresh now
            </button>
            <button
              onClick={exportCsv}
              disabled={!rows.length}
              style={btn(dark ? "#0b1220" : "#111827", "#ffffff")}
            >
              Export CSV
            </button>
            <button
              onClick={exportXlsx}
              disabled={!rows.length}
              style={btn(dark ? "#0b1220" : "#0b5fff", "#ffffff")}
            >
              Export Excel (.xlsx)
            </button>
            <div style={{ marginLeft: "auto", fontSize: 12, color: theme.subtext }}>
              Last: {lastUpdated ?? "-"}
>>>>>>> 56561ae (Update UI, dark mode, CSV/Excel export, RPC chainlist)
            </div>
          ))}
        </section>

        {/* Wallets */}
        <section style={card({ marginBottom: 16 })}>
          <h2 style={{ margin: 0, fontSize: 16, marginBottom: 8 }}>Wallets</h2>
          {wallets.map((w, i) => (
            <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
              <input style={{ ...input, flex: 1 }} value={w} onChange={(e) => updateWallet(i, e.target.value)} placeholder="0x..." />
              <button onClick={() => removeWallet(i)} style={{ ...btn(theme.panel, theme.danger), borderColor: theme.danger }}>Del</button>
            </div>
          ))}
          <button onClick={addWallet} style={btn(dark ? "#0b1220" : "#f3f4f6", theme.text)}>+ add wallet</button>
        </section>

        {/* Controls */}
        <section style={card({ marginBottom: 16 })}>
          <h2 style={{ margin: 0, fontSize: 16, marginBottom: 12 }}>Controls</h2>
          <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
            <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={label}>Refresh interval (sec)</span>
              <input style={{ ...input, width: 100 }} value={intervalSec} onChange={(e) => setIntervalSec(Number(e.target.value) || 0)} />
            </label>
            <button onClick={() => setRunning((r) => !r)} style={btn(running ? theme.danger : theme.success)}>
              {running ? "Stop" : "Start"}
            </button>
            <button onClick={fetchBalancesOnce} disabled={loading} style={btn(theme.accent)}>
              Refresh now
            </button>
            <button onClick={exportCsv} disabled={!rows.length} style={btn(dark ? "#0b1220" : "#111827", "#ffffff")}>
              Export CSV
            </button>
            <div style={{ marginLeft: "auto", fontSize: 12, color: theme.subtext }}>Last: {lastUpdated ?? "-"}</div>
          </div>
          {error && <div style={{ marginTop: 8, color: theme.danger }}>Error: {error}</div>}
        </section>

        {/* Balances */}
        <section style={card()}>
          <h2 style={{ margin: 0, fontSize: 16, marginBottom: 8 }}>Balances</h2>
<<<<<<< HEAD
          <div style={{ overflow: "auto", maxHeight: 440, border: `1px solid ${theme.border}`, borderRadius: 12 }}>
            <table style={{ width: "100%", fontSize: 14, borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: theme.tableHeader }}>
                  {[
                    "Chain",
                    "Wallet",
                    "Asset",
                    "Contract",
                    "Decimals",
                    "Balance",
                    "Error",
                  ].map((h) => (
                    <th key={h} style={{ textAlign: "left", padding: "10px 12px", position: "sticky", top: 0 }}>{h}</th>
                  ))}
=======
          <div
            style={{
              overflow: "auto",
              maxHeight: 440,
              border: `1px solid ${theme.border}`,
              borderRadius: 12,
            }}
          >
            <table style={{ width: "100%", fontSize: 14, borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: theme.tableHeader }}>
                  {["Chain", "Wallet", "Asset", "Contract", "Decimals", "Balance", "Error"].map(
                    (h) => (
                      <th
                        key={h}
                        style={{ textAlign: "left", padding: "10px 12px", position: "sticky", top: 0 }}
                      >
                        {h}
                      </th>
                    )
                  )}
>>>>>>> 56561ae (Update UI, dark mode, CSV/Excel export, RPC chainlist)
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={i} style={{ borderTop: `1px solid ${theme.border}` }}>
                    <td style={{ padding: "10px 12px" }}>{r.chain}</td>
<<<<<<< HEAD
                    <td style={{ padding: "10px 12px", fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: 12 }}>{r.wallet}</td>
                    <td style={{ padding: "10px 12px" }}>{r.asset}</td>
                    <td style={{ padding: "10px 12px", fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: 12 }}>{r.contract}</td>
                    <td style={{ padding: "10px 12px" }}>{r.decimals ?? ""}</td>
                    <td style={{ padding: "10px 12px" }}>{fmt(r.balance, 4)}</td>
                    <td style={{ padding: "10px 12px", color: theme.danger }}>{r.error ?? ""}</td>
=======
                    <td
                      style={{
                        padding: "10px 12px",
                        fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                        fontSize: 12,
                      }}
                    >
                      {r.wallet}
                    </td>
                    <td style={{ padding: "10px 12px" }}>{r.asset}</td>
                    <td
                      style={{
                        padding: "10px 12px",
                        fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                        fontSize: 12,
                      }}
                    >
                      {r.contract}
                    </td>
                    <td style={{ padding: "10px 12px" }}>{r.decimals ?? ""}</td>
                    <td style={{ padding: "10px 12px" }}>{fmt(r.balance, 4)}</td>
                    <td style={{ padding: "10px 12px", color: theme.danger }}>
                      {r.error ?? ""}
                    </td>
>>>>>>> 56561ae (Update UI, dark mode, CSV/Excel export, RPC chainlist)
                  </tr>
                ))}
                {rows.length === 0 && (
                  <tr>
<<<<<<< HEAD
                    <td colSpan={7} style={{ padding: "14px 12px", textAlign: "center", color: theme.subtext }}>
=======
                    <td
                      colSpan={7}
                      style={{ padding: "14px 12px", textAlign: "center", color: theme.subtext }}
                    >
>>>>>>> 56561ae (Update UI, dark mode, CSV/Excel export, RPC chainlist)
                      No results yet — click "Refresh now" or Start tracking.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

<<<<<<< HEAD
        <div style={{ color: theme.subtext, fontSize: 12, marginTop: 12 }}>Tip: Some RPCs block browser CORS. Use public CORS-enabled RPCs or a small proxy.</div>
=======
        <div style={{ color: theme.subtext, fontSize: 12, marginTop: 12 }}>
          Tip: Some RPCs block browser CORS. Use public CORS-enabled RPCs or a small proxy.
        </div>
>>>>>>> 56561ae (Update UI, dark mode, CSV/Excel export, RPC chainlist)
      </div>
    </div>
  );
}
