import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home'; // Corrected import for default export
import AgenticAI from './tools/AgenticAI'; 

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="agent" element={<AgenticAI />} /> 
          {/* Other routes... */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}