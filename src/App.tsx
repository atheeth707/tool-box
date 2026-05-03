import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import AgenticAI from './tools/AgenticAI'; // Import your AI component

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          {/* ... other routes ... */}
          <Route path="agent" element={<AgenticAI />} /> 
        </Route>
      </Routes>
    </BrowserRouter>
  );
}