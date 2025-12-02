import React, { useState, useContext, useEffect, useCallback } from 'react';
import { Scholarship, Bookmark, AuthContextType, GeminiResponse } from '../types';
import { AuthContext } from '../App';
import { scholarshipService } from '../services/scholarshipService';
import Button from './Button';

interface ScholarshipCardProps {
  scholarship: Scholarship;
  onBookmarkToggle: (entityId: string, isBookmarked: boolean) => void;
  isBookmarked: boolean;
}

const ScholarshipCard: React.FC<ScholarshipCardProps> = ({
  scholarship,
  onBookmarkToggle,
  isBookmarked,
}) => {
  const { user } = useContext<AuthContextType>(AuthContext);
  const [bookmarkLoading, setBookmarkLoading] = useState<boolean>(false);
  const [geminiSummary, setGeminiSummary] = useState<GeminiResponse>({ text: '', loading: false, error: null });

  const handleBookmarkClick = useCallback(async () => {
    if (!user) {
      alert('Please log in to bookmark scholarships.');
      return;
    }
    setBookmarkLoading(true);
    onBookmarkToggle(scholarship.id, isBookmarked);
    setBookmarkLoading(false);
  }, [user, scholarship.id, isBookmarked, onBookmarkToggle]);

  const handleGenerateSummary = useCallback(async () => {
    if (geminiSummary.loading || geminiSummary.text) return; // Prevent re-fetching
    setGeminiSummary({ text: '', loading: true, error: null });
    try {
      const summary = await scholarshipService.summarizeWithGemini(
        `Scholarship Name: ${scholarship.name}\nDescription: ${scholarship.description}\nCountry: ${scholarship.country}\nBudget: ${scholarship.budget}\nMajor: ${scholarship.major}\nDeadline: ${scholarship.deadline}\nOrganization: ${scholarship.organization}`,
        "Provide a compelling, student-focused summary of this scholarship, highlighting key benefits and requirements. Keep it under 100 words."
      );
      setGeminiSummary({ text: summary || 'No summary generated.', loading: false, error: null });
    } catch (error) {
      console.error('Failed to generate Gemini summary:', error);
      setGeminiSummary({ text: '', loading: false, error: 'Failed to generate summary.' });
    }
  }, [scholarship, geminiSummary.loading, geminiSummary.text]);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 flex flex-col justify-between h-full border border-gray-200">
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{scholarship.name}</h3>
        <p className="text-sm text-gray-600 mb-4">{scholarship.organization}</p>
        <p className="text-gray-700 text-sm mb-4">{scholarship.description}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600 mb-4">
          <p><strong>Country:</strong> {scholarship.country}</p>
          <p><strong>Budget:</strong> ${scholarship.budget.toLocaleString()}</p>
          <p><strong>Major:</strong> {scholarship.major}</p>
        </div>
      </div>
      <div className="mt-4">
        {user && (
          <Button
            onClick={handleBookmarkClick}
            variant={isBookmarked ? 'outline' : 'primary'}
            size="sm"
            className="w-full mb-2"
            loading={bookmarkLoading}
            disabled={bookmarkLoading}
          >
            {isBookmarked ? 'Remove Bookmark' : 'Bookmark Scholarship'}
          </Button>
        )}
        <Button
          onClick={handleGenerateSummary}
          variant="secondary"
          size="sm"
          className="w-full mb-2"
          loading={geminiSummary.loading}
          disabled={geminiSummary.loading}
        >
          {geminiSummary.loading ? 'Generating AI Summary...' : 'Get AI Summary'}
        </Button>
        {geminiSummary.error && (
          <p className="text-red-500 text-xs mt-2">{geminiSummary.error}</p>
        )}
        {geminiSummary.text && (
          <div className="bg-blue-50 border-l-4 border-blue-400 text-blue-800 p-3 mt-3 text-xs italic">
            <p><strong>AI Summary:</strong></p>
            <p>{geminiSummary.text}</p>
          </div>
        )}
        <a
          href={scholarship.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block text-indigo-600 hover:text-indigo-800 text-sm mt-3 w-full text-center"
        >
          View Official Website &rarr;
        </a>
      </div>
    </div>
  );
};

export default ScholarshipCard;