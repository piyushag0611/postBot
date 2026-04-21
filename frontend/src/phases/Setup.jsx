import { useState, useRef } from 'react'
import { uploadImages, startResearch } from '../api'
import './Setup.css'

const ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/webp']

export default function Setup({ onComplete }) {
  const [title, setTitle] = useState('')
  const [type, setType] = useState('movie')
  const [selectedFiles, setSelectedFiles] = useState([])
  const [previews, setPreviews] = useState([])
  const [isDragging, setIsDragging] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const fileInputRef = useRef()

  function addFiles(fileList) {
    const valid = Array.from(fileList).filter(f => ALLOWED_MIME.includes(f.type))
    if (!valid.length) return
    setSelectedFiles(prev => [...prev, ...valid])
    setPreviews(prev => [...prev, ...valid.map(f => URL.createObjectURL(f))])
  }

  function removeFile(index) {
    URL.revokeObjectURL(previews[index])
    setSelectedFiles(prev => prev.filter((_, i) => i !== index))
    setPreviews(prev => prev.filter((_, i) => i !== index))
  }

  function onDragOver(e) {
    e.preventDefault()
    setIsDragging(true)
  }

  function onDragLeave(e) {
    if (!e.currentTarget.contains(e.relatedTarget)) setIsDragging(false)
  }

  function onDrop(e) {
    e.preventDefault()
    setIsDragging(false)
    addFiles(e.dataTransfer.files)
  }

  async function handleStart() {
    setIsLoading(true)
    setError(null)
    try {
      const images = selectedFiles.length > 0 ? await uploadImages(selectedFiles) : []
      const { summary } = await startResearch(title.trim(), type)
      onComplete({ title: title.trim(), type, images, summary })
    } catch (e) {
      setError(e.message)
      setIsLoading(false)
    }
  }

  return (
    <div className="setup">
      <div className="setup-header">
        <h1>PostBot</h1>
        <p>Turn your takes into Instagram carousels</p>
      </div>

      <div className="setup-form">
        <div className="field">
          <label htmlFor="title">Title</label>
          <input
            id="title"
            type="text"
            placeholder="e.g. The Bear, Dune, Demon Copperhead"
            value={title}
            onChange={e => setTitle(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && title.trim() && !isLoading && handleStart()}
          />
        </div>

        <div className="field">
          <label htmlFor="type">Type</label>
          <select id="type" value={type} onChange={e => setType(e.target.value)}>
            <option value="movie">Movie</option>
            <option value="book">Book</option>
            <option value="tv">TV Series</option>
          </select>
        </div>

        <div className="field">
          <label>
            Images <span className="optional">— optional</span>
          </label>
          <div
            className={`drop-zone ${isDragging ? 'dragging' : ''}`}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            onClick={() => fileInputRef.current.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".jpg,.jpeg,.png,.webp"
              multiple
              hidden
              onChange={e => { addFiles(e.target.files); e.target.value = '' }}
            />
            <span className="drop-icon">↑</span>
            <p>Drag & drop or click to browse</p>
            <p className="drop-hint">Stills, covers, screenshots — JPG, PNG, WEBP</p>
          </div>

          {previews.length > 0 && (
            <div className="thumbnail-grid">
              {previews.map((src, i) => (
                <div key={i} className="thumbnail">
                  <img src={src} alt="" />
                  <button
                    className="remove-btn"
                    onClick={e => { e.stopPropagation(); removeFile(i) }}
                    title="Remove"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {error && <p className="error">{error}</p>}

        <button
          className="start-btn"
          onClick={handleStart}
          disabled={!title.trim() || isLoading}
        >
          {isLoading ? 'Researching…' : 'Start'}
        </button>
      </div>
    </div>
  )
}
