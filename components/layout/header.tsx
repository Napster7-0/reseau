"use client";

import { UserNav } from "./user-nav";
import { Button } from "../ui/button";
import { Menu, Search, Settings, HelpCircle, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { Input } from "../ui/input";
import { useSidebar } from "@/hooks/useSidebar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function Header() {
  const { isCollapsed, toggle } = useSidebar();

  return (
    <header className="flex-shrink-0 h-16 flex items-center justify-between bg-[#f6f8fc] w-full fixed top-0 left-0 right-0 px-0 font-['Google_Sans',Roboto,RobotoDraft,Helvetica,Arial,sans-serif] text-[13px] shadow-sm transition-shadow duration-250">
      {/* Left section - Same width as sidebar */}
      <div className={cn(
        "flex items-center transition-all duration-300 border-r px-2",
        isCollapsed ? "w-16 justify-center" : "w-56 justify-start"
      )}>
        <Button 
          variant="ghost" 
          size="icon" 
          className={cn(
            "p-2 hover:bg-[#f1f3f4] rounded-full transition-colors duration-200",
            !isCollapsed && "mr-3"
          )}
          onClick={toggle}
        >
          <Menu className="h-7 w-7 text-[#5f6368]" />
        </Button>
        
        {!isCollapsed && (
          <div className="font-normal text-[22px] leading-[24px] text-[#5f6368] select-none">
            <span className="text-[#5f6368]">K</span>
            <span className="text-[#5f6368]">S</span>
            <span className="text-[#5f6368]">M</span>
          </div>
        )}
      </div>

      {/* Search section */}
      <div className="flex-1 px-8 pl-4">
        <div className="relative max-w-[720px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#5f6368]" />
          <Input
            placeholder="Rechercher dans les messages"
            className="w-full bg-[#f1f3f4] hover:bg-[#f8f9fa] focus:bg-white rounded-full pl-12 pr-4 py-3 h-12 border-0 text-[16px] placeholder:text-[#5f6368] focus:shadow-[0_2px_5px_1px_rgba(64,60,67,.16)] focus:ring-0 focus:border-0 transition-all duration-200"
          />
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-0 px-2">
        <Button 
          variant="ghost" 
          size="icon" 
          className="p-3 hover:bg-[#f1f3f4] rounded-full transition-colors duration-200"
        >
          <HelpCircle className="h-6 w-6 text-[#5f6368]" />
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="p-3 hover:bg-[#f1f3f4] rounded-full transition-colors duration-200"
        >
          <Settings className="h-6 w-6 text-[#5f6368]" />
        </Button>

        {/* Google Apps Menu */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="p-3 hover:bg-[#f1f3f4] rounded-full transition-colors duration-200 mx-2"
        >
          <svg className="h-6 w-6 text-[#5f6368]" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6,8c1.1,0 2,-0.9 2,-2s-0.9,-2 -2,-2 -2,0.9 -2,2 0.9,2 2,2zM12,20c1.1,0 2,-0.9 2,-2s-0.9,-2 -2,-2 -2,0.9 -2,2 0.9,2 2,2zM6,20c1.1,0 2,-0.9 2,-2s-0.9,-2 -2,-2 -2,0.9 -2,2 0.9,2 2,2zM6,14c1.1,0 2,-0.9 2,-2s-0.9,-2 -2,-2 -2,0.9 -2,2 0.9,2 2,2zM12,14c1.1,0 2,-0.9 2,-2s-0.9,-2 -2,-2 -2,0.9 -2,2 0.9,2 2,2zM16,6c0,1.1 0.9,2 2,2s2,-0.9 2,-2 -0.9,-2 -2,-2 -2,0.9 -2,2zM12,8c1.1,0 2,-0.9 2,-2s-0.9,-2 -2,-2 -2,0.9 -2,2 0.9,2 2,2zM18,14c1.1,0 2,-0.9 2,-2s-0.9,-2 -2,-2 -2,0.9 -2,2 0.9,2 2,2zM18,20c1.1,0 2,-0.9 2,-2s-0.9,-2 -2,-2 -2,0.9 -2,2 0.9,2 2,2z"/>
          </svg>
        </Button>

        {/* User Avatar */}
        <div className="ml-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="p-0 hover:ring-2 hover:ring-[#1a73e8] hover:ring-opacity-20 rounded-full transition-all duration-200"
          >
            <div className="w-8 h-8 bg-[#1a73e8] rounded-full flex items-center justify-center text-white font-medium text-sm">
              H
            </div>
          </Button>
        </div>
      </div>
    </header>
  );
}