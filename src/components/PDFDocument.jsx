import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

// Define styles
const styles = StyleSheet.create({
  // Cover Page
  coverPage: {
    backgroundColor: '#0077b5',
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
    color: '#cce5f3',
    marginTop: 30
  },
  coverSummary: {
    fontSize: 14,
    color: '#e0f0fa',
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
    borderBottom: '2px solid #0077b5',
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
    backgroundColor: '#0077b5',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 4,
    marginBottom: 10,
    alignSelf: 'flex-start'
  },
  formatBadge: {
    backgroundColor: '#f0f9ff',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 3,
    marginBottom: 8,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#0077b5'
  },
  formatBadgeText: {
    color: '#0077b5',
    fontSize: 9,
    fontWeight: 'bold',
    textTransform: 'capitalize'
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
    fontSize: 10,
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
    color: '#0077b5',
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

  // Footer
  pageNumber: {
    position: 'absolute',
    bottom: 20,
    right: 40,
    fontSize: 10,
    color: '#94a3b8'
  },

  // Grid layout for posts overview
  postGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10
  },
  postMini: {
    width: '48%',
    backgroundColor: '#f8fafc',
    padding: 10,
    borderRadius: 4,
    marginBottom: 10,
    borderLeft: '3px solid #0077b5'
  },
  postMiniTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#0077b5',
    marginBottom: 4
  },
  postMiniMeta: {
    fontSize: 8,
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

  const { blogMetadata, mainIdeas, linkedInPosts, summary: _summary } = data;
  const posts = linkedInPosts || [];

  // Split posts into groups for pages (4 posts per page for readability)
  const postsPerPage = 3;
  const postPages = [];
  for (let i = 0; i < posts.length; i += postsPerPage) {
    postPages.push(posts.slice(i, i + postsPerPage));
  }

  return (
    <Document>
      {/* Cover Page */}
      <Page size="A4" style={styles.coverPage}>
        <View style={styles.coverContent}>
          <Text style={styles.coverTitle}>LinkedIn Content Package</Text>
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
            {posts.length} LinkedIn Posts
          </Text>
          <Text style={styles.coverSummary}>Ready for a month of content</Text>
        </View>
      </Page>

      {/* Table of Contents */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.heading1}>Table of Contents</Text>
        <View style={styles.tocList}>
          <View style={styles.tocItem}>
            <Text>Source Article Summary</Text>
            <View style={styles.tocDots} />
            <Text>3</Text>
          </View>
          <View style={styles.tocItem}>
            <Text>Key Ideas Extracted</Text>
            <View style={styles.tocDots} />
            <Text>3</Text>
          </View>
          <View style={styles.tocItem}>
            <Text>Posts Overview</Text>
            <View style={styles.tocDots} />
            <Text>4</Text>
          </View>
          <View style={styles.tocItem}>
            <Text>LinkedIn Posts 1-{Math.min(3, posts.length)}</Text>
            <View style={styles.tocDots} />
            <Text>5</Text>
          </View>
          {posts.length > 3 && (
            <View style={styles.tocItem}>
              <Text>LinkedIn Posts 4-{Math.min(6, posts.length)}</Text>
              <View style={styles.tocDots} />
              <Text>6</Text>
            </View>
          )}
          {posts.length > 6 && (
            <View style={styles.tocItem}>
              <Text>LinkedIn Posts 7-{Math.min(9, posts.length)}</Text>
              <View style={styles.tocDots} />
              <Text>7</Text>
            </View>
          )}
          {posts.length > 9 && (
            <View style={styles.tocItem}>
              <Text>LinkedIn Posts 10-{posts.length}</Text>
              <View style={styles.tocDots} />
              <Text>8+</Text>
            </View>
          )}
          <View style={styles.tocItem}>
            <Text>Posting Schedule Tips</Text>
            <View style={styles.tocDots} />
            <Text>Last</Text>
          </View>
        </View>
        <Text style={styles.pageNumber}>2</Text>
      </Page>

      {/* Executive Summary + Main Ideas */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.heading1}>Source Article Summary</Text>
        <Text style={styles.body}>
          This package contains {posts.length} unique LinkedIn posts derived from your blog article. Each post uses a different format and angle to maximize engagement and reach.
        </Text>

        <Text style={styles.heading2}>Source Article</Text>
        <Text style={styles.body}>Title: {blogMetadata?.title}</Text>
        <Text style={styles.body}>URL: {blogMetadata?.url}</Text>
        <Text style={styles.body}>Word Count: {blogMetadata?.wordCount || 'N/A'}</Text>

        <Text style={styles.heading1}>Key Ideas Extracted</Text>
        {mainIdeas?.slice(0, 6).map((idea, i) => (
          <View key={i} style={styles.listItem}>
            <Text style={styles.bullet}>{idea.id}.</Text>
            <Text style={styles.listText}>
              {idea.title}: {idea.description?.substring(0, 100)}...
            </Text>
          </View>
        ))}
        <Text style={styles.pageNumber}>3</Text>
      </Page>

      {/* Posts Overview */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.heading1}>Posts Overview</Text>
        <Text style={styles.body}>
          Quick reference of all {posts.length} posts with their formats:
        </Text>

        <View style={styles.postGrid}>
          {posts.map((post, i) => (
            <View key={i} style={styles.postMini}>
              <Text style={styles.postMiniTitle}>
                Post {post.postNumber || i + 1}: {post.format?.replace(/-/g, ' ')}
              </Text>
              <Text style={styles.postMiniMeta}>
                {post.wordCount || 0} words
              </Text>
            </View>
          ))}
        </View>
        <Text style={styles.pageNumber}>4</Text>
      </Page>

      {/* LinkedIn Posts Pages */}
      {postPages.map((pagePosts, pageIndex) => (
        <Page key={pageIndex} size="A4" style={styles.page}>
          <Text style={styles.heading1}>
            LinkedIn Posts {pageIndex * postsPerPage + 1}-{Math.min((pageIndex + 1) * postsPerPage, posts.length)}
          </Text>

          {pagePosts.map((post, i) => (
            <View key={i} style={styles.contentBlock}>
              <View style={styles.platformBadge}>
                <Text style={styles.badgeText}>Post {post.postNumber || pageIndex * postsPerPage + i + 1}</Text>
              </View>
              <View style={styles.formatBadge}>
                <Text style={styles.formatBadgeText}>{post.format?.replace(/-/g, ' ') || 'Post'}</Text>
              </View>
              <Text style={styles.meta}>Words: {post.wordCount || 0} | Based on: {post.ideaUsed || 'Key Insight'}</Text>
              <Text style={styles.contentText}>{post.content}</Text>
            </View>
          ))}
          <Text style={styles.pageNumber}>{5 + pageIndex}</Text>
        </Page>
      ))}

      {/* Posting Schedule Tips */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.heading1}>Posting Schedule Tips</Text>
        <Text style={styles.body}>
          With {posts.length} posts, you have enough content for approximately one month of LinkedIn activity. Here are some tips for maximizing engagement:
        </Text>

        <Text style={styles.heading2}>Recommended Schedule</Text>
        <View style={styles.listItem}>
          <Text style={styles.bullet}>-</Text>
          <Text style={styles.listText}>Post 1x per day on weekdays (Mon-Fri)</Text>
        </View>
        <View style={styles.listItem}>
          <Text style={styles.bullet}>-</Text>
          <Text style={styles.listText}>Best times: 7-8am, 12pm, or 5-6pm in your audience timezone</Text>
        </View>
        <View style={styles.listItem}>
          <Text style={styles.bullet}>-</Text>
          <Text style={styles.listText}>Avoid weekends unless your audience is B2C</Text>
        </View>

        <Text style={styles.heading2}>Post Format Rotation</Text>
        <Text style={styles.body}>
          We have included 14 different formats to keep your content fresh. Consider rotating through:
        </Text>
        <View style={styles.listItem}>
          <Text style={styles.bullet}>-</Text>
          <Text style={styles.listText}>Monday: Story-based posts to start the week</Text>
        </View>
        <View style={styles.listItem}>
          <Text style={styles.bullet}>-</Text>
          <Text style={styles.listText}>Tuesday: Data insights or trend analysis</Text>
        </View>
        <View style={styles.listItem}>
          <Text style={styles.bullet}>-</Text>
          <Text style={styles.listText}>Wednesday: How-to or actionable tips</Text>
        </View>
        <View style={styles.listItem}>
          <Text style={styles.bullet}>-</Text>
          <Text style={styles.listText}>Thursday: Contrarian or myth-buster posts</Text>
        </View>
        <View style={styles.listItem}>
          <Text style={styles.bullet}>-</Text>
          <Text style={styles.listText}>Friday: Lighter content - questions or quick tips</Text>
        </View>

        <Text style={styles.heading2}>Engagement Tips</Text>
        <View style={styles.listItem}>
          <Text style={styles.bullet}>-</Text>
          <Text style={styles.listText}>Respond to all comments within 1-2 hours of posting</Text>
        </View>
        <View style={styles.listItem}>
          <Text style={styles.bullet}>-</Text>
          <Text style={styles.listText}>Add your own thoughts and personalize before posting</Text>
        </View>
        <View style={styles.listItem}>
          <Text style={styles.bullet}>-</Text>
          <Text style={styles.listText}>Tag relevant connections when appropriate</Text>
        </View>
        <View style={styles.listItem}>
          <Text style={styles.bullet}>-</Text>
          <Text style={styles.listText}>Repost top performers after 2-3 weeks with fresh intro</Text>
        </View>

        <Text style={styles.pageNumber}>{5 + postPages.length}</Text>
      </Page>
    </Document>
  );
}

export default PDFDocument;
