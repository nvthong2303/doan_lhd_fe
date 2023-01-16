import { Suspense, lazy } from 'react';
// components
import LoadingScreen from '../components/loading-screen';

// ----------------------------------------------------------------------

const Loadable = (Component) => (props) =>
  (
    <Suspense fallback={<LoadingScreen />}>
      <Component {...props} />
    </Suspense>
  );

// ----------------------------------------------------------------------

// AUTH
export const LoginPage = Loadable(lazy(() => import('../pages/auth/LoginPage')));
export const RegisterPage = Loadable(lazy(() => import('../pages/auth/RegisterPage')));

export const Page404 = Loadable(lazy(() => import('../pages/Page404')));
export const HomePage = Loadable(lazy(() => import('../pages/HomePage')));
export const LearningPage = Loadable(lazy(() => import('../pages/LearningPage')));
export const LearningSectionPage = Loadable(lazy(() => import('../pages/LearningSectionPage')));
export const TranslationItemPage = Loadable(lazy(() => import('../pages/TranslationItemPage')));

export const UserAccountPage = Loadable(lazy(() => import('../pages/UserAccountPage')));
