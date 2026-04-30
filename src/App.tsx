import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Category from './pages/Category';
import ToolPage from './pages/ToolPage';
// Import your new AI component
import AiUpscaler from './AiUpscaler';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="category/:categoryId" element={<Category />} />
          <Route path="tool/:toolId" element={<ToolPage />} />
          
          {/* New route for the Child AI Trend tool */}
          <Route path="child-ai" element={<AiUpscaler />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;