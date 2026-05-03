import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Category from './pages/Category';
import ToolPage from './pages/ToolPage';
import AuthPage from './pages/AuthPage';
import Pricing from './pages/Pricing';
import AgenticAI from './pages/AgenticAI';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="category/:categoryId" element={<Category />} />
          <Route path="tool/:toolId" element={<ToolPage />} />
          <Route path="pricing" element={<Pricing />} />
          <Route path="agent" element={<AgenticAI />} />
          <Route path="auth" element={<AuthPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}