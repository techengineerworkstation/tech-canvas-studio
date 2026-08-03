'use client';

import React from 'react';
import dynamic from 'next/dynamic';

const AppShell = dynamic(
  () => import('@/components/layout/AppShell').then((mod) => mod.AppShell),
  { ssr: false }
);

export default function Home() {
  return <AppShell />;
}
