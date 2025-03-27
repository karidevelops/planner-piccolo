
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="glass-panel p-8 rounded-xl max-w-md text-center space-y-6 animate-fade-in">
        <h1 className="text-6xl font-bold text-gray-900">404</h1>
        <p className="text-xl text-gray-600">Sivua ei löytynyt</p>
        <p className="text-gray-500">Hakemaasi sivua ei ole olemassa tai se on siirretty.</p>
        <Button asChild className="mt-4">
          <a href="/" className="inline-flex items-center gap-2">
            <ArrowLeft size={16} />
            Takaisin etusivulle
          </a>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
