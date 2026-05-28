import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Category from './pages/Category';
import ToolPage from './pages/ToolPage';

// Import the new AI pages
import Admin from './pages/Admin';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Standalone AI Routes (No Layout wrapper for full-screen feel) */}
        <Route
          path="ai-store"
          element={<AIStore />}
        />
        
        <Route 
          path="admin-control-panel" 
          element={<Admin />} 
        />

        {/* Main Website Routes with Layout */}
        <Route
          path="/"
          element={<Layout />}
        >
          <Route
            index
            element={<Home />}
          />

          <Route
            path="category/:categoryId"
            element={<Category />}
          />

          <Route
            path="tool/:toolId"
            element={<ToolPage />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;