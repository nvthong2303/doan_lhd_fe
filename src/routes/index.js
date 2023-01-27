import { Navigate, useRoutes } from 'react-router-dom';
import GuestGuard from '../auth/GuestGuard';
import AuthGuard from '../auth/AuthGuard';
import MainLayout from '../layouts/main';
import CompactLayout from '../layouts/compact';
import {
  LoginPage,
  RegisterPage,
  Page404,
  HomePage,
  LearningSectionPage,
  LearningPage,
  UserAccountPage,
  TranslationItemPage,
} from './elements';

export default function Router() {
  return useRoutes([
    {
      path: 'account',
      element: (
        <MainLayout />
      ),
      children: [{ index: true, element: <UserAccountPage /> }],
    },
    {
      path: 'auth',
      children: [
        {
          path: 'login',
          element: (
            <GuestGuard>
              <LoginPage />
            </GuestGuard>
          ),
        },
        {
          path: 'register',
          element: (
            <GuestGuard>
              <RegisterPage />
            </GuestGuard>
          ),
        },
      ],
    },
    {
      path: 'learn',
      element: <MainLayout />,
      children: [
        { element: <LearningPage />, index: true },
        { path: ':id', element: <LearningSectionPage /> },
      ],
    },
    {
      path: 'translation',
      element: <MainLayout />,
      children: [
        { element: <TranslationItemPage />, index: true },
        { path: ':id', element: <LearningSectionPage /> },
      ],
    },

    // Main Routes
    {
      element: <MainLayout />,
      children: [
        { element: <HomePage />, index: true },
        { element: <TranslationItemPage />, path: '/translation/:word' },
      ],
    },
    {
      element: <CompactLayout />,
      children: [{ path: '404', element: <Page404 /> }],
    },
    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}
