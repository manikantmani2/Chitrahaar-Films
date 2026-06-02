import React from 'react';
import AdminContentManager from '@/components/AdminContentManager';
import type { GetServerSideProps } from 'next';
import { hasAdminAccess } from '@/lib/adminAuth';

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-[#0b0b0b] p-8">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-3xl font-semibold mb-6 text-white">Admin — Content Studio</h1>
        <AdminContentManager />
      </div>
    </main>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  if (!(await hasAdminAccess(req as any, res as any))) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return { props: {} };
};
