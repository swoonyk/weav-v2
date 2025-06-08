"use client";

import React from "react";
import SideBar from "@/components/SideBar";

interface RootLayoutProps {
  children: React.ReactNode;
}

const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
  return (
    <div className="page-container">
      <div className="flex h-full">
        <SideBar />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default RootLayout; 