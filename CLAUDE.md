# PostBot — Instagram Carousel Generator

## Overview

A web app that turns your thoughts on books, movies, and TV shows into ready-to-post Instagram carousel images. The bot researches the media, has a smart conversation with you to pull out your genuine takes, then generates 5 fully rendered carousel posts. You preview all 5 in the browser and pick the one(s) you want to post.

## Core Flow

1. **Input**: User provides a title + type (book / movie / TV series)
2. **Research**: Bot uses Claude API with web search tool to gather context — plot, themes, reception, common debates, character arcs, cultural impact
3. **Image Upload**: User uploads a batch of images (screenshots, stills, book covers) that the bot can use across all 5 posts
4. **Conversation**: Bot has a directed, specific conversation with the user in a chat interface — NOT generic "what did you think?" questions. It uses the researched context to ask smart questions about specific characters, plot points, divisive moments, and themes. Pushes the user to articulate their hot takes and emotional reactions.
5. **Generation**: When user says "done" (or clicks a generate button), the bot takes the full conversation + uploaded images and generates 5 fully rendered carousel posts — complete with images assigned to slides, text overlaid, and captions written.
6. **Preview & Select**: All 5 posts are displayed as visual carousel previews in the browser. User picks one to download/export.

## Post Generation — No Fixed Angles

The 5 posts should NOT follow a predetermined set of angles (e.g., "hot take", "insight", "comparison"). Instead:

- The bot picks up on what the user emphasized during the conversation — their strongest opinions, emotional moments, interesting observations
- The user can explicitly direct topics during the conversation: "I want a post about the character development" or "make one about the ending twist"
- The 5 posts should simply be 5 different, creative, interesting takes — each one distinct from the others but all rooted in what the user actually said
- If the user gave 2-3 strong opinions, the posts can explore those from different creative directions rather than forcing unrelated angles

## Web Research

- Run a maximum of 3 web searches per media title, or stop earlier if the context summary hits a size threshold
- After research completes, display a collapsible "Research context" panel in the UI showing a digest of what was gathered — not raw search results
- This panel is visible before the conversation starts so the user knows the bot has real context
- The researched context is passed to the conversation engine as a summary, not dumped verbatim into the prompt

## Carousel Structure

- **Slide 1 (Hook)**: Image-heavy — a large, striking image from the uploaded set with a punchy hook line overlaid. This is what stops the scroll.
- **Slides 2–N (Content)**: Text-focused with smaller supporting images. These carry the actual take/argument/story.
- **Slide count**: Flexible — let the content decide. No fixed number.
- **No branding**: Clean, no watermark or handle overlay.
- **Dimensions**: 1080x1080px (Instagram square format)

## Image Handling

- User uploads images before or during the conversation phase
- All 5 posts are rendered with images assigned to slides — not just the selected one
- The bot picks the most fitting images for each slide based on the content
- Supported formats: `.jpg`, `.jpeg`, `.png`, `.webp`
- If no images are provided, fall back to text-only slides with clean styling
- Images may be reused across different post options

## Conversation Design

- Ask ONE question at a time (maybe two if closely related)
- Keep bot responses concise — 2-3 sentences max before the question
- Don't summarize the plot back to the user
- Reference common discourse: "A lot of people think X — do you agree?"
- Challenge gently when the user says something interesting — push them to articulate WHY
- Internally track and flag strong opinions as the conversation progresses
- The "Generate Posts" button unlocks only after the bot has flagged at least 2 strong opinions from the user — not after a fixed number of exchanges
- The user can also type "done" at any point to trigger generation regardless
- If the user explicitly says "I want a post about X", prioritize that

## Tech Stack

- **Backend**: Python — FastAPI
- **Frontend**: Single-page app (React or plain HTML/JS) — desktop-only
  - Left panel: Chat interface for conversation
  - Right panel / below: Carousel preview for the 5 generated posts
- **Claude API**: `claude-sonnet-4-20250514` (or latest Sonnet)
  - With `web_search_20250305` tool for research phase
  - For conversation + post generation
- **Fabric.js**: Client-side canvas rendering, text editing, and PNG export — no server-side image rendering
- **API key**: Read from `ANTHROPIC_API_KEY` environment variable

## Web UI Layout

### Phase 1: Setup
- Input field for media title
- Dropdown for type (Book / Movie / TV Series)
- Image upload area (drag & drop or file picker, multiple files)
- "Start" button → triggers research + begins conversation

### Phase 2: Conversation
- Chat window showing the back-and-forth
- Text input at the bottom for user responses
- "Generate Posts" button (enabled after a few exchanges)
- Research status indicator while context is being fetched

### Phase 3: Preview & Export
- 5 carousel posts displayed as horizontal scrollable previews using Fabric.js canvases
- Each post shows all its slides in a row with the caption below
- Slides use fixed templates — text blocks are editable directly on the canvas (click to edit wording)
- Click to select → download button exports slides as individual PNGs (client-side canvas export) + caption.txt
- Option to go back and continue the conversation, then regenerate
- Desktop-only — no mobile/responsive requirements

## Output

- Carousel slide images: individual 1080x1080 PNG/JPG files per slide
- `caption.txt` with the Instagram caption + hashtags
- Downloadable as a zip or individual files

## Project Structure

```
postbot/
├── backend/
│   ├── main.py             # FastAPI app entry point
│   ├── conversation.py     # Web research + conversation engine
│   ├── generator.py        # Post generation from conversation
│   ├── renderer.py         # Image compositing + carousel export
│   └── requirements.txt    # anthropic, Pillow, fastapi, uvicorn, python-multipart
├── frontend/
│   └── (React app or static HTML/JS/CSS)
├── uploads/                # User-uploaded images (temp)
├── output/                 # Generated carousels
└── CLAUDE.md
```

## Future Directions

- **YouTube as a research source**: Accept a YouTube video URL (review, essay, commentary) as an additional input alongside web search. Extract the transcript via YouTube Data API or yt-dlp, summarize it, and pass it to the conversation engine as context — the same way web search results are handled. The conversation is still the core; the video just gives the bot richer material to ask smarter, more specific questions about. Does not replace the conversation phase.
- **Instagram Stories format**: Vertical 1080x1920px output as an alternative to square carousels. Separate Fabric.js templates; same generation + editing flow.

## Key Design Principles

- **Authentic voice**: The posts should sound like the user, not like a generic review. The conversation exists to capture THEIR perspective.
- **User-directed content**: No forced angles. The user's conversation naturally shapes what the posts are about. They can also explicitly request topics.
- **Scroll-stopping hooks**: Slide 1 must be visually striking with a line that makes people stop scrolling.
- **Engagement-optimized**: Captions should invite comments. Discussion starters and hot takes perform best.
- **Ready to post**: Output should need zero editing — just upload to Instagram.
- **All 5 fully rendered**: Don't make the user pick from text previews. Show them the actual visual output for all 5 so the choice is obvious.