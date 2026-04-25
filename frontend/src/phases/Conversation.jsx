import ResearchPanel from '../components/ResearchPanel'
import './Conversation.css'

export default function Conversation({ mediaTitle, mediaType, researchSummary, searchesRun }) {
  return (
    <div className="conversation-layout">
      <div className="conversation-sidebar">
        <div className="conv-meta">
          <span className="conv-title">{mediaTitle}</span>
          <span className="conv-type">{mediaType}</span>
        </div>
        <ResearchPanel summary={researchSummary} searchesRun={searchesRun} />
      </div>

      <div className="conversation-main">
        <p className="placeholder-text">Conversation phase — coming in Phase 4</p>
      </div>
    </div>
  )
}
