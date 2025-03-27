
import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, ChevronDown, FileText, Info, User } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="w-full border-b border-gray-100 bg-white/80 backdrop-blur-md supports-backdrop-blur:bg-white/60 z-50 h-16 flex items-center px-6 sticky top-0">
      <div className="flex items-center gap-1 mr-6">
        <Calendar className="w-6 h-6 text-blue-500" />
        <span className="font-semibold text-lg">Projektin aikataulu</span>
      </div>
      
      <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
        <a href="#" className="text-gray-900 hover:text-blue-500 transition">Yhteenveto</a>
        <a href="#" className="text-blue-500 border-b-2 border-blue-500 pb-[18px] pt-[17px]">Gantt-kaavio</a>
        <a href="#" className="text-gray-900 hover:text-blue-500 transition">Resurssit</a>
        <a href="#" className="text-gray-900 hover:text-blue-500 transition">Raportit</a>
      </nav>
      
      <div className="ml-auto flex items-center gap-2">
        <Button variant="outline" size="sm" className="hidden md:flex gap-1">
          <FileText size={16} />
          <span>Dokumentit</span>
        </Button>
        
        <Button variant="outline" size="sm" className="hidden md:flex gap-1">
          <Info size={16} />
          <span>Ohjeet</span>
        </Button>
        
        <Button variant="ghost" size="icon" className="rounded-full w-8 h-8 md:ml-2">
          <User size={18} />
        </Button>
      </div>
    </header>
  );
};

export default Header;
