// src/App.jsx
import React from 'react';
import Header  from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import Footer  from './components/layout/Footer';

export default function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6">
          {/* Your page content goes here */}
        </main>
      </div>

      <Footer />
    </div>
  );
}
