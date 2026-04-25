import { useRef, useState } from 'react'
import ResearchPanel from '../components/ResearchPanel'
import './Conversation.css'

const MIN_SIDEBAR = 220
const MAX_SIDEBAR = 600

export default function Conversation({ mediaTitle, mediaType, researchSummary, searchesRun }) {
  const [sidebarWidth, setSidebarWidth] = useState(300)
  const dragging = useRef(false)
  const startX = useRef(0)
  const startWidth = useRef(0)

  function onHandleMouseDown(e) {
    dragging.current = true
    startX.current = e.clientX
    startWidth.current = sidebarWidth

    function onMouseMove(e) {
      if (!dragging.current) return
      const delta = e.clientX - startX.current
      setSidebarWidth(Math.max(MIN_SIDEBAR, Math.min(MAX_SIDEBAR, startWidth.current + delta)))
    }

    function onMouseUp() {
      dragging.current = false
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
    }

    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
  }

  return (
    <div className="conversation-layout">
      <div className="conversation-sidebar" style={{ width: sidebarWidth }}>
        <div className="conv-meta">
          <span className="conv-title">{mediaTitle}</span>
          <span className="conv-type">{mediaType}</span>
        </div>
        <ResearchPanel summary={researchSummary} searchesRun={searchesRun} />
      </div>

      <div className="resize-handle" onMouseDown={onHandleMouseDown} />

      <div className="conversation-main">
        <p className="placeholder-text">Conversation phase — coming in Phase 4</p>
      </div>
    </div>
  )
}
