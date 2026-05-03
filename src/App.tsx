import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import AgenticAI from './tools/AgenticAI'; 
import Category from './pages/Category';
import ToolPage from './pages/ToolPage';
import Pricing from './pages/Pricing';

export default function App() { // Default export fixed
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="agent" element={<AgenticAI />} /> 
          <Route path="category/:categoryId" element={<Category />} />
          <Route path="tool/:toolId" element={<ToolPage />} />
          <Route path="pricing" element={<Pricing />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}