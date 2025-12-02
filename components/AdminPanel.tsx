import React, { useState, useEffect, useCallback } from 'react';
import { Scholarship } from '../types';
import { scholarshipService } from '../services/scholarshipService';
import { COUNTRIES, MAJORS } from '../constants';
import Button from './Button';

const AdminPanel: React.FC = () => {
  const [newScholarship, setNewScholarship] = useState<Omit<Scholarship, 'id'>>({
    name: '',
    description: '',
    country: '',
    budget: 0,
    major: '',
    deadline: '',
    url: '',
    organization: '',
  });
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [loadingScholarships, setLoadingScholarships] = useState<boolean>(true);
  const [editMode, setEditMode] = useState<Scholarship | null>(null);

  const fetchScholarships = useCallback(async () => {
    setLoadingScholarships(true);
    try {
      const fetched = await scholarshipService.fetchScholarships({
        country: '',
        budget: '',
        major: '',
        deadline: '',
        query: '',
      });
      setScholarships(fetched);
    } catch (error) {
      console.error('Error fetching scholarships for admin:', error);
    } finally {
      setLoadingScholarships(false);
    }
  }, []);

  useEffect(() => {
    fetchScholarships();
  }, [fetchScholarships]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (editMode) {
      setEditMode((prev) => prev ? { ...prev, [name]: name === 'budget' ? parseFloat(value) : value } : null);
    } else {
      setNewScholarship((prev) => ({ ...prev, [name]: name === 'budget' ? parseFloat(value) : value }));
    }
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitLoading(true);
    setSubmitMessage(null);
    try {
      await scholarshipService.addScholarship(newScholarship);
      setSubmitMessage('Scholarship added successfully!');
      setNewScholarship({
        name: '', description: '', country: '', budget: 0, major: '', deadline: '', url: '', organization: '',
      });
      fetchScholarships(); // Refresh list
    } catch (error) {
      setSubmitMessage(`Failed to add scholarship: ${error instanceof Error ? error.message : 'Unknown error'}`);
      console.error('Error adding scholarship:', error);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editMode) return;
    setSubmitLoading(true);
    setSubmitMessage(null);
    try {
      await scholarshipService.updateScholarship(editMode.id, editMode);
      setSubmitMessage('Scholarship updated successfully!');
      setEditMode(null);
      fetchScholarships(); // Refresh list
    } catch (error) {
      setSubmitMessage(`Failed to update scholarship: ${error instanceof Error ? error.message : 'Unknown error'}`);
      console.error('Error updating scholarship:', error);
    } finally {
      setSubmitLoading(false);
    }
  };

  const startEdit = (scholarship: Scholarship) => {
    setEditMode(scholarship);
    setSubmitMessage(null);
  };

  const cancelEdit = () => {
    setEditMode(null);
    setSubmitMessage(null);
  };

  const renderForm = (data: Omit<Scholarship, 'id'> | Scholarship, onSubmit: (e: React.FormEvent) => void) => (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Scholarship Name</label>
        <input type="text" id="name" name="name" value={data.name} onChange={handleChange} required
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
      </div>
      <div>
        <label htmlFor="organization" className="block text-sm font-medium text-gray-700">Organization</label>
        <input type="text" id="organization" name="organization" value={data.organization} onChange={handleChange} required
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
        <textarea id="description" name="description" value={data.description} onChange={handleChange} required
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 h-24"></textarea>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="country" className="block text-sm font-medium text-gray-700">Country</label>
          <select id="country" name="country" value={data.country} onChange={handleChange} required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
            <option value="">Select Country</option>
            {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="major" className="block text-sm font-medium text-gray-700">Major</label>
          <select id="major" name="major" value={data.major} onChange={handleChange} required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
            <option value="">Select Major</option>
            <option value="Any">Any</option>
            {MAJORS.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="budget" className="block text-sm font-medium text-gray-700">Budget ($)</label>
          <input type="number" id="budget" name="budget" value={data.budget} onChange={handleChange} required min="0"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
        </div>
        <div>
          <label htmlFor="deadline" className="block text-sm font-medium text-gray-700">Deadline</label>
          <input type="date" id="deadline" name="deadline" value={data.deadline} onChange={handleChange} required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
        </div>
      </div>
      <div>
        <label htmlFor="url" className="block text-sm font-medium text-gray-700">Official URL</label>
        <input type="url" id="url" name="url" value={data.url} onChange={handleChange} required
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
      </div>
      <div className="flex justify-end space-x-2">
        {editMode && (
          <Button type="button" variant="secondary" onClick={cancelEdit}>
            Cancel
          </Button>
        )}
        <Button type="submit" loading={submitLoading} disabled={submitLoading}>
          {editMode ? 'Update Scholarship' : 'Add Scholarship'}
        </Button>
      </div>
    </form>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">Admin Panel</h1>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">
          {editMode ? `Edit Scholarship: ${editMode.name}` : 'Add New Scholarship'}
        </h2>
        {submitMessage && (
          <div className={`p-3 mb-4 rounded-md ${submitMessage.includes('successfully') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {submitMessage}
          </div>
        )}
        {renderForm(editMode || newScholarship, editMode ? handleUpdateSubmit : handleAddSubmit)}
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">Existing Scholarships</h2>
        {loadingScholarships ? (
          <div className="flex justify-center items-center py-10">
            <svg className="animate-spin h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="ml-2 text-lg text-gray-700">Loading scholarships...</span>
          </div>
        ) : scholarships.length === 0 ? (
          <p className="text-center text-gray-600">No scholarships found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Country</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Budget</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deadline</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {scholarships.map((s) => (
                  <tr key={s.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{s.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{s.country}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${s.budget.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(s.deadline).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button variant="secondary" size="sm" onClick={() => startEdit(s)}>Edit</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
