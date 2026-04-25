import { useState } from 'react'
import Setup from './phases/Setup'
import Conversation from './phases/Conversation'
import './App.css'

export default function App() {
  const [phase, setPhase] = useState('setup')
  const [mediaTitle, setMediaTitle] = useState('')
  const [mediaType, setMediaType] = useState('movie')
  const [uploadedImages, setUploadedImages] = useState([])
  const [researchSummary, setResearchSummary] = useState('')
  const [searchesRun, setSearchesRun] = useState(0)
  const [history, setHistory] = useState([])
  const [posts, setPosts] = useState([])

  function handleSetupComplete({ title, type, images, summary, searches_run }) {
    setMediaTitle(title)
    setMediaType(type)
    setUploadedImages(images)
    setResearchSummary(summary)
    setSearchesRun(searches_run ?? 0)
    setPhase('conversation')
  }

  function handlePostsGenerated(generatedPosts) {
    setPosts(generatedPosts)
    setPhase('preview')
  }

  return (
    <div className="app">
      {phase === 'setup' && (
        <Setup onComplete={handleSetupComplete} />
      )}
      {phase === 'conversation' && (
        <Conversation
          mediaTitle={mediaTitle}
          mediaType={mediaType}
          researchSummary={researchSummary}
          searchesRun={searchesRun}
          uploadedImages={uploadedImages}
          history={history}
          onHistoryUpdate={setHistory}
          onGenerate={handlePostsGenerated}
        />
      )}
      {phase === 'preview' && (
        <div className="placeholder">
          <p>Preview phase — coming in Phase 6</p>
        </div>
      )}
    </div>
  )
}
