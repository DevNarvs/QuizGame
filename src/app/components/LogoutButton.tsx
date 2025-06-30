'use client';

import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('Logout error:', error.message);
    } else {
      router.push('/'); // or redirect anywhere after logout
      console.log('Logout Successfully');
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-red-600 text-white px-4 py-2 rounded-xl hover:bg-red-700 cursor-pointer"
    >
      Logout
    </button>
  );
}
