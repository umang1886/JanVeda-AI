import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Navbar from './components/common/Navbar.jsx';
import Footer from './components/common/Footer.jsx';
import SkipLink from './components/common/SkipLink.jsx';
import LoadingSpinner from './components/common/LoadingSpinner.jsx';
import ErrorBoundary from './components/common/ErrorBoundary.jsx';
import Toast from './components/common/Toast.jsx';

/* ── Lazy-loaded page components ─────────────────────────────── */
const Home = lazy(() => import('./pages/Home.jsx'));
const BoothFinderPage = lazy(() => import('./pages/BoothFinderPage.jsx'));
const TimelinePage = lazy(() => import('./pages/TimelinePage.jsx'));
const FirstTimeVoterPage = lazy(() => import('./pages/FirstTimeVoterPage.jsx'));
const SimulatorPage = lazy(() => import('./pages/SimulatorPage.jsx'));
const QuizPage = lazy(() => import('./pages/QuizPage.jsx'));
const GlossaryPage = lazy(() => import('./pages/GlossaryPage.jsx'));
const ChatbotPage = lazy(() => import('./pages/ChatbotPage.jsx'));
const NotFound = lazy(() => import('./pages/NotFound.jsx'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ErrorBoundary>
          <SkipLink />
          <Navbar />
          <main id="main-content" className="page-wrapper">
            <Suspense fallback={<LoadingSpinner fullPage />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/booth-finder" element={<BoothFinderPage />} />
                <Route path="/timeline" element={<TimelinePage />} />
                <Route path="/first-time-voter" element={<FirstTimeVoterPage />} />
                <Route path="/simulator" element={<SimulatorPage />} />
                <Route path="/quiz" element={<QuizPage />} />
                <Route path="/glossary" element={<GlossaryPage />} />
                <Route path="/chatbot" element={<ChatbotPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </main>
          <Footer />
          <Toast />
        </ErrorBoundary>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
