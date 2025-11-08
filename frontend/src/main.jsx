import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './components/context/AuthContext.jsx';
import { SearchProvider } from './components/context/SearchContext.jsx';
import { PlayListProvider } from './components/context/PlayListContext.jsx';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AuthProvider>
      <SearchProvider>
        <PlayListProvider>
          <App />
        </PlayListProvider>
      </SearchProvider>
    </AuthProvider>
  </BrowserRouter>

)
