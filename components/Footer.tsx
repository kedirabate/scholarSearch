import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white py-6 mt-8">
      <div className="container mx-auto px-4 text-center">
        <p>&copy; {new Date().getFullYear()} ScholarSearch. All rights reserved.</p>
        <p className="mt-2 text-sm">
          Powered by Generative AI. <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">Billing information</a>.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
