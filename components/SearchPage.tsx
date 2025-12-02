import React, { useState, useEffect, useCallback, useContext } from 'react';
import { Scholarship, University, SearchFilters, AuthContextType, Bookmark } from '../types';
import { scholarshipService } from '../services/scholarshipService';
import { COUNTRIES, MAJORS } from '../constants';
import ScholarshipCard from './ScholarshipCard';
import UniversityCard from './UniversityCard';
import Button from './Button';
import { AuthContext } from '../App';

type SearchResultType = 'scholarships' | 'universities';

const SearchPage: React.FC = () => {
  const { user } = useContext<AuthContextType>(AuthContext);
  const [activeTab, setActiveTab] = useState<SearchResultType>('scholarships');
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<SearchFilters>({
    country: '',
    budget: '',
    major: '',
    deadline: '',
    query: '',
  });
  const [userBookmarks, setUserBookmarks] = useState<Record<string, Bookmark>>({});

  const fetchBookmarks = useCallback(async () => {
    if (user) {
      try {
        const bookmarks: Bookmark[] = await scholarshipService.fetchBookmarks(user.id);
        const bookmarkMap: Record<string, Bookmark> = {};
        bookmarks.forEach((b: Bookmark) => (bookmarkMap[b.entityId] = b));
        setUserBookmarks(bookmarkMap);
      } catch (err) {
        console.error('Failed to fetch bookmarks:', err);
      }
    } else {
      setUserBookmarks({});
    }
  }, [user]);

  useEffect(() => {
    fetchBookmarks();
  }, [fetchBookmarks]);

  const performSearch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (activeTab === 'scholarships') {
        const fetchedScholarships = await scholarshipService.fetchScholarships(filters);
        setScholarships(fetchedScholarships);
      } else {
        const fetchedUniversities = await scholarshipService.fetchUniversities(filters);
        setUniversities(fetchedUniversities);
      }
    } catch (err) {
      setError('Failed to fetch results. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [activeTab, filters]);

  useEffect(() => {
    performSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]); // Only re-run when activeTab changes, initial search on mount.

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: name === 'budget' && value ? parseFloat(value) : value,
    }));
  };

  const handleBookmarkToggle = useCallback(async (entityId: string, isBookmarked: boolean, entityType: 'scholarship' | 'university') => {
    if (!user) {
      alert('You must be logged in to bookmark items.');
      return;
    }
    try {
      if (isBookmarked) {
        // Find the bookmark to remove
        const bookmarkToRemove = Object.values(userBookmarks).find(
          (b: Bookmark) => b.entityId === entityId && b.entityType === entityType
        );
        if (bookmarkToRemove) {
          await scholarshipService.removeBookmark(bookmarkToRemove.id);
          const newBookmarks = { ...userBookmarks };
          delete newBookmarks[entityId];
          setUserBookmarks(newBookmarks);
        }
      } else {
        const newBookmark = await scholarshipService.addBookmark(user.id, entityId, entityType);
        setUserBookmarks((prev) => ({ ...prev, [newBookmark.entityId]: newBookmark }));
      }
    } catch (err) {
      alert(`Failed to ${isBookmarked ? 'remove' : 'add'} bookmark.`);
      console.error('Bookmark toggle error:', err);
    }
  }, [user, userBookmarks]);


  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">
        Find Your Perfect Opportunity
      </h1>

      {/* Search Input */}
      <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
        <label htmlFor="search-query" className="sr-only">Search</label>
        <input
          id="search-query"
          type="text"
          name="query"
          placeholder="Search for scholarships, universities or majors..."
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-lg"
          value={filters.query}
          onChange={handleFilterChange}
        />
        <Button onClick={performSearch} className="mt-4 w-full" loading={loading} disabled={loading}>
          Search
        </Button>
      </div>

      {/* Filters Section */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Filter Results</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label htmlFor="country" className="block text-sm font-medium text-gray-700">Country</label>
            <select
              id="country"
              name="country"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              value={filters.country}
              onChange={handleFilterChange}
            >
              <option value="">All Countries</option>
              {COUNTRIES.map((country) => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="major" className="block text-sm font-medium text-gray-700">Major/Program</label>
            <select
              id="major"
              name="major"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              value={filters.major}
              onChange={handleFilterChange}
            >
              <option value="">All Majors</option>
              {MAJORS.map((major) => (
                <option key={major} value={major}>{major}</option>
              ))}
            </select>
          </div>
          {activeTab === 'scholarships' && (
            <>
              <div>
                <label htmlFor="budget" className="block text-sm font-medium text-gray-700">Min. Budget ($)</label>
                <input
                  id="budget"
                  type="number"
                  name="budget"
                  placeholder="e.g., 10000"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={filters.budget}
                  onChange={handleFilterChange}
                  min="0"
                />
              </div>
              <div>
                <label htmlFor="deadline" className="block text-sm font-medium text-gray-700">Deadline Before</label>
                <input
                  id="deadline"
                  type="date"
                  name="deadline"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={filters.deadline}
                  onChange={handleFilterChange}
                />
              </div>
            </>
          )}
        </div>
        <Button onClick={performSearch} className="mt-6 w-full md:w-auto" loading={loading} disabled={loading}>
          Apply Filters
        </Button>
      </div>

      {/* Tab Navigation */}
      <div className="mb-8 flex justify-center">
        <button
          onClick={() => setActiveTab('scholarships')}
          className={`px-6 py-3 text-lg font-medium rounded-t-lg transition-colors duration-200 ${
            activeTab === 'scholarships'
              ? 'bg-indigo-600 text-white shadow-lg'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Scholarships
        </button>
        <button
          onClick={() => setActiveTab('universities')}
          className={`px-6 py-3 text-lg font-medium rounded-t-lg transition-colors duration-200 ${
            activeTab === 'universities'
              ? 'bg-indigo-600 text-white shadow-lg'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Universities
        </button>
      </div>

      {/* Results Display */}
      {loading && (
        <div className="flex justify-center items-center py-10">
          <svg className="animate-spin h-10 w-10 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="ml-3 text-lg text-gray-700">Loading results...</span>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-center" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}

      {!loading && !error && activeTab === 'scholarships' && (
        <>
          {scholarships.length === 0 ? (
            <p className="text-center text-gray-600 text-lg py-10">No scholarships found matching your criteria.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {scholarships.map((scholarship) => (
                <ScholarshipCard
                  key={scholarship.id}
                  scholarship={scholarship}
                  onBookmarkToggle={(id, isBookmarked) => handleBookmarkToggle(id, isBookmarked, 'scholarship')}
                  isBookmarked={!!userBookmarks[scholarship.id] && userBookmarks[scholarship.id].entityType === 'scholarship'}
                />
              ))}
            </div>
          )}
        </>
      )}

      {!loading && !error && activeTab === 'universities' && (
        <>
          {universities.length === 0 ? (
            <p className="text-center text-gray-600 text-lg py-10">No universities found matching your criteria.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {universities.map((university) => (
                <UniversityCard
                  key={university.id}
                  university={university}
                  onBookmarkToggle={(id, isBookmarked) => handleBookmarkToggle(id, isBookmarked, 'university')}
                  isBookmarked={!!userBookmarks[university.id] && userBookmarks[university.id].entityType === 'university'}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SearchPage;