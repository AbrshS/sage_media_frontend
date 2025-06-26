import { ReactNode, useEffect } from "react";
import Header from "./Header";
import MotionBackground from "./MotionBackground";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  useEffect(() => {
    // Add the font link to the document head
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap';
    document.head.appendChild(link);
    
    return () => {
      // Clean up when component unmounts
      document.head.removeChild(link);
    };
  }, []);
  
  return (
    <div className="flex flex-col min-h-screen font-['Poppins',sans-serif]">
      <Header />
      <MotionBackground />
      <main className="flex-grow">
        {children}
      </main>
    </div>
  );
}