'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "How long does it take to generate content?",
      answer: "Typically 60-90 seconds. The AI analyzes your blog article, extracts 6-8 main ideas, and creates 14+ unique content pieces optimized for each platform. The speed depends on the article length and current server load."
    },
    {
      question: "What platforms are supported?",
      answer: "We generate 14 unique LinkedIn posts with different formats and angles - from storytelling and data insights to how-to guides and myth-busters. Each post is optimized for engagement with hashtags and discussion questions."
    },
    {
      question: "Do I need to provide brand guidelines?",
      answer: "Brand guidelines are optional but highly recommended. They help ensure all generated content matches your brand's voice, tone, and formatting preferences. Without guidelines, we use professional defaults. Download our free template to get started quickly."
    },
    {
      question: "Is this really 100% free?",
      answer: "Yes! The Content Repurposing Agent uses Groq's free AI API tier and is hosted on Vercel's free plan. There are no hidden costs, credit card requirements, or usage limits. We built this as a portfolio project to showcase AI-powered marketing automation."
    },
    {
      question: "What format is the output?",
      answer: "You'll receive a professionally formatted PDF (typically 25-40 pages) containing all content pieces ready to copy-paste, design briefs for visual content, a strategic 4-week posting schedule with optimal times, and best practices for each platform."
    },
    {
      question: "Can I edit the generated content?",
      answer: "Absolutely! The PDF is designed for easy copy-pasting. Think of the generated content as your AI-powered first draft. You can (and should) personalize it with your unique insights, adjust the tone, and add specific examples relevant to your audience."
    },
    {
      question: "What types of blog articles work best?",
      answer: "Articles between 800-3000 words work best. The content should have clear insights, tips, or valuable information. How-to guides, thought leadership pieces, industry analysis, and educational content all produce excellent results. Very short articles may not have enough material to extract multiple unique ideas."
    },
    {
      question: "How do you ensure content doesn't repeat?",
      answer: "We extract 6-8 distinct main ideas from your article and assign different ideas to different content pieces. Each platform also gets varied formats - LinkedIn posts alternate between storytelling, data-driven, and contrarian angles. This ensures fresh, non-repetitive content across all platforms."
    }
  ];

  return (
    <section className="py-16 sm:py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-4">
          Frequently Asked Questions
        </h2>
        <p className="text-center text-gray-500 mb-10 sm:mb-12">
          Everything you need to know about the Content Repurposing Agent
        </p>

        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-5 sm:px-6 py-4 sm:py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors duration-200"
              >
                <span className="font-semibold text-gray-900 pr-4 text-sm sm:text-base">{faq.question}</span>
                <ChevronDown
                  className={`w-5 h-5 text-blue-600 flex-shrink-0 transition-transform duration-300 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ease-out ${
                  openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="px-5 sm:px-6 pb-4 sm:pb-5 text-gray-600 leading-relaxed text-sm sm:text-base">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
