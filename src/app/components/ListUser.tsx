'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

type User = {
  id: string;
  username: string;
  password: string;
  fullname: string;
  created_at: Date;
  email: string;
};

export default function ListUser() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase.from('tbl_users').select('*');
      if (error) {
        setError(error.message);
      } else {
        setUsers(data || []);
      }
      setLoading(false);
    };

    fetchUsers();
  }, []);

  if (loading) return <p>Loading users...</p>;
  if (error) return <p className="text-red-600">Error: {error}</p>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">User List</h2>
      <ul className="space-y-3">
        {users.map((user) => (
          <li key={user.id} className="bg-black border border-white mb-12 rounded-lg p-4 shadow">
            <p className="font-semibold">{user.username}</p>
            <p className="text-sm text-white">{user.email}</p>
            <p className="text-sm text-white">{user.password}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
