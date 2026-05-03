import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout_10 from './components/Layout_10';
import Home_9 from './pages/Home_9';
import Category_9 from './pages/Category_9';
import ToolPage_10 from './pages/ToolPage_10';
import AuthPage_9 from './pages/AuthPage_9'; // Import verbatim
import Pricing_7 from './pages/Pricing_7';
import AgenticAI_8 from './pages/AgenticAI_8';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout_10 />}>
          <Route index element={<Home_9 />} />
          <Route path="category/:categoryId" element={<Category_9 />} />
          <Route path="tool/:toolId" element={<ToolPage_10 />} />
          <Route path="pricing" element={<Pricing_7 />} />
          <Route path="agent" element={<AgenticAI_8 />} />
          {/* CRITICAL FIX: Add this line to handle the /auth path */}
          <Route path="auth" element={<AuthPage_9 />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;