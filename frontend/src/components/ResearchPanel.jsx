import { useState } from 'react'
import './ResearchPanel.css'

export default function ResearchPanel({ summary, searchesRun }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="research-panel">
      <button className="research-toggle" onClick={() => setOpen(o => !o)}>
        <span className="toggle-label">Research context</span>
        <span className="toggle-meta">
          {searchesRun} search{searchesRun !== 1 ? 'es' : ''} · {open ? 'hide' : 'show'}
        </span>
      </button>
      {open && (
        <div className="research-body">
          {summary ? <p>{summary}</p> : <p className="empty">No summary available.</p>}
        </div>
      )}
    </div>
  )
}
