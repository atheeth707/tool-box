import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-4 text-center text-gray-500 dark:text-gray-400">
      <div className="container mx-auto px-4">
        <p className="text-xs">© {new Date().getFullYear()} ToolBox. All rights reserved.</p>
        <p className="text-xs mt-1">
          Any Tool Not Works? {' '}
          <a 
            href="https://tool-box-free.vercel.app/tool/report" 
            className="text-blue-500 hover:underline font-bold"
          >
            Report Here
          </a>
        </p>
      </div>
    </footer>
  );
}