import React, { useState, useContext, useCallback } from 'react';
import { University, AuthContextType, GeminiResponse } from '../types';
import { AuthContext } from '../App';
import { scholarshipService } from '../services/scholarshipService';
import Button from './Button';

interface UniversityCardProps {
  university: University;
  onBookmarkToggle: (entityId: string, isBookmarked: boolean) => void;
  isBookmarked: boolean;
}

const UniversityCard: React.FC<UniversityCardProps> = ({
  university,
  onBookmarkToggle,
  isBookmarked,
}) => {
  const { user } = useContext<AuthContextType>(AuthContext);
  const [bookmarkLoading, setBookmarkLoading] = useState<boolean>(false);
  const [geminiSummary, setGeminiSummary] = useState<GeminiResponse>({ text: '', loading: false, error: null });

  const handleBookmarkClick = useCallback(async () => {
    if (!user) {
      alert('Please log in to bookmark universities.');
      return;
    }
    setBookmarkLoading(true);
    onBookmarkToggle(university.id, isBookmarked);
    setBookmarkLoading(false);
  }, [user, university.id, isBookmarked, onBookmarkToggle]);

  const handleGenerateSummary = useCallback(async () => {
    if (geminiSummary.loading || geminiSummary.text) return; // Prevent re-fetching
    setGeminiSummary({ text: '', loading: true, error: null });
    try {
      const summary = await scholarshipService.summarizeWithGemini(
        `University Name: ${university.name}\nCountry: ${university.country}\nPrograms Offered: ${university.programs.join(', ')}`,
        "Provide a concise summary for prospective students about this university, highlighting its key features and programs. Keep it under 100 words."
      );
      setGeminiSummary({ text: summary || 'No summary generated.', loading: false, error: null });
    } catch (error) {
      console.error('Failed to generate Gemini summary:', error);
      setGeminiSummary({ text: '', loading: false, error: 'Failed to generate summary.' });
    }
  }, [university, geminiSummary.loading, geminiSummary.text]);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 flex flex-col justify-between h-full border border-gray-200">
      <div>
        <div className="flex items-center mb-4">
          <img src={university.logoUrl} alt={`${university.name} logo`} className="w-12 h-12 rounded-full mr-4 object-cover" />
          <h3 className="text-xl font-semibold text-gray-900">{university.name}</h3>
        </div>
        <p className="text-gray-700 text-sm mb-4"><strong>Country:</strong> {university.country}</p>
        <p className="text-gray-700 text-sm mb-4"><strong>Programs:</strong> {university.programs.join(', ')}</p>
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
            {isBookmarked ? 'Remove Bookmark' : 'Bookmark University'}
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
          href={university.url}
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

export default UniversityCard;