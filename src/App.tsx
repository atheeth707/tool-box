import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Layout from './components/Layout';
import Home from './pages/Home';
import Category from './pages/Category';
import ToolPage from './pages/ToolPage';
import AI from './pages/AI';

function App() {
  return (
    <BrowserRouter>

      <Routes>

        <Route path="/" element={<Layout />}>

          <Route
            index
            element={<Home />}
          />

          <Route
            path="ai"
            element={<AI />}
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