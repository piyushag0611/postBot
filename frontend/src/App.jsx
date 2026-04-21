import { useState } from 'react'
import Setup from './phases/Setup'
import './App.css'

export default function App() {
  const [phase, setPhase] = useState('setup')
  const [mediaTitle, setMediaTitle] = useState('')
  const [mediaType, setMediaType] = useState('movie')
  const [uploadedImages, setUploadedImages] = useState([])
  const [researchSummary, setResearchSummary] = useState('')
  const [history, setHistory] = useState([])
  const [posts, setPosts] = useState([])

  function handleSetupComplete({ title, type, images, summary }) {
    setMediaTitle(title)
    setMediaType(type)
    setUploadedImages(images)
    setResearchSummary(summary)
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
        <div className="placeholder">
          <p>Conversation phase — coming in Phase 4</p>
          <small>{mediaTitle} · {mediaType} · {uploadedImages.length} image(s) uploaded</small>
        </div>
      )}
      {phase === 'preview' && (
        <div className="placeholder">
          <p>Preview phase — coming in Phase 6</p>
        </div>
      )}
    </div>
  )
}
