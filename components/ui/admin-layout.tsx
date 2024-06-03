// components/AdminLayout.tsx
import React from 'react';
import Link from 'next/link';

const AdminLayout = ({ children }) => {
  return (
    <div className="admin-layout">
      <aside className="sidebar">
        <ul>
          <li><Link href="/admin">Dashboard</Link></li>
          <li><Link href="/admin/users">Users</Link></li>
          <li><Link href="/admin/settings">Settings</Link></li>
        </ul>
      </aside>
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
