import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AIStore from './pages/AIStore';
import Layout from './components/Layout';
import Home from './pages/Home';
import Category from './pages/Category';
import ToolPage from './pages/ToolPage';

function App() {

  return (

    <BrowserRouter>

      <Routes>

<Route
  path="ai-store"
  element={<AIStore />}
/>


<Route path="/admin-control-panel" 
element={<Admin />} />

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