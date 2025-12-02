import { GoogleGenAI } from '@google/genai';
import { Scholarship, University, Bookmark, SearchFilters } from '../types';

// Mock Data
const mockScholarships: Scholarship[] = [
  {
    id: 's1',
    name: 'Global Academic Excellence Scholarship',
    description: 'Full tuition scholarship for international students demonstrating outstanding academic achievement.',
    country: 'USA',
    budget: 50000,
    major: 'Any',
    deadline: '2024-12-31',
    url: 'https://www.scholarship-usa.org/global-excellence',
    organization: 'Global Scholars Foundation',
  },
  {
    id: 's2',
    name: 'European Union STEM Grant',
    description: 'Supports students pursuing Science, Technology, Engineering, and Mathematics degrees in EU countries.',
    country: 'Germany',
    budget: 15000,
    major: 'Engineering',
    deadline: '2025-01-15',
    url: 'https://www.eu-grants.org/stem',
    organization: 'European Research Council',
  },
  {
    id: 's3',
    name: 'Commonwealth Scholarship and Fellowship Plan',
    description: 'For students from Commonwealth countries to study in another Commonwealth country.',
    country: 'UK',
    budget: 30000,
    major: 'Social Sciences',
    deadline: '2024-11-01',
    url: 'https://www.cscuk.dfid.gov.uk/',
    organization: 'Commonwealth Scholarship Commission',
  },
  {
    id: 's4',
    name: 'Australia Awards Scholarships',
    description: 'Long and short term awards funded by the Australian Government for eligible developing countries.',
    country: 'Australia',
    budget: 40000,
    major: 'Any',
    deadline: '2025-02-28',
    url: 'https://www.dfat.gov.au/people-to-people/australia-awards/Pages/australia-awards-scholarships',
    organization: 'Australian Department of Foreign Affairs and Trade',
  },
  {
    id: 's5',
    name: 'Japanese Government (MEXT) Scholarships',
    description: 'Scholarships for international students to study in Japan.',
    country: 'Japan',
    budget: 18000,
    major: 'Computer Science',
    deadline: '2024-10-20',
    url: 'https://www.studyjapan.go.jp/en/toj/toj0302e.html',
    organization: 'Ministry of Education, Culture, Sports, Science and Technology',
  },
  {
    id: 's6',
    name: 'Log IQ Opportunity Scholarship',
    description: 'Scholarship for students demonstrating exceptional logical and quantitative intelligence in STEM fields.',
    country: 'Canada',
    budget: 25000,
    major: 'Computer Science',
    deadline: '2025-03-01',
    url: 'https://www.logiqscholarship.org',
    organization: 'Log IQ Foundation',
  },
];

const mockUniversities: University[] = [
  {
    id: 'u1',
    name: 'Harvard University',
    country: 'USA',
    programs: ['Computer Science', 'Business Administration', 'Law'],
    url: 'https://www.harvard.edu/',
    logoUrl: 'https://picsum.photos/50/50?random=1',
  },
  {
    id: 'u2',
    name: 'University of Oxford',
    country: 'UK',
    programs: ['Medicine', 'Engineering', 'Social Sciences'],
    url: 'https://www.ox.ac.uk/',
    logoUrl: 'https://picsum.photos/50/50?random=2',
  },
  {
    id: 'u3',
    name: 'Technical University of Munich',
    country: 'Germany',
    programs: ['Engineering', 'Natural Sciences', 'Architecture'],
    url: 'https://www.tum.de/en/',
    logoUrl: 'https://picsum.photos/50/50?random=3',
  },
  {
    id: 'u4',
    name: 'University of Sydney',
    country: 'Australia',
    programs: ['Arts', 'Education', 'Computer Science'],
    url: 'https://www.sydney.edu.au/',
    logoUrl: 'https://picsum.photos/50/50?random=4',
  },
  {
    id: 'u5',
    name: 'University of Tokyo',
    country: 'Japan',
    programs: ['Engineering', 'Law', 'Medicine'],
    url: 'https://www.u-tokyo.ac.jp/en/',
    logoUrl: 'https://picsum.photos/50/50?random=5',
  },
  {
    id: 'u6',
    name: 'Turkey University',
    country: 'Turkey',
    programs: ['Engineering', 'Business Administration', 'Social Sciences'],
    url: 'https://www.turkey-uni.edu.tr',
    logoUrl: 'https://picsum.photos/50/50?random=6',
  },
];

const mockBookmarks: Bookmark[] = [];

// Gemini API setup
let ai: GoogleGenAI | null = null;
const getGeminiClient = (): GoogleGenAI => {
  if (!ai) {
    if (!process.env.API_KEY) {
      console.warn("API_KEY is not set for Gemini. Gemini features will be unavailable.");
      throw new Error("API_KEY for Gemini is not configured.");
    }
    ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return ai;
};


export const scholarshipService = {
  fetchScholarships: async (filters: SearchFilters): Promise<Scholarship[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filtered = mockScholarships.filter((s) => {
          const matchesQuery = !filters.query || s.name.toLowerCase().includes(filters.query.toLowerCase()) || s.description.toLowerCase().includes(filters.query.toLowerCase());
          const matchesCountry = !filters.country || s.country === filters.country;
          const matchesBudget = !filters.budget || s.budget >= filters.budget;
          const matchesMajor = !filters.major || s.major === 'Any' || s.major.toLowerCase().includes(filters.major.toLowerCase());
          const matchesDeadline = !filters.deadline || new Date(s.deadline) >= new Date(filters.deadline);
          return matchesQuery && matchesCountry && matchesBudget && matchesMajor && matchesDeadline;
        });
        resolve(filtered);
      }, 500);
    });
  },

  fetchUniversities: async (filters: SearchFilters): Promise<University[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filtered = mockUniversities.filter((u) => {
          const matchesQuery = !filters.query || u.name.toLowerCase().includes(filters.query.toLowerCase()) || u.programs.some(p => p.toLowerCase().includes(filters.query.toLowerCase()));
          const matchesCountry = !filters.country || u.country === filters.country;
          const matchesMajor = !filters.major || u.programs.some(p => p.toLowerCase().includes(filters.major.toLowerCase()));
          // No budget/deadline for universities directly in this mock
          return matchesQuery && matchesCountry && matchesMajor;
        });
        resolve(filtered);
      }, 500);
    });
  },

  addBookmark: async (userId: string, entityId: string, entityType: 'scholarship' | 'university'): Promise<Bookmark> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newBookmark: Bookmark = { id: `b-${Date.now()}`, userId, entityId, entityType };
        mockBookmarks.push(newBookmark);
        resolve(newBookmark);
      }, 300);
    });
  },

  removeBookmark: async (bookmarkId: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = mockBookmarks.findIndex((b) => b.id === bookmarkId);
        if (index > -1) {
          mockBookmarks.splice(index, 1);
          resolve(true);
        } else {
          resolve(false);
        }
      }, 300);
    });
  },

  fetchBookmarks: async (userId: string): Promise<Bookmark[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockBookmarks.filter((b) => b.userId === userId));
      }, 400);
    });
  },

  getScholarshipById: async (id: string): Promise<Scholarship | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockScholarships.find(s => s.id === id));
      }, 200);
    });
  },

  getUniversityById: async (id: string): Promise<University | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockUniversities.find(u => u.id === id));
      }, 200);
    });
  },

  addScholarship: async (scholarship: Omit<Scholarship, 'id'>): Promise<Scholarship> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newScholarship: Scholarship = { ...scholarship, id: `s-${Date.now()}` };
        mockScholarships.push(newScholarship);
        resolve(newScholarship);
      }, 500);
    });
  },

  updateScholarship: async (id: string, updatedFields: Partial<Scholarship>): Promise<Scholarship | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = mockScholarships.findIndex(s => s.id === id);
        if (index > -1) {
          mockScholarships[index] = { ...mockScholarships[index], ...updatedFields };
          resolve(mockScholarships[index]);
        } else {
          resolve(null);
        }
      }, 500);
    });
  },

  summarizeWithGemini: async (text: string, promptPrefix: string = "Summarize this information concisely:"): Promise<string | null> => {
    try {
      const aiClient = getGeminiClient();
      const fullPrompt = `${promptPrefix}\n\n${text}`;
      const response = await aiClient.models.generateContent({
        model: 'gemini-2.5-flash', // Using gemini-2.5-flash for general text tasks
        contents: [{ parts: [{ text: fullPrompt }] }],
        config: {
          temperature: 0.7,
          maxOutputTokens: 150,
        },
      });
      const generatedText = response.text;
      if (generatedText) {
        return generatedText.trim();
      }
      return null;
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      return `Failed to generate summary: ${error instanceof Error ? error.message : String(error)}`;
    }
  },
};