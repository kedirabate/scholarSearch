import React, { useContext, useEffect, useState, useCallback } from 'react';
import { AuthContext } from '../App';
import { Bookmark, Scholarship, University, AuthContextType } from '../types';
import { scholarshipService } from '../services/scholarshipService';
import ScholarshipCard from './ScholarshipCard';
import UniversityCard from './UniversityCard';
import Button from './Button';

const Dashboard: React.FC = () => {
  const { user, loading: authLoading } = useContext<AuthContextType>(AuthContext);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [bookmarkedScholarships, setBookmarkedScholarships] = useState<Scholarship[]>([]);
  const [bookmarkedUniversities, setBookmarkedUniversities] = useState<University[]>([]);

  const fetchBookmarksAndDetails = useCallback(async () => {
    if (!user) {
      setError('User not authenticated.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const fetchedBookmarks = await scholarshipService.fetchBookmarks(user.id);
      setBookmarks(fetchedBookmarks);

      const scholarshipPromises = fetchedBookmarks
        .filter(b => b.entityType === 'scholarship')
        .map(b => scholarshipService.getScholarshipById(b.entityId));
      const universityPromises = fetchedBookmarks
        .filter(b => b.entityType === 'university')
        .map(b => scholarshipService.getUniversityById(b.entityId));

      const scholarships = (await Promise.all(scholarshipPromises)).filter(
        (s): s is Scholarship => s !== undefined
      );
      const universities = (await Promise.all(universityPromises)).filter(
        (u): u is University => u !== undefined
      );

      setBookmarkedScholarships(scholarships);
      setBookmarkedUniversities(universities);
    } catch (err) {
      setError('Failed to load bookmarks.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!authLoading) {
      fetchBookmarksAndDetails();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, authLoading]); // Re-fetch if user changes or auth loading state resolves

  const handleRemoveBookmark = useCallback(async (entityId: string, entityType: 'scholarship' | 'university') => {
    if (!user) return;
    const bookmarkToRemove = bookmarks.find(
      (b) => b.userId === user.id && b.entityId === entityId && b.entityType === entityType
    );
    if (!bookmarkToRemove) return;

    try {
      await scholarshipService.removeBookmark(bookmarkToRemove.id);
      alert('Bookmark removed successfully!');
      fetchBookmarksAndDetails(); // Re-fetch to update the list
    } catch (err) {
      alert('Failed to remove bookmark.');
      console.error('Remove bookmark error:', err);
    }
  }, [user, bookmarks, fetchBookmarksAndDetails]);


  if (loading) {
    return (
      <div className="min-h-[calc(100vh-10rem)] flex justify-center items-center">
        <svg className="animate-spin h-10 w-10 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span className="ml-3 text-lg text-gray-700">Loading your dashboard...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[calc(100vh-10rem)] flex justify-center items-center">
        <p className="text-red-600 text-lg">{error}</p>
      </div>
    );
  }

  const hasBookmarks = bookmarkedScholarships.length > 0 || bookmarkedUniversities.length > 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">Your Dashboard</h1>

      {!hasBookmarks && (
        <div className="bg-blue-50 border-l-4 border-blue-400 text-blue-800 p-4 mb-6 rounded-md">
          <p className="font-semibold text-center">You haven't bookmarked any scholarships or universities yet.</p>
          <p className="text-center mt-2">Start exploring on the <a href="/#" className="text-indigo-600 hover:underline">Search page</a>!</p>
        </div>
      )}

      {bookmarkedScholarships.length > 0 && (
        <>
          <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-2">Bookmarked Scholarships</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {bookmarkedScholarships.map((scholarship) => (
              <ScholarshipCard
                key={scholarship.id}
                scholarship={scholarship}
                onBookmarkToggle={(id) => handleRemoveBookmark(id, 'scholarship')}
                isBookmarked={true}
              />
            ))}
          </div>
        </>
      )}

      {bookmarkedUniversities.length > 0 && (
        <>
          <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-2">Bookmarked Universities</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookmarkedUniversities.map((university) => (
              <UniversityCard
                key={university.id}
                university={university}
                onBookmarkToggle={(id) => handleRemoveBookmark(id, 'university')}
                isBookmarked={true}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
