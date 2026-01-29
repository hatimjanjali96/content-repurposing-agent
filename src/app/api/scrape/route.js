import { NextResponse } from 'next/server';

// Use Edge Runtime for faster cold starts
export const runtime = 'edge';

export async function POST(request) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ success: false, error: 'URL is required' }, { status: 400 });
    }

    // Fetch the blog content
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
    });

    if (!response.ok) {
      return NextResponse.json({
        success: false,
        error: `Failed to fetch blog: ${response.status} ${response.statusText}`
      }, { status: 400 });
    }

    const html = await response.text();

    // Simple content extraction using regex (Edge-compatible, no cheerio)
    let title = '';
    let content = '';

    // Extract title
    const ogTitleMatch = html.match(/<meta[^>]*property="og:title"[^>]*content="([^"]*)"/) ||
                         html.match(/<meta[^>]*content="([^"]*)"[^>]*property="og:title"/);
    const h1Match = html.match(/<h1[^>]*>([^<]*)<\/h1>/i);
    const titleMatch = html.match(/<title>([^<]*)<\/title>/i);

    title = ogTitleMatch?.[1] || h1Match?.[1] || titleMatch?.[1] || 'Untitled Article';
    title = title.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").trim();

    // Remove scripts, styles, and tags, then extract text
    let cleanHtml = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, '')
      .replace(/<header[^>]*>[\s\S]*?<\/header>/gi, '')
      .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, '')
      .replace(/<aside[^>]*>[\s\S]*?<\/aside>/gi, '');

    // Extract paragraphs
    const paragraphs = [];
    const pMatches = cleanHtml.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi);
    for (const match of pMatches) {
      const text = match[1]
        .replace(/<[^>]+>/g, '')
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/\s+/g, ' ')
        .trim();
      if (text.length > 30) {
        paragraphs.push(text);
      }
    }

    content = paragraphs.join('\n\n');

    // If not enough content from paragraphs, try getting all text
    if (content.length < 500) {
      content = cleanHtml
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .substring(0, 10000);
    }

    // Truncate for API limits
    if (content.length > 4000) {
      content = content.substring(0, 4000);
    }

    if (content.length < 100) {
      return NextResponse.json({
        success: false,
        error: 'Could not extract enough content from this blog. Try a different URL.'
      }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      data: {
        title,
        content,
        url,
        wordCount: content.split(/\s+/).length
      }
    });

  } catch (error) {
    console.error('Scrape error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to scrape blog'
    }, { status: 500 });
  }
}
