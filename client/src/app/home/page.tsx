import { ProtectedRoute } from '@/modules/auth/protected-route/ProtectedRoute';
import React from 'react';

export default function HomePage() {
  return (
    <ProtectedRoute>
      <div>page</div>;
    </ProtectedRoute>
  );
}
