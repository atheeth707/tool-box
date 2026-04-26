export default function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-8 text-center text-gray-500 dark:text-gray-400">
      <div className="container mx-auto px-4">
        <p>© {new Date().getFullYear()} ToolBox. All rights reserved.</p>
        <p className="text-sm mt-2">Fast, free, and secure online tools processing directly in your browser.</p>
      </div>
    </footer>
  );
}
