import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// MainLayout component that wraps around all pages, providing a consistent layout with a navbar and footer.
function MainLayout() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto min-h-[calc(100vh-80px)] w-full max-w-7xl px-4 pt-8 sm:px-6 lg:px-10">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

// Export the MainLayout component for use in routing.
export default MainLayout;

