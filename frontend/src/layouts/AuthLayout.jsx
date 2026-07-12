import React from 'react';
import { Outlet } from 'react-router-dom';
import { Leaf } from 'lucide-react';

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8" style={{ background: '#FCFBF7' }}>
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex items-center justify-center space-x-3 mb-3">
          <div className="p-2.5 rounded-2xl" style={{ background: '#9BBDAF33' }}>
            <Leaf className="h-8 w-8" style={{ color: '#9BBDAF' }} />
          </div>
        </div>
        <h2 className="text-center text-3xl font-bold tracking-tight" style={{ color: '#2F2F2F' }}>
          EcoSphere
        </h2>
        <p className="mt-2 text-center text-sm" style={{ color: '#6B7280' }}>
          Enterprise ESG Management Platform
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div
          className="py-8 px-6 sm:rounded-2xl sm:px-10 border"
          style={{ background: '#ffffff', borderColor: '#ECE8E3', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}
        >
          <Outlet />
        </div>
        <p className="mt-6 text-center text-xs" style={{ color: '#6B7280' }}>
          Powered by EcoSphere · Sustainable Enterprise Software
        </p>
      </div>
    </div>
  );
};

export default AuthLayout;
