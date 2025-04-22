import { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import PageHeader from './PageHeader';
import Footer from './Footer';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  
  // Determine title based on current route
  const getTitle = (): string => {
    switch(location.pathname) {
      case '/':
        return 'Analytics Overview';
      case '/c4ts':
        return 'C4TS Analytics';
      case '/structurizr':
        return 'Structurizr Analytics';
      default:
        return 'EA Analytics';
    }
  };

  return (
    <div className="app-container">
      <Sidebar />
      
      <div className="main-content">
        <Header />
        
        <main className="flex-1 overflow-auto bg-gray-50">
          <div className="p-6">
            <PageHeader title={getTitle()} />
            {children}
          </div>
        </main>
        
        <Footer />
      </div>
    </div>
  );
};

export default Layout;