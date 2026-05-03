import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout_10 from './components/Layout';
import Home_9 from './pages/Home';
import Category_9 from './pages/Category';
import ToolPage_10 from './pages/ToolPage';
import AuthPage_9 from './pages/AuthPage'; // Import verbatim
import Pricing_7 from './pages/Pricing';
import AgenticAI_8 from './pages/AgenticAI';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="category/:categoryId" element={<Category />} />
          <Route path="tool/:toolId" element={<ToolPage />} />
          <Route path="pricing" element={<Pricing />} />
          <Route path="agent" element={<AgenticAI />} />
          {/* CRITICAL FIX: Add this line to handle the /auth path */}
          <Route path="auth" element={<AuthPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;