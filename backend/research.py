import logging
import os

import anthropic

logger = logging.getLogger(__name__)

# Switch to claude-sonnet-4-6 + re-enable web_search once the full flow is tested
MODEL = os.getenv("MODEL", "claude-haiku-4-5-20251001")

_RESEARCH_SYSTEM = (
    "You are a media research assistant helping someone craft insightful Instagram posts. "
    "Share what you know about the given title: key themes, critical reception, "
    "common fan debates, standout characters and moments, and cultural impact. "
    "Do NOT summarize the plot. Be specific and opinionated."
)

_SUMMARY_SYSTEM = (
    "You are a concise research editor. "
    "Synthesize research notes into a clean prose digest — no bullet points, no headers."
)


async def run_research(title: str, media_type: str) -> dict:
    logger.info("run_research called — title=%r type=%r model=%s", title, media_type, MODEL)

    client = anthropic.AsyncAnthropic(api_key=os.environ["ANTHROPIC_API_KEY"])

    user_message = f'Share what you know about this {media_type}: "{title}"'
    logger.info("Sending research request: %r", user_message)

    resp = await client.messages.create(
        model=MODEL,
        max_tokens=1024,
        system=_RESEARCH_SYSTEM,
        # web_search disabled for testing — re-enable with:
        # tools=[{"type": "web_search_20250305", "name": "web_search"}],
        messages=[{"role": "user", "content": user_message}],
    )

    logger.info(
        "Research response — stop_reason=%s blocks=%d types=%s",
        resp.stop_reason,
        len(resp.content),
        [b.type for b in resp.content],
    )

    raw = "\n".join(
        b.text for b in resp.content if b.type == "text" and b.text
    )
    logger.info("Raw research text length: %d chars", len(raw))
    logger.debug("Raw content is %s", raw)
    summary = await _summarize(client, title, media_type, raw)
    return {"summary": summary, "searches_run": 0}


async def _summarize(client, title: str, media_type: str, context: str) -> str:
    if not context.strip():
        logger.warning("Empty research context for %r — returning empty summary", title)
        return ""

    user_message = (
        f'Research notes for the {media_type} "{title}":\n\n'
        f"{context[:12000]}\n\n"
        "Write a 3–5 paragraph digest covering: key themes, critical reception, "
        "common debates, standout characters/moments, cultural impact. "
        "No plot summary. No bullet points."
    )
    logger.info("Sending summarize request — context length: %d chars", len(context))

    resp = await client.messages.create(
        model=MODEL,
        max_tokens=1024,
        system=_SUMMARY_SYSTEM,
        messages=[{"role": "user", "content": user_message}],
    )

    logger.info(
        "Summarize response — stop_reason=%s blocks=%d types=%s",
        resp.stop_reason,
        len(resp.content),
        [b.type for b in resp.content],
    )

    text_blocks = [b for b in resp.content if b.type == "text" and b.text]
    if not text_blocks:
        logger.error("No text block in summarize response — content: %s", resp.content)
        return ""

    summary = text_blocks[0].text
    logger.info("Summary length: %d chars", len(summary))
    logger.debug("Summary is: %s", summary)
    return summary
