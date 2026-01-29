import axios from 'axios';
import * as cheerio from 'cheerio';

export async function scrapeBlogContent(url) {
  let html;

  try {
    console.log('Attempting to fetch:', url);

    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      },
      timeout: 5000, // 5 second timeout for Vercel hobby plan
      maxRedirects: 5,
      validateStatus: (status) => status < 400
    });

    html = response.data;
    console.log('Successfully fetched HTML, length:', html?.length || 0);

    if (!html || html.length < 100) {
      throw new Error('Received empty or very short response from the blog URL');
    }

  } catch (fetchError) {
    console.error('Fetch error:', fetchError.message);

    if (fetchError.code === 'ENOTFOUND' || fetchError.code === 'ECONNREFUSED') {
      throw new Error('Could not connect to the blog URL. Please check the URL is correct.');
    }
    if (fetchError.code === 'ECONNABORTED' || fetchError.message.includes('timeout')) {
      throw new Error('Request timed out. The website might be slow or blocking requests.');
    }
    if (fetchError.response?.status === 404) {
      throw new Error('Blog article not found (404). Please check the URL.');
    }
    if (fetchError.response?.status === 403 || fetchError.response?.status === 401) {
      throw new Error('Access denied. The website may be blocking automated access. Try a different blog.');
    }
    if (fetchError.response?.status >= 500) {
      throw new Error('The blog server returned an error. Please try again later.');
    }

    throw new Error(`Failed to fetch blog: ${fetchError.message}`);
  }

  try {
    const $ = cheerio.load(html);

    // Remove unwanted elements
    $('script, style, nav, header, footer, aside, noscript, iframe').remove();
    $('.ad, .advertisement, .sidebar, .comments, .related-posts, .share-buttons, .social-share').remove();
    $('[class*="cookie"], [class*="popup"], [class*="modal"], [class*="banner"]').remove();

    // Extract metadata with multiple fallbacks
    let title = '';
    const titleSelectors = [
      'h1.article-title',
      'h1.post-title',
      'h1.entry-title',
      'article h1',
      '.blog-post h1',
      'h1',
      'meta[property="og:title"]',
      'meta[name="twitter:title"]',
      'title'
    ];

    for (const selector of titleSelectors) {
      if (selector.startsWith('meta')) {
        title = $(selector).attr('content');
      } else {
        title = $(selector).first().text().trim();
      }
      if (title && title.length > 5 && title.length < 300) break;
    }

    const author = $('meta[name="author"]').attr('content') ||
                   $('[rel="author"]').first().text().trim() ||
                   $('[class*="author"]').first().text().trim() ||
                   '';

    const date = $('meta[property="article:published_time"]').attr('content') ||
                 $('time').attr('datetime') ||
                 $('time').first().text().trim() ||
                 '';

    // Try common article selectors (expanded list)
    let content = '';
    const selectors = [
      'article.post',
      'article.blog-post',
      'article',
      'main article',
      '.post-content',
      '.entry-content',
      '.article-body',
      '.article-content',
      '.blog-content',
      '.post-body',
      '.prose',
      '[itemprop="articleBody"]',
      '.content-body',
      '.single-post-content',
      'main .content',
      'main',
      '.content',
      '#content'
    ];

    for (const selector of selectors) {
      const elem = $(selector);
      if (elem.length) {
        const text = elem.text().trim();
        if (text.length > 500) {
          content = text;
          console.log(`Found content using selector: ${selector}, length: ${text.length}`);
          break;
        }
      }
    }

    // Fallback: collect all paragraphs
    if (!content || content.length < 500) {
      const paragraphs = [];
      $('p').each((_, el) => {
        const text = $(el).text().trim();
        if (text.length > 50) {
          paragraphs.push(text);
        }
      });
      if (paragraphs.length > 0) {
        content = paragraphs.join('\n\n');
        console.log(`Used paragraph fallback, collected ${paragraphs.length} paragraphs`);
      }
    }

    // Last fallback: get body text
    if (!content || content.length < 300) {
      content = $('body').text();
      console.log('Used body text fallback');
    }

    // Clean up whitespace
    content = content
      .replace(/[\t ]+/g, ' ')
      .replace(/\n\s*\n\s*\n/g, '\n\n')
      .replace(/\n +/g, '\n')
      .trim();

    // Truncate if too long (to prevent Groq API issues)
    const maxLength = 15000;
    if (content.length > maxLength) {
      content = content.substring(0, maxLength) + '...';
      console.log(`Truncated content to ${maxLength} characters`);
    }

    if (content.length < 200) {
      throw new Error('Could not extract enough content from the article. The page might require JavaScript or have anti-scraping protection.');
    }

    const wordCount = content.split(/\s+/).filter(w => w.length > 0).length;
    console.log(`Successfully extracted: "${title}" (${wordCount} words)`);

    return {
      title: title || 'Untitled Article',
      author: author.substring(0, 100), // Limit author length
      date,
      content,
      url,
      wordCount
    };

  } catch (parseError) {
    console.error('Parsing error:', parseError.message);
    throw new Error(`Failed to extract content from the blog: ${parseError.message}`);
  }
}
