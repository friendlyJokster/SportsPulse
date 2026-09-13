export type UserRole = 'admin' | 'user';

export interface AuthUser {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  phone?: string;
  avatar: string;
  title: string;
  verified: boolean;
  city: string;
  primarySport?: string;
  adminPrivileges?: {
    canOverrideScores: boolean;
    canCreateTournaments: boolean;
    canManageFinances: boolean;
    canVerifyPlayers: boolean;
  };
}

export const PRESET_ACCOUNTS: AuthUser[] = [
  {
    id: 'admin_rajesh',
    name: 'Rajesh Varma',
    role: 'admin',
    email: 'admin@sportpulse.io',
    phone: '+91 98200 11223',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    title: 'Tournament Director & Chief Match Official',
    verified: true,
    city: 'Mumbai, MH',
    primarySport: 'cricket',
    adminPrivileges: {
      canOverrideScores: true,
      canCreateTournaments: true,
      canManageFinances: true,
      canVerifyPlayers: true,
    },
  },
  {
    id: 'admin_deepak',
    name: 'Deepak Mehta',
    role: 'admin',
    email: 'scorer@sportpulse.io',
    phone: '+91 98111 22334',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    title: 'Senior Match Official & Ground Umpire',
    verified: true,
    city: 'Bengaluru, KA',
    primarySport: 'cricket',
    adminPrivileges: {
      canOverrideScores: true,
      canCreateTournaments: true,
      canManageFinances: false,
      canVerifyPlayers: true,
    },
  },
  {
    id: 'user_aarav',
    name: 'Aarav Sharma',
    role: 'user',
    email: 'aarav@sportpulse.io',
    phone: '+91 98765 43210',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    title: 'Top-Order Batsman & Right-Arm Off-Spin',
    verified: true,
    city: 'Mumbai, MH',
    primarySport: 'cricket',
  },
  {
    id: 'user_rahul',
    name: 'Rahul Yadav',
    role: 'user',
    email: 'rahul.kabaddi@sportpulse.io',
    phone: '+91 98123 45678',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    title: 'Lead Raider • Delhi Dynamos Grassroots',
    verified: true,
    city: 'Delhi, DL',
    primarySport: 'kabaddi',
  },
  {
    id: 'user_priya',
    name: 'Priya Nair',
    role: 'user',
    email: 'priya.fan@sportpulse.io',
    phone: '+91 99999 88888',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    title: 'Sports Fan & Weekend Badminton Enthusiast',
    verified: false,
    city: 'Bengaluru, KA',
    primarySport: 'badminton',
  },
];
