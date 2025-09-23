import React, { useEffect, useState, useRef } from 'react'
import { ethers } from 'ethers'
import { saveAs } from 'file-saver'

// number formatting helper: fixed 4 decimals, no scientific notation
const fmt = (v) => {
  if (v === null || v === undefined || Number.isNaN(v)) return "-";
  const n = typeof v === "number" ? v : Number(v);
  return n.toLocaleString(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 4 });
};


const ERC20_ABI = [
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)',
  'function balanceOf(address) view returns (uint256)',
]

export default function App() {
  const [chains, setChains] = useState([
    { id: 'ethereum', rpc: 'https://ethereum-rpc.publicnode.com', symbol: 'ETH' },
    { id: 'polygon', rpc: 'https://polygon-mainnet.public.blastapi.io', symbol: 'MATIC' },
    { id: 'base', rpc: 'https://base-mainnet.public.blastapi.io', symbol: 'ETH' },
  ])
  const [wallets, setWallets] = useState(['0x0000000000000000000000000000000000000000'])
  const [tokens, setTokens] = useState({})
  const [intervalSec, setIntervalSec] = useState(0)
  const [running, setRunning] = useState(false)
  const [lastUpdated, setLastUpdated] = useState(null)
  const [rows, setRows] = useState([])
  const timerRef = useRef(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  function addChain() { setChains(c => [...c, { id: `chain-${Date.now()}`, rpc: '', symbol: '' }]) }
  function updateChain(i, patch) { setChains(c => c.map((ch, idx) => idx === i ? { ...ch, ...patch } : ch)) }
  function removeChain(i) { setChains(c => c.filter((_, idx) => idx !== i)) }

  function addWallet() { setWallets(w => [...w, '']) }
  function updateWallet(i, v) { setWallets(w => w.map((x, idx) => i === idx ? v : x)) }
  function removeWallet(i) { setWallets(w => w.filter((_, idx) => idx !== i)) }

  function addToken(chainId) { setTokens(t => ({ ...t, [chainId]: [...(t[chainId] || []), { address: '', symbol: '', decimals: null }] })) }
  function updateToken(chainId, idx, patch) {
    setTokens(t => ({ ...t, [chainId]: (t[chainId] || []).map((tk, i) => i === idx ? { ...tk, ...patch } : tk) }))
  }
  function removeToken(chainId, idx) { setTokens(t => ({ ...t, [chainId]: (t[chainId] || []).filter((_, i) => i !== idx) })) }

  async function fetchBalancesOnce() {
    setError(null); setLoading(true)
    const out = []
    try {
      for (const ch of chains) {
        if (!ch.rpc || !ch.id) continue
        let provider
        try {
          provider = new ethers.JsonRpcProvider(ch.rpc)
          await provider.getBlockNumber()
        } catch (e) {
          out.push({ chain: ch.id, error: `RPC connect error: ${e.message}` })
          continue
        }
        for (const w of wallets) {
          if (!w) continue
          let checksum
          try {
            checksum = ethers.getAddress(w)
          } catch {
            out.push({ chain: ch.id, wallet: w, asset: ch.symbol || 'native', contract: 'native', balance: null, error: 'invalid address' })
            continue
          }
          try {
            const nativeBal = await provider.getBalance(checksum)
            out.push({ chain: ch.id, wallet: checksum, asset: ch.symbol || 'native', contract: 'native', balance: Number(ethers.formatEther(nativeBal)) })
          } catch (e) {
            out.push({ chain: ch.id, wallet: checksum, asset: ch.symbol || 'native', contract: 'native', balance: null, error: `native error: ${e.message}` })
          }
          const tlist = tokens[ch.id] || []
          for (const t of tlist) {
            if (!t.address) continue
            try {
              const c = new ethers.Contract(t.address, ERC20_ABI, provider)
              let decimals = t.decimals
              if (decimals === undefined || decimals === null) {
                try { decimals = await c.decimals() } catch { decimals = 18 }
              }
              let symbol = t.symbol || ''
              if (!symbol) {
                try { symbol = await c.symbol() } catch { symbol = t.address.slice(0, 6) }
              }
              const raw = await c.balanceOf(checksum)
              const val = Number(ethers.formatUnits(raw, decimals))
              out.push({ chain: ch.id, wallet: checksum, asset: symbol, contract: t.address, balance: val, decimals })
            } catch (e) {
              out.push({ chain: ch.id, wallet: checksum, asset: t.symbol || t.address.slice(0, 6), contract: t.address, balance: null, error: `token error: ${e.message}` })
            }
          }
        }
      }
      setRows(out)
      setLastUpdated(new Date().toISOString())
    } catch (e) {
      setError(e.message || String(e))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (running) {
      fetchBalancesOnce()
      if (intervalSec > 0) {
        timerRef.current = setInterval(fetchBalancesOnce, intervalSec * 1000)
      }
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); timerRef.current = null }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, intervalSec])

  function exportCsv() {
    const header = ['chain','wallet','asset','contract','decimals','balance','error'].join(',') + '\n'
    const lines = rows.map(r => [r.chain, r.wallet, r.asset, r.contract, (r.decimals ?? ''), (r.balance ?? ''), (r.error ?? '')]
      .map(v => '"' + String(v).replace(/"/g,'""') + '"').join(',')).join('\n')
    const blob = new Blob([header + lines], { type: 'text/csv;charset=utf-8;' })
    saveAs(blob, `evm_balances_${new Date().toISOString()}.csv`)
  }

  return (
    <div style={{fontFamily:'system-ui, -apple-system, Segoe UI, Roboto, sans-serif', padding:16, maxWidth:1100, margin:'0 auto'}}>
      <h1 style={{fontSize:24, fontWeight:700, marginBottom:12}}>EVM Multi Wallet Tracker (GitHub Pages)</h1>

      <section style={{background:'#fff', border:'1px solid #eee', borderRadius:12, padding:16, marginBottom:16}}>
        <h2 style={{fontWeight:600, marginBottom:8}}>Chains</h2>
        {chains.map((ch, i) => (
          <div key={i} style={{display:'grid', gridTemplateColumns:'1fr 2fr 0.7fr auto', gap:8, alignItems:'center', marginBottom:8}}>
            <input placeholder="id (eg. ethereum)" value={ch.id} onChange={e=>updateChain(i,{id:e.target.value})} style={{padding:8, border:'1px solid #ddd', borderRadius:8}} />
            <input placeholder="RPC URL" value={ch.rpc} onChange={e=>updateChain(i,{rpc:e.target.value})} style={{padding:8, border:'1px solid #ddd', borderRadius:8}} />
            <input placeholder="symbol" value={ch.symbol} onChange={e=>updateChain(i,{symbol:e.target.value})} style={{padding:8, border:'1px solid #ddd', borderRadius:8}} />
            <button onClick={()=>removeChain(i)} style={{color:'#b91c1c'}}>Del</button>
            <div style={{gridColumn:'1 / -1'}}>
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                <div style={{fontSize:14, fontWeight:500}}>Tokens for {ch.id}</div>
                <button onClick={()=>addToken(ch.id)} style={{color:'#2563eb'}}>+ token</button>
              </div>
              {(tokens[ch.id] || []).map((tk, j) => (
                <div key={j} style={{display:'flex', gap:8, marginTop:8}}>
                  <input placeholder="token address" value={tk.address} onChange={e=>updateToken(ch.id, j, {address:e.target.value})} style={{flex:1, padding:8, border:'1px solid #ddd', borderRadius:8}} />
                  <input placeholder="symbol" value={tk.symbol} onChange={e=>updateToken(ch.id, j, {symbol:e.target.value})} style={{width:100, padding:8, border:'1px solid #ddd', borderRadius:8}} />
                  <input placeholder="dec" value={tk.decimals ?? ''} onChange={e=>updateToken(ch.id, j, {decimals: e.target.value ? Number(e.target.value) : null})} style={{width:80, padding:8, border:'1px solid #ddd', borderRadius:8}} />
                  <button onClick={()=>removeToken(ch.id, j)} style={{color:'#b91c1c'}}>x</button>
                </div>
              ))}
            </div>
          </div>
        ))}
        <button onClick={addChain} style={{padding:'6px 10px', background:'#f3f4f6', borderRadius:8}}>+ add chain</button>
      </section>

      <section style={{background:'#fff', border:'1px solid #eee', borderRadius:12, padding:16, marginBottom:16}}>
        <h2 style={{fontWeight:600, marginBottom:8}}>Wallets</h2>
        {wallets.map((w,i)=>(
          <div key={i} style={{display:'flex', gap:8, marginBottom:8}}>
            <input value={w} onChange={e=>updateWallet(i, e.target.value)} placeholder="0x..." style={{flex:1, padding:8, border:'1px solid #ddd', borderRadius:8}} />
            <button onClick={()=>removeWallet(i)} style={{color:'#b91c1c'}}>Del</button>
          </div>
        ))}
        <button onClick={addWallet} style={{padding:'6px 10px', background:'#f3f4f6', borderRadius:8}}>+ add wallet</button>
      </section>

      <section style={{background:'#fff', border:'1px solid #eee', borderRadius:12, padding:16, marginBottom:16}}>
        <h2 style={{fontWeight:600, marginBottom:8}}>Controls</h2>
        <div style={{display:'flex', gap:12, alignItems:'center', flexWrap:'wrap'}}>
          <label>Refresh interval (sec)
            <input value={intervalSec} onChange={e=>setIntervalSec(Number(e.target.value)||0)} style={{width:80, marginLeft:8, padding:6, border:'1px solid #ddd', borderRadius:8}} />
          </label>
          <button onClick={()=>setRunning(r=>!r)} style={{padding:'6px 12px', borderRadius:8, background: running ? '#ef4444' : '#22c55e', color:'#fff'}}>{running ? 'Stop' : 'Start'}</button>
          <button onClick={fetchBalancesOnce} disabled={loading} style={{padding:'6px 12px', borderRadius:8, background:'#2563eb', color:'#fff'}}>Refresh now</button>
          <button onClick={exportCsv} disabled={!rows.length} style={{padding:'6px 12px', borderRadius:8, background:'#111827', color:'#fff'}}>Export CSV</button>
          <div style={{marginLeft:'auto', fontSize:12, color:'#6b7280'}}>Last: {lastUpdated ?? '-'}</div>
        </div>
        {error && <div style={{marginTop:8, color:'#b91c1c'}}>Error: {error}</div>}
      </section>

      <section style={{background:'#fff', border:'1px solid #eee', borderRadius:12, padding:16}}>
        <h2 style={{fontWeight:600, marginBottom:8}}>Balances</h2>
        <div style={{overflow:'auto', maxHeight:420}}>
          <table style={{width:'100%', fontSize:14, borderCollapse:'collapse'}}>
            <thead>
              <tr style={{background:'#f9fafb', textAlign:'left'}}>
                <th style={{padding:'6px 8px'}}>Chain</th>
                <th style={{padding:'6px 8px'}}>Wallet</th>
                <th style={{padding:'6px 8px'}}>Asset</th>
                <th style={{padding:'6px 8px'}}>Contract</th>
                <th style={{padding:'6px 8px'}}>Decimals</th>
                <th style={{padding:'6px 8px'}}>Balance</th>
                <th style={{padding:'6px 8px'}}>Error</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r,i)=>(
                <tr key={i} style={{borderTop:'1px solid #eee'}}>
                  <td style={{padding:'6px 8px'}}>{r.chain}</td>
                  <td style={{padding:'6px 8px', fontFamily:'ui-monospace, SFMono-Regular, Menlo, monospace', fontSize:12}}>{r.wallet}</td>
                  <td style={{padding:'6px 8px'}}>{r.asset}</td>
                  <td style={{padding:'6px 8px', fontFamily:'ui-monospace, SFMono-Regular, Menlo, monospace', fontSize:12}}>{r.contract}</td>
                  <td style={{padding:'6px 8px'}}>{r.decimals ?? ''}</td>
                  <td style={{padding:'6px 8px'}}>{fmt(r.balance)}</td>
                  <td style={{padding:'6px 8px', color:'#b91c1c'}}>{r.error ?? ''}</td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={7} style={{padding:'16px 8px', textAlign:'center'}}>No results yet — click "Refresh now" or Start tracking.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <p style={{marginTop:16, fontSize:12, color:'#6b7280'}}>Tip: Some RPCs block browser CORS. Use public CORS-enabled RPCs or a small proxy.</p>
    </div>
  )
}
