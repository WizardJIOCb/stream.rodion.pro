import { createBrowserRouter } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import App from './App';

const HomePage = lazy(() => import('./pages/HomePage'));
const GamePage = lazy(() => import('./pages/GamePage'));
const ClipsPage = lazy(() => import('./pages/ClipsPage'));
const FormatsPage = lazy(() => import('./pages/FormatsPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const AdminLoginPage = lazy(() => import('./pages/AdminLoginPage'));
const AdminDashboardPage = lazy(() => import('./pages/AdminDashboardPage'));

function SuspenseWrapper({ children }: { children: React.ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      {children}
    </Suspense>
  );
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <SuspenseWrapper><HomePage /></SuspenseWrapper> },
      { path: 'game/:slug', element: <SuspenseWrapper><GamePage /></SuspenseWrapper> },
      { path: 'clips', element: <SuspenseWrapper><ClipsPage /></SuspenseWrapper> },
      { path: 'formats', element: <SuspenseWrapper><FormatsPage /></SuspenseWrapper> },
      { path: 'about', element: <SuspenseWrapper><AboutPage /></SuspenseWrapper> },
      { path: 'admin', element: <SuspenseWrapper><AdminLoginPage /></SuspenseWrapper> },
      { path: 'admin/dashboard', element: <SuspenseWrapper><AdminDashboardPage /></SuspenseWrapper> },
    ],
  },
]);
