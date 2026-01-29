import { NextResponse } from 'next/server';
import { scrapeBlogContent } from '@/lib/scraper';
import { parseBrandGuidelines, getDefaultBrandGuidelines } from '@/lib/parser';
import { extractMainIdeas, generateAllContent } from '@/lib/contentGenerator';
import { generatePostingSchedule } from '@/lib/scheduler';

export const maxDuration = 60; // Allow up to 60 seconds for generation
export const dynamic = 'force-dynamic';

export async function POST(request) {
  let blogUrl = '';

  try {
    let formData;
    try {
      formData = await request.formData();
    } catch (formError) {
      console.error('FormData parsing error:', formError);
      return NextResponse.json(
        { success: false, error: 'Failed to parse form data. Please try again.' },
        { status: 400 }
      );
    }

    blogUrl = formData.get('blogUrl');
    const brandFile = formData.get('brandGuidelines');

    // Validate URL
    if (!blogUrl) {
      return NextResponse.json(
        { success: false, error: 'Blog URL is required' },
        { status: 400 }
      );
    }

    try {
      new URL(blogUrl);
    } catch {
      return NextResponse.json(
        { success: false, error: 'Invalid blog URL format' },
        { status: 400 }
      );
    }

    // Stage 1: Fetch blog content
    console.log('Stage 1: Fetching blog content from:', blogUrl);
    let blogContent;
    try {
      blogContent = await scrapeBlogContent(blogUrl);
      console.log(`Blog fetched: ${blogContent.title} (${blogContent.wordCount} words)`);
    } catch (scrapeError) {
      console.error('Scraping error:', scrapeError);
      return NextResponse.json(
        {
          success: false,
          error: `Failed to fetch blog content: ${scrapeError.message}. Try a different blog URL or check if the site allows access.`
        },
        { status: 400 }
      );
    }

    // Stage 2: Parse brand guidelines (or use defaults)
    console.log('Stage 2: Parsing brand guidelines...');
    let brandGuidelines = getDefaultBrandGuidelines();
    if (brandFile && brandFile.size > 0) {
      try {
        brandGuidelines = await parseBrandGuidelines(brandFile);
        console.log('Brand guidelines parsed successfully');
      } catch (error) {
        console.warn('Failed to parse brand guidelines, using defaults:', error.message);
      }
    }

    // Stage 3: Extract main ideas
    console.log('Stage 3: Extracting main ideas...');
    const mainIdeas = await extractMainIdeas(blogContent);
    console.log(`Extracted ${mainIdeas.length} main ideas`);

    // Stage 4: Generate all content
    console.log('Stage 4: Generating content for all platforms...');
    const content = await generateAllContent(blogContent, brandGuidelines, mainIdeas);
    console.log('Content generated for all platforms');

    // Stage 5: Create posting schedule
    console.log('Stage 5: Creating posting schedule...');
    const schedule = generatePostingSchedule(content);
    console.log(`Created ${schedule.summary.totalPosts} scheduled posts`);

    // Package everything
    const contentPackage = {
      blogMetadata: {
        title: blogContent.title,
        url: blogContent.url,
        author: blogContent.author,
        date: blogContent.date,
        wordCount: blogContent.wordCount
      },
      brandGuidelines: {
        tone: brandGuidelines.tone,
        platforms: brandGuidelines.platforms
      },
      mainIdeas,
      content,
      schedule,
      summary: {
        totalPieces: countContentPieces(content),
        platforms: 8,
        pages: estimatePages(content),
        generatedAt: new Date().toISOString()
      }
    };

    return NextResponse.json({
      success: true,
      data: contentPackage
    });

  } catch (error) {
    console.error('Generation error:', error);
    // Ensure we always return valid JSON
    const errorMessage = error instanceof Error
      ? error.message
      : 'Content generation failed. Please try again.';

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

function countContentPieces(content) {
  let count = 0;
  count += content.linkedin?.length || 0;
  count += content.instagram?.length || 0;
  count += content.twitter?.length || 0;
  count += content.facebook?.length || 0;
  count += content.infographic ? 1 : 0;
  count += content.linkedinPulse ? 1 : 0;
  count += content.substack ? 1 : 0;
  count += content.youtubeShorts ? 1 : 0;
  return count;
}

function estimatePages(content) {
  // Rough estimate: 300 words per page
  let totalWords = 0;

  content.linkedin?.forEach(post => totalWords += post.wordCount || 150);
  content.instagram?.forEach(() => totalWords += 100);
  content.twitter?.forEach(thread => totalWords += (thread.tweets?.length || 5) * 40);
  content.facebook?.forEach(() => totalWords += 180);
  totalWords += content.linkedinPulse?.wordCount || 1000;
  totalWords += content.substack?.wordCount || 1200;
  totalWords += 500; // Infographic + YouTube shorts
  totalWords += 1000; // Schedule and metadata

  return Math.ceil(totalWords / 300) + 5; // +5 for cover, TOC, design briefs
}
