import axios from 'axios';
import * as cheerio from 'cheerio';

export async function scrapeBlogContent(url) {
  try {
    const { data: html } = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      timeout: 30000
    });

    const $ = cheerio.load(html);

    // Remove unwanted elements
    $('script, style, nav, header, footer, aside, .ad, .advertisement, .sidebar, .comments, .related-posts').remove();

    // Extract metadata
    const title = $('h1').first().text().trim() ||
                  $('meta[property="og:title"]').attr('content') ||
                  $('title').text().trim();
    const author = $('meta[name="author"]').attr('content') ||
                   $('[rel="author"]').text().trim() ||
                   '';
    const date = $('meta[property="article:published_time"]').attr('content') ||
                 $('time').attr('datetime') ||
                 '';

    // Try common article selectors
    let content = '';
    const selectors = [
      'article',
      'main',
      '.post-content',
      '.entry-content',
      '.article-body',
      '.article-content',
      '.blog-content',
      '.post-body',
      '[itemprop="articleBody"]',
      '.content'
    ];

    for (const selector of selectors) {
      const elem = $(selector);
      if (elem.length && elem.text().trim().length > 500) {
        content = elem.text();
        break;
      }
    }

    // Fallback: get body text
    if (!content || content.length < 500) {
      content = $('body').text();
    }

    // Clean up whitespace
    content = content
      .replace(/\s+/g, ' ')
      .replace(/\n\s*\n/g, '\n\n')
      .trim();

    if (content.length < 300) {
      throw new Error('Article content too short or could not be extracted');
    }

    return {
      title: title || 'Untitled Article',
      author,
      date,
      content,
      url,
      wordCount: content.split(/\s+/).length
    };

  } catch (error) {
    if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      throw new Error('Could not connect to the blog URL. Please check the URL is correct.');
    }
    if (error.response?.status === 404) {
      throw new Error('Blog article not found (404). Please check the URL.');
    }
    if (error.response?.status === 403) {
      throw new Error('Access denied to blog. The website may be blocking automated access.');
    }
    throw new Error(`Failed to scrape blog: ${error.message}`);
  }
}
