export function generatePostingSchedule(_contentPieces) {
  const themes = [
    { week: 1, theme: "Industry Education", focus: "Value-first, educational content" },
    { week: 2, theme: "Community Engagement", focus: "Questions, discussions, interaction" },
    { week: 3, theme: "Thought Leadership", focus: "Data, insights, authority-building" },
    { week: 4, theme: "Brand Storytelling", focus: "Behind-scenes, authentic connection" }
  ];

  const schedule = themes.map((weekInfo, weekIndex) => {
    const weekSchedule = {
      weekNumber: weekInfo.week,
      theme: weekInfo.theme,
      focus: weekInfo.focus,
      posts: []
    };

    // LinkedIn posts distribution
    if (weekIndex === 0) {
      weekSchedule.posts.push({
        day: 'Monday',
        time: '9:00 AM',
        platform: 'LinkedIn',
        type: 'Post 1 (Storytelling)',
        contentRef: 'linkedin[0]',
        note: 'Start the week with an engaging story'
      });
      weekSchedule.posts.push({
        day: 'Wednesday',
        time: '10:00 AM',
        platform: 'LinkedIn',
        type: 'Post 2 (Data-driven)',
        contentRef: 'linkedin[1]',
        note: 'Mid-week insights'
      });
    }

    if (weekIndex === 1) {
      weekSchedule.posts.push({
        day: 'Monday',
        time: '9:00 AM',
        platform: 'LinkedIn',
        type: 'Post 3 (Question)',
        contentRef: 'linkedin[2]',
        note: 'Encourage discussion'
      });
      weekSchedule.posts.push({
        day: 'Friday',
        time: '11:00 AM',
        platform: 'LinkedIn',
        type: 'Post 4 (Listicle)',
        contentRef: 'linkedin[3]',
        note: 'Easy weekend read'
      });
    }

    if (weekIndex === 2) {
      weekSchedule.posts.push({
        day: 'Wednesday',
        time: '9:00 AM',
        platform: 'LinkedIn',
        type: 'Post 5 (Contrarian)',
        contentRef: 'linkedin[4]',
        note: 'Challenge conventional thinking'
      });
    }

    // Twitter threads (rotate through weeks)
    if (weekIndex < 3) {
      weekSchedule.posts.push({
        day: 'Tuesday',
        time: '11:00 AM',
        platform: 'Twitter/X',
        type: `Thread ${weekIndex + 1}`,
        contentRef: `twitter[${weekIndex}]`,
        note: 'Peak engagement time for threads'
      });
    }

    // Instagram posts
    if (weekIndex === 0) {
      weekSchedule.posts.push({
        day: 'Thursday',
        time: '7:00 PM',
        platform: 'Instagram',
        type: 'Post 1 (Storytelling)',
        contentRef: 'instagram[0]',
        note: 'Evening engagement peak'
      });
    }
    if (weekIndex === 1) {
      weekSchedule.posts.push({
        day: 'Saturday',
        time: '11:00 AM',
        platform: 'Instagram',
        type: 'Post 2 (Inspirational)',
        contentRef: 'instagram[1]',
        note: 'Weekend leisure browsing'
      });
    }

    // Facebook posts distribution
    weekSchedule.posts.push({
      day: 'Thursday',
      time: '2:00 PM',
      platform: 'Facebook',
      type: `Post ${weekIndex + 1}`,
      contentRef: `facebook[${weekIndex}]`,
      note: 'Afternoon community engagement'
    });

    // Special content
    if (weekIndex === 1) {
      weekSchedule.posts.push({
        day: 'Tuesday',
        time: '9:00 AM',
        platform: 'LinkedIn Pulse',
        type: 'Long-form Article',
        contentRef: 'linkedinPulse',
        note: 'Tuesday performs best for long-form content'
      });
    }

    if (weekIndex === 2) {
      weekSchedule.posts.push({
        day: 'Thursday',
        time: '8:00 AM',
        platform: 'Substack',
        type: 'Newsletter',
        contentRef: 'substack',
        note: 'Mid-campaign engagement boost'
      });
    }

    if (weekIndex === 1) {
      weekSchedule.posts.push({
        day: 'Saturday',
        time: '10:00 AM',
        platform: 'YouTube',
        type: 'Shorts',
        contentRef: 'youtubeShorts',
        note: 'Weekend traffic spike for short-form video'
      });
    }

    if (weekIndex === 3) {
      weekSchedule.posts.push({
        day: 'Monday',
        time: '9:00 AM',
        platform: 'All Platforms',
        type: 'Infographic',
        contentRef: 'infographic',
        note: 'Visual recap of campaign themes'
      });
    }

    return weekSchedule;
  });

  // Calculate summary
  const totalPosts = schedule.reduce((sum, week) => sum + week.posts.length, 0);

  return {
    schedule,
    summary: {
      totalPosts,
      platforms: 8,
      duration: '4 weeks',
      postsPerWeek: Math.round(totalPosts / 4)
    },
    bestPractices: [
      {
        platform: 'LinkedIn',
        timing: 'Weekdays 9-11 AM',
        frequency: '2-3 posts/week',
        tip: 'Use hooks and end with questions for engagement'
      },
      {
        platform: 'Instagram',
        timing: 'Evenings 6-9 PM, Weekends',
        frequency: '1-2 posts/week',
        tip: 'Visual-first, story highlights for longevity'
      },
      {
        platform: 'Twitter/X',
        timing: 'Weekdays 11 AM - 1 PM',
        frequency: '1 thread/week',
        tip: 'Thread first tweet is crucial for visibility'
      },
      {
        platform: 'Facebook',
        timing: 'Weekdays 1-4 PM',
        frequency: '1 post/week',
        tip: 'Questions and discussions drive algorithm'
      }
    ]
  };
}
