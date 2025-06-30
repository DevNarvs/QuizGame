'use client';

import { useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function RegisterTest() {
  useEffect(() => {
    const register = async () => {
      const { data, error } = await supabase.auth.signUp({
        email: 'admin@admin.com',
        password: 'admin',
      });
      console.log('Sign-up:', { data, error });
    };

    register();
  }, []);

  return <div className="p-4">Check console for signup result</div>;
}
