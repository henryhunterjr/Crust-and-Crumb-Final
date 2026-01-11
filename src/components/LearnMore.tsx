'use client';

import React from 'react';
import { Youtube, GraduationCap, UtensilsCrossed, ExternalLink } from 'lucide-react';
import { track } from '@vercel/analytics';
import { getTermLinks, hasTermLinks } from '../data/glossaryLinks';
import type { YouTubeVideo, AcademyCourse, PantryRecipe } from '../types';

interface LearnMoreProps {
  termId: string;
  termName: string;
  compact?: boolean; // For inline display in collapsed cards
}

/**
 * LearnMore Component
 *
 * Displays contextual learning links for glossary terms including:
 * - YouTube video tutorials
 * - Academy courses on Skool
 * - Recipe Pantry practice recipes
 *
 * Tracks clicks for analytics to understand learning engagement.
 */
const LearnMore: React.FC<LearnMoreProps> = ({ termId, termName, compact = false }) => {
  // Get links for this term
  const termLinks = getTermLinks(termId);

  // If no links exist, don't render
  if (!termLinks || !hasTermLinks(termId)) {
    return null;
  }

  const { youtubeVideos, academyCourses, pantryRecipes } = termLinks;

  // Track click events for analytics
  const handleLinkClick = (
    linkType: 'youtube' | 'academy' | 'pantry',
    destinationUrl: string,
    linkTitle: string
  ) => {
    track('cross_link_click', {
      term_id: termId,
      term_name: termName,
      link_type: linkType,
      destination_url: destinationUrl,
      link_title: linkTitle,
      timestamp: new Date().toISOString(),
    });
  };

  // Compact display for collapsed cards
  if (compact) {
    return (
      <div className="flex flex-wrap gap-2 mt-3">
        {youtubeVideos && youtubeVideos.length > 0 && (
          <a
            href={youtubeVideos[0].url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => handleLinkClick('youtube', youtubeVideos[0].url, youtubeVideos[0].title)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-700 border border-red-200 rounded-lg text-xs font-medium hover:bg-red-100 transition-colors"
          >
            <Youtube size={14} />
            Watch Tutorial
          </a>
        )}
        {academyCourses && academyCourses.length > 0 && (
          <a
            href={academyCourses[0].url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => handleLinkClick('academy', academyCourses[0].url, academyCourses[0].title)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 text-purple-700 border border-purple-200 rounded-lg text-xs font-medium hover:bg-purple-100 transition-colors"
          >
            <GraduationCap size={14} />
            Academy Course
          </a>
        )}
        {pantryRecipes && pantryRecipes.length > 0 && (
          <a
            href={pantryRecipes[0].url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => handleLinkClick('pantry', pantryRecipes[0].url, pantryRecipes[0].title)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 text-orange-700 border border-orange-200 rounded-lg text-xs font-medium hover:bg-orange-100 transition-colors"
          >
            <UtensilsCrossed size={14} />
            Practice Recipe
          </a>
        )}
      </div>
    );
  }

  // Full display for expanded cards
  return (
    <div className="mt-4 p-4 bg-gradient-to-br from-slate-50 to-amber-50/30 rounded-xl border border-amber-200">
      <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-4 flex items-center gap-2">
        <span className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center">
          <ExternalLink size={12} className="text-amber-600" />
        </span>
        Go Deeper
      </h4>

      <div className="space-y-3">
        {/* YouTube Videos */}
        {youtubeVideos && youtubeVideos.length > 0 && (
          <div className="space-y-2">
            {youtubeVideos.map((video, index) => (
              <VideoLink
                key={index}
                video={video}
                onTrack={() => handleLinkClick('youtube', video.url, video.title)}
              />
            ))}
          </div>
        )}

        {/* Academy Courses */}
        {academyCourses && academyCourses.length > 0 && (
          <div className="space-y-2">
            {academyCourses.map((course, index) => (
              <CourseLink
                key={index}
                course={course}
                onTrack={() => handleLinkClick('academy', course.url, course.title)}
              />
            ))}
          </div>
        )}

        {/* Recipe Pantry */}
        {pantryRecipes && pantryRecipes.length > 0 && (
          <div className="space-y-2">
            {pantryRecipes.map((recipe, index) => (
              <RecipeLink
                key={index}
                recipe={recipe}
                onTrack={() => handleLinkClick('pantry', recipe.url, recipe.title)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Individual link components for cleaner rendering
const VideoLink: React.FC<{ video: YouTubeVideo; onTrack: () => void }> = ({ video, onTrack }) => (
  <a
    href={video.url}
    target="_blank"
    rel="noopener noreferrer"
    onClick={onTrack}
    className="flex items-start gap-3 p-3 bg-white rounded-lg border border-red-100 hover:border-red-300 hover:shadow-sm transition-all group min-h-[44px]"
  >
    <div className="flex-shrink-0 w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center group-hover:bg-red-200 transition-colors">
      <Youtube size={16} className="text-red-600" />
    </div>
    <div className="flex-1 min-w-0">
      <div className="text-sm font-medium text-slate-800 group-hover:text-red-700 transition-colors">
        {video.title}
      </div>
      {video.description && (
        <div className="text-xs text-slate-500 mt-0.5 truncate">{video.description}</div>
      )}
    </div>
    <ExternalLink size={14} className="text-slate-300 group-hover:text-red-500 flex-shrink-0 mt-1" />
  </a>
);

const CourseLink: React.FC<{ course: AcademyCourse; onTrack: () => void }> = ({ course, onTrack }) => (
  <a
    href={course.url}
    target="_blank"
    rel="noopener noreferrer"
    onClick={onTrack}
    className="flex items-start gap-3 p-3 bg-white rounded-lg border border-purple-100 hover:border-purple-300 hover:shadow-sm transition-all group min-h-[44px]"
  >
    <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
      <GraduationCap size={16} className="text-purple-600" />
    </div>
    <div className="flex-1 min-w-0">
      <div className="text-sm font-medium text-slate-800 group-hover:text-purple-700 transition-colors">
        {course.title}
      </div>
      {course.description && (
        <div className="text-xs text-slate-500 mt-0.5 truncate">{course.description}</div>
      )}
    </div>
    <ExternalLink size={14} className="text-slate-300 group-hover:text-purple-500 flex-shrink-0 mt-1" />
  </a>
);

const RecipeLink: React.FC<{ recipe: PantryRecipe; onTrack: () => void }> = ({ recipe, onTrack }) => (
  <a
    href={recipe.url}
    target="_blank"
    rel="noopener noreferrer"
    onClick={onTrack}
    className="flex items-start gap-3 p-3 bg-white rounded-lg border border-orange-100 hover:border-orange-300 hover:shadow-sm transition-all group min-h-[44px]"
  >
    <div className="flex-shrink-0 w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center group-hover:bg-orange-200 transition-colors">
      <UtensilsCrossed size={16} className="text-orange-600" />
    </div>
    <div className="flex-1 min-w-0">
      <div className="text-sm font-medium text-slate-800 group-hover:text-orange-700 transition-colors">
        {recipe.title}
      </div>
    </div>
    <ExternalLink size={14} className="text-slate-300 group-hover:text-orange-500 flex-shrink-0 mt-1" />
  </a>
);

export default LearnMore;
