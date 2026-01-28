import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

// Define styles
const styles = StyleSheet.create({
  // Cover Page
  coverPage: {
    backgroundColor: '#1e3a8a',
    padding: 60,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%'
  },
  coverContent: {
    alignItems: 'center',
    textAlign: 'center'
  },
  coverTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 20
  },
  coverSubtitle: {
    fontSize: 16,
    color: '#ffffff',
    marginBottom: 10,
    textAlign: 'center',
    maxWidth: 400
  },
  coverMeta: {
    fontSize: 11,
    color: '#cbd5e1',
    marginTop: 30
  },
  coverSummary: {
    fontSize: 14,
    color: '#e0e7ff',
    marginTop: 20,
    textAlign: 'center'
  },

  // Regular Pages
  page: {
    padding: 40,
    fontSize: 11,
    backgroundColor: '#ffffff'
  },
  heading1: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 20,
    borderBottom: '2px solid #3b82f6',
    paddingBottom: 10
  },
  heading2: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#334155',
    marginTop: 20,
    marginBottom: 10
  },
  heading3: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#475569',
    marginTop: 15,
    marginBottom: 8
  },
  body: {
    fontSize: 11,
    color: '#475569',
    lineHeight: 1.6,
    marginBottom: 8
  },
  bodySmall: {
    fontSize: 10,
    color: '#64748b',
    lineHeight: 1.5
  },

  // Content Blocks
  contentBlock: {
    marginBottom: 25,
    borderBottom: '1px solid #e2e8f0',
    paddingBottom: 20
  },
  platformBadge: {
    backgroundColor: '#3b82f6',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 4,
    marginBottom: 10,
    alignSelf: 'flex-start'
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold'
  },
  meta: {
    fontSize: 9,
    color: '#94a3b8',
    marginBottom: 8
  },
  contentText: {
    fontSize: 11,
    color: '#334155',
    lineHeight: 1.7,
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 4
  },

  // Lists
  listItem: {
    flexDirection: 'row',
    marginBottom: 6
  },
  bullet: {
    fontSize: 11,
    color: '#3b82f6',
    marginRight: 8,
    width: 15
  },
  listText: {
    fontSize: 11,
    color: '#475569',
    flex: 1
  },

  // Table of Contents
  tocList: {
    marginTop: 20
  },
  tocItem: {
    fontSize: 12,
    color: '#475569',
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  tocDots: {
    borderBottom: '1px dotted #cbd5e1',
    flex: 1,
    marginHorizontal: 10
  },

  // Schedule
  weekBlock: {
    marginBottom: 25,
    backgroundColor: '#f8fafc',
    padding: 15,
    borderRadius: 4
  },
  scheduleItem: {
    marginLeft: 10,
    marginBottom: 8,
    paddingLeft: 10,
    borderLeft: '2px solid #3b82f6'
  },
  note: {
    fontSize: 9,
    color: '#10b981',
    fontStyle: 'italic',
    marginTop: 2
  },

  // Two column layout
  row: {
    flexDirection: 'row',
    marginBottom: 10
  },
  col: {
    flex: 1,
    paddingRight: 10
  },

  // Footer
  pageNumber: {
    position: 'absolute',
    bottom: 20,
    right: 40,
    fontSize: 10,
    color: '#94a3b8'
  }
});

export function PDFDocument({ data }) {
  if (!data) {
    return (
      <Document>
        <Page size="A4" style={styles.page}>
          <Text>No data provided</Text>
        </Page>
      </Document>
    );
  }

  const { blogMetadata, mainIdeas, content, schedule, summary } = data;

  return (
    <Document>
      {/* Cover Page */}
      <Page size="A4" style={styles.coverPage}>
        <View style={styles.coverContent}>
          <Text style={styles.coverTitle}>Content Repurposing Package</Text>
          <Text style={styles.coverSubtitle}>
            {blogMetadata?.title || 'Generated Content'}
          </Text>
          <Text style={styles.coverMeta}>
            Generated: {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </Text>
          <Text style={styles.coverSummary}>
            {summary?.totalPieces || 21}+ pieces across 8 platforms
          </Text>
          <Text style={styles.coverSummary}>4-week strategic posting schedule</Text>
        </View>
      </Page>

      {/* Table of Contents */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.heading1}>Table of Contents</Text>
        <View style={styles.tocList}>
          <View style={styles.tocItem}>
            <Text>Executive Summary</Text>
            <View style={styles.tocDots} />
            <Text>3</Text>
          </View>
          <View style={styles.tocItem}>
            <Text>Main Ideas Extracted</Text>
            <View style={styles.tocDots} />
            <Text>4</Text>
          </View>
          <View style={styles.tocItem}>
            <Text>LinkedIn Content (5 posts)</Text>
            <View style={styles.tocDots} />
            <Text>5</Text>
          </View>
          <View style={styles.tocItem}>
            <Text>Instagram Content (2 posts + Design Briefs)</Text>
            <View style={styles.tocDots} />
            <Text>8</Text>
          </View>
          <View style={styles.tocItem}>
            <Text>Twitter/X Threads (3 threads)</Text>
            <View style={styles.tocDots} />
            <Text>10</Text>
          </View>
          <View style={styles.tocItem}>
            <Text>Facebook Content (4 posts)</Text>
            <View style={styles.tocDots} />
            <Text>13</Text>
          </View>
          <View style={styles.tocItem}>
            <Text>Infographic Outline</Text>
            <View style={styles.tocDots} />
            <Text>16</Text>
          </View>
          <View style={styles.tocItem}>
            <Text>LinkedIn Pulse Article</Text>
            <View style={styles.tocDots} />
            <Text>17</Text>
          </View>
          <View style={styles.tocItem}>
            <Text>Substack Newsletter</Text>
            <View style={styles.tocDots} />
            <Text>20</Text>
          </View>
          <View style={styles.tocItem}>
            <Text>YouTube Shorts Script</Text>
            <View style={styles.tocDots} />
            <Text>23</Text>
          </View>
          <View style={styles.tocItem}>
            <Text>4-Week Posting Schedule</Text>
            <View style={styles.tocDots} />
            <Text>25</Text>
          </View>
        </View>
        <Text style={styles.pageNumber}>2</Text>
      </Page>

      {/* Executive Summary */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.heading1}>Executive Summary</Text>
        <Text style={styles.body}>
          This content package contains {summary?.totalPieces || 21}+ platform-optimized pieces derived from your blog article. Each piece focuses on a unique main idea to maximize reach and engagement across channels.
        </Text>

        <Text style={styles.heading2}>Source Article</Text>
        <Text style={styles.body}>Title: {blogMetadata?.title}</Text>
        <Text style={styles.body}>URL: {blogMetadata?.url}</Text>
        {blogMetadata?.author && <Text style={styles.body}>Author: {blogMetadata.author}</Text>}
        <Text style={styles.body}>Word Count: {blogMetadata?.wordCount || 'N/A'}</Text>

        <Text style={styles.heading2}>Content Distribution</Text>
        <View style={styles.listItem}>
          <Text style={styles.bullet}>-</Text>
          <Text style={styles.listText}>LinkedIn: 5 posts + 1 Pulse article</Text>
        </View>
        <View style={styles.listItem}>
          <Text style={styles.bullet}>-</Text>
          <Text style={styles.listText}>Instagram: 2 posts with design briefs</Text>
        </View>
        <View style={styles.listItem}>
          <Text style={styles.bullet}>-</Text>
          <Text style={styles.listText}>Twitter/X: 3 threaded discussions</Text>
        </View>
        <View style={styles.listItem}>
          <Text style={styles.bullet}>-</Text>
          <Text style={styles.listText}>Facebook: 4 community posts</Text>
        </View>
        <View style={styles.listItem}>
          <Text style={styles.bullet}>-</Text>
          <Text style={styles.listText}>Plus: Infographic outline, Substack newsletter, YouTube Shorts script</Text>
        </View>
        <Text style={styles.pageNumber}>3</Text>
      </Page>

      {/* Main Ideas */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.heading1}>Main Ideas Extracted</Text>
        <Text style={styles.body}>
          We extracted {mainIdeas?.length || 6} distinct main ideas from your article. Each content piece focuses on a different idea to ensure variety and prevent repetition.
        </Text>

        {mainIdeas?.map((idea, i) => (
          <View key={i} style={styles.contentBlock}>
            <Text style={styles.heading3}>#{idea.id}: {idea.title}</Text>
            <Text style={styles.body}>{idea.description}</Text>
          </View>
        ))}
        <Text style={styles.pageNumber}>4</Text>
      </Page>

      {/* LinkedIn Posts */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.heading1}>LinkedIn Content</Text>
        <Text style={styles.body}>
          5 professional posts designed for maximum engagement on LinkedIn. Each uses a different format and focuses on a unique main idea.
        </Text>

        {content?.linkedin?.slice(0, 3).map((post, i) => (
          <View key={i} style={styles.contentBlock}>
            <View style={styles.platformBadge}>
              <Text style={styles.badgeText}>LinkedIn Post {i + 1}</Text>
            </View>
            <Text style={styles.meta}>Format: {post.format} | Words: {post.wordCount} | Main Idea: #{post.mainIdeaId}</Text>
            <Text style={styles.contentText}>{post.content}</Text>
          </View>
        ))}
        <Text style={styles.pageNumber}>5</Text>
      </Page>

      <Page size="A4" style={styles.page}>
        <Text style={styles.heading2}>LinkedIn Posts (continued)</Text>
        {content?.linkedin?.slice(3).map((post, i) => (
          <View key={i} style={styles.contentBlock}>
            <View style={styles.platformBadge}>
              <Text style={styles.badgeText}>LinkedIn Post {i + 4}</Text>
            </View>
            <Text style={styles.meta}>Format: {post.format} | Words: {post.wordCount}</Text>
            <Text style={styles.contentText}>{post.content}</Text>
          </View>
        ))}
        <Text style={styles.pageNumber}>6</Text>
      </Page>

      {/* Instagram Posts */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.heading1}>Instagram Content</Text>
        <Text style={styles.body}>
          2 visually-focused posts with detailed design briefs for your creative team.
        </Text>

        {content?.instagram?.map((post, i) => (
          <View key={i} style={styles.contentBlock}>
            <View style={styles.platformBadge}>
              <Text style={styles.badgeText}>Instagram Post {i + 1}</Text>
            </View>
            <Text style={styles.meta}>Style: {post.style}</Text>

            <Text style={styles.heading3}>Caption:</Text>
            <Text style={styles.contentText}>{post.caption}</Text>

            <Text style={styles.heading3}>Design Brief:</Text>
            <Text style={styles.bodySmall}>Visual Concept: {post.designBrief?.visualConcept}</Text>
            <Text style={styles.bodySmall}>Color Palette: {Array.isArray(post.designBrief?.colorPalette) ? post.designBrief.colorPalette.join(', ') : 'Blue, White, Gray'}</Text>
            <Text style={styles.bodySmall}>Typography: {post.designBrief?.typography}</Text>
            <Text style={styles.bodySmall}>Layout: {post.designBrief?.layout}</Text>
          </View>
        ))}
        <Text style={styles.pageNumber}>8</Text>
      </Page>

      {/* Twitter Threads */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.heading1}>Twitter/X Threads</Text>
        <Text style={styles.body}>
          3 threaded discussions designed for engagement and shareability.
        </Text>

        {content?.twitter?.map((thread, i) => (
          <View key={i} style={styles.contentBlock}>
            <View style={styles.platformBadge}>
              <Text style={styles.badgeText}>Thread {i + 1}: {thread.style}</Text>
            </View>

            {thread.tweets?.map((tweet, j) => (
              <View key={j} style={styles.scheduleItem}>
                <Text style={styles.meta}>Tweet {tweet.tweetNumber}</Text>
                <Text style={styles.body}>{tweet.text}</Text>
              </View>
            ))}
          </View>
        ))}
        <Text style={styles.pageNumber}>10</Text>
      </Page>

      {/* Facebook Posts */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.heading1}>Facebook Content</Text>
        <Text style={styles.body}>
          4 community-focused posts designed to spark discussion and engagement.
        </Text>

        {content?.facebook?.map((post, i) => (
          <View key={i} style={styles.contentBlock}>
            <View style={styles.platformBadge}>
              <Text style={styles.badgeText}>Facebook Post {i + 1}</Text>
            </View>
            <Text style={styles.meta}>Style: {post.style}</Text>
            <Text style={styles.contentText}>{post.content}</Text>
          </View>
        ))}
        <Text style={styles.pageNumber}>13</Text>
      </Page>

      {/* Infographic */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.heading1}>Infographic Outline</Text>
        <Text style={styles.body}>
          A detailed outline for creating a shareable infographic based on your content.
        </Text>

        <View style={styles.contentBlock}>
          <Text style={styles.heading2}>{content?.infographic?.title}</Text>
          <Text style={styles.body}>{content?.infographic?.subtitle}</Text>

          <Text style={styles.heading3}>Key Data Points:</Text>
          {content?.infographic?.dataPoints?.map((point, i) => (
            <View key={i} style={styles.listItem}>
              <Text style={styles.bullet}>{i + 1}.</Text>
              <Text style={styles.listText}>
                <Text style={{ fontWeight: 'bold' }}>{point.point}</Text>: {point.description} (Emphasis: {point.emphasis})
              </Text>
            </View>
          ))}

          <Text style={styles.heading3}>Design Specifications:</Text>
          <Text style={styles.body}>Dimensions: {content?.infographic?.dimensions}</Text>
          <Text style={styles.body}>Icon Style: {content?.infographic?.iconStyle}</Text>
          <Text style={styles.body}>Visual Hierarchy: {content?.infographic?.visualHierarchy}</Text>
        </View>
        <Text style={styles.pageNumber}>16</Text>
      </Page>

      {/* LinkedIn Pulse */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.heading1}>LinkedIn Pulse Article</Text>
        <Text style={styles.meta}>Word Count: {content?.linkedinPulse?.wordCount}</Text>
        <Text style={styles.contentText}>{content?.linkedinPulse?.content}</Text>
        <Text style={styles.pageNumber}>17</Text>
      </Page>

      {/* Substack */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.heading1}>Substack Newsletter</Text>
        <Text style={styles.meta}>Word Count: {content?.substack?.wordCount}</Text>
        <Text style={styles.contentText}>{content?.substack?.content}</Text>
        <Text style={styles.pageNumber}>20</Text>
      </Page>

      {/* YouTube Shorts */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.heading1}>YouTube Shorts Script</Text>
        <Text style={styles.body}>
          A 60-second video script with timing, spoken text, and visual cues.
        </Text>

        {content?.youtubeShorts?.segments?.map((segment, i) => (
          <View key={i} style={styles.contentBlock}>
            <View style={styles.platformBadge}>
              <Text style={styles.badgeText}>{segment.time}</Text>
            </View>
            <Text style={styles.heading3}>Spoken Text:</Text>
            <Text style={styles.body}>{segment.spokenText}</Text>
            <Text style={styles.heading3}>On-Screen Text:</Text>
            <Text style={styles.body}>{segment.onScreenText}</Text>
            <Text style={styles.heading3}>Visual Cue:</Text>
            <Text style={styles.bodySmall}>{segment.visualCue}</Text>
          </View>
        ))}
        <Text style={styles.pageNumber}>23</Text>
      </Page>

      {/* Posting Schedule */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.heading1}>4-Week Posting Schedule</Text>
        <Text style={styles.body}>
          A strategic content calendar to maximize reach and engagement across all platforms.
        </Text>

        {schedule?.schedule?.map((week, i) => (
          <View key={i} style={styles.weekBlock}>
            <Text style={styles.heading2}>Week {week.weekNumber}: {week.theme}</Text>
            <Text style={styles.meta}>{week.focus}</Text>

            {week.posts?.map((post, j) => (
              <View key={j} style={styles.scheduleItem}>
                <Text style={styles.body}>
                  {post.day} @ {post.time} - {post.platform}: {post.type}
                </Text>
                {post.note && <Text style={styles.note}>{post.note}</Text>}
              </View>
            ))}
          </View>
        ))}
        <Text style={styles.pageNumber}>25</Text>
      </Page>

      {/* Best Practices */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.heading1}>Platform Best Practices</Text>

        {schedule?.bestPractices?.map((practice, i) => (
          <View key={i} style={styles.contentBlock}>
            <Text style={styles.heading3}>{practice.platform}</Text>
            <Text style={styles.body}>Best Timing: {practice.timing}</Text>
            <Text style={styles.body}>Recommended Frequency: {practice.frequency}</Text>
            <Text style={styles.note}>Tip: {practice.tip}</Text>
          </View>
        ))}

        <Text style={styles.heading2}>General Tips</Text>
        <View style={styles.listItem}>
          <Text style={styles.bullet}>-</Text>
          <Text style={styles.listText}>Always personalize content with your unique insights before posting</Text>
        </View>
        <View style={styles.listItem}>
          <Text style={styles.bullet}>-</Text>
          <Text style={styles.listText}>Engage with comments within the first hour of posting</Text>
        </View>
        <View style={styles.listItem}>
          <Text style={styles.bullet}>-</Text>
          <Text style={styles.listText}>Test different posting times to find what works for your audience</Text>
        </View>
        <View style={styles.listItem}>
          <Text style={styles.bullet}>-</Text>
          <Text style={styles.listText}>Repurpose top-performing content across additional platforms</Text>
        </View>
        <Text style={styles.pageNumber}>27</Text>
      </Page>
    </Document>
  );
}

export default PDFDocument;
