import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HomeScreen } from './screens/HomeScreen';
import { DetailsScreen } from './screens/DetailsScreen';
import { ErrorBoundary } from './components/ErrorBoundary';

export default function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/details/:id" element={<DetailsScreen />} />
        </Routes>
      </Router>
    </ErrorBoundary>
  );
}
