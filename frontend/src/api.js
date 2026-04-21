const BASE = '/api'

export async function uploadImages(files) {
  const form = new FormData()
  files.forEach(f => form.append('files', f))
  const res = await fetch(`${BASE}/upload`, { method: 'POST', body: form })
  if (!res.ok) throw new Error(await res.text())
  return res.json() // [{ filename, url }]
}

export async function startResearch(title, type) {
  const res = await fetch(`${BASE}/research`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, type }),
  })
  if (!res.ok) throw new Error(await res.text())
  return res.json() // { summary, searches_run }
}

export async function sendMessage(history, userMessage, researchSummary, mediaTitle, mediaType) {
  const res = await fetch(`${BASE}/message`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      history,
      user_message: userMessage,
      research_summary: researchSummary,
      media_title: mediaTitle,
      media_type: mediaType,
    }),
  })
  if (!res.ok) throw new Error(await res.text())
  return res.json() // { reply, strong_opinions_count }
}

export async function generatePosts(history, researchSummary, uploadedImages, mediaTitle) {
  const res = await fetch(`${BASE}/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      history,
      research_summary: researchSummary,
      uploaded_images: uploadedImages,
      media_title: mediaTitle,
    }),
  })
  if (!res.ok) throw new Error(await res.text())
  return res.json() // { posts: [...] }
}
