import { useState } from 'react';
import { createBrowserRouter, Outlet } from 'react-router-dom';
import Home from '../pages/Home';
import CompanyPage from '../pages/Company';
import NotFound from '../pages/NotFound';
import UpdatePassword from '../pages/UpdatePassword'; // Added this import
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import SignInModal from '../components/auth/SignInModal';
import { AuthProvider, useAuth } from '../context/AuthContext';

const RootLayout = () => {
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  
  const { user, signOut } = useAuth();
  const isAuthenticated = !!user;

  // Intelligently grab the name whether they used Email, Google, or GitHub
  const meta = user?.user_metadata;
  const rawName = meta?.first_name || meta?.full_name || meta?.name || 'Explorer';
  
  // Just grab the first word to keep the UI minimal
  const userName = rawName.split(' ')[0];

  return (
    <div className="min-h-screen flex flex-col bg-bg text-text selection:bg-gold/30">
      <Navbar 
        onOpenSignIn={() => setIsSignInOpen(true)} 
        isAuthenticated={isAuthenticated}
        onSignOut={signOut}
        userName={userName}
      />
      
      <main className="flex-1 flex flex-col w-full">
        <Outlet context={{ isAuthenticated, user }} />
      </main>
      
      <Footer />
      
      <SignInModal 
        isOpen={isSignInOpen} 
        onClose={() => setIsSignInOpen(false)} 
      />
    </div>
  );
};

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <AuthProvider>
        <RootLayout />
      </AuthProvider>
    ),
    errorElement: <NotFound />,
    children: [
      { 
        path: '/', 
        element: <Home /> 
      },
      { 
        path: '/company/:slug', 
        element: <CompanyPage /> 
      },
      { 
        path: '/update-password', 
        element: <UpdatePassword /> // Added the new route here
      },
    ],
  },
]);