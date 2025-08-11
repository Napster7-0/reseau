"use client";

import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import React from "react";
import { ComposeWindow } from "@/components/ui/compose-window";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen w-screen overflow-hidden bg-[#f6f8fc]">
      <Header />
      <div className="flex pt-16"> {/* Padding top pour compenser le header fixé */}
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-4">
          {children}
        </main>
      </div>
      <ComposeWindow />
    </div>
  );
}