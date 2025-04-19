 
import React from 'react';
import { useAuth } from './AuthContext';
import { AdminStack } from './AdminStack';
import { DantaStack } from './DantaStack';
import { UserStack } from './UserStack';

export default function RoleSwitcher() {
  const { user } = useAuth();
  if (!user) return null;

  switch (user.role) {
    case 'admin':
      return <AdminStack />;
    case 'dantasurakshaks':
      return <DantaStack />;
    default:
      return <UserStack />;
  }
}
