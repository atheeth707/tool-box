import { BrowserRouter, Routes, Route } from 'react-router-dom';[cite: 2, 3]
import Layout from './components/Layout';[cite: 2, 3]
import Home from './pages/Home';[cite: 2, 3]
import Category from './pages/Category';[cite: 2, 3]
import ToolPage from './pages/ToolPage';[cite: 2, 3]

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />[cite: 2, 3]
          <Route path="category/:categoryId" element={<Category />} />[cite: 2, 3]
          <Route path="tool/:toolId" element={<ToolPage />} />[cite: 2, 3]
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;[cite: 2, 3]