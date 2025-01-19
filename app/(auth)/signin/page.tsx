"use client";

import React, { useState } from "react";
import { supabaseClient } from "@/lib/db/supabase/client";
import type { Database } from "@/types/supabase";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");

  const handleLogin = async () => {
    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      alert(error.message);
    } else {
      window.location.href = "/dashboard";
    }
  };

  const handleSignUp = async () => {
    const { data: authData, error: authError } = await supabaseClient.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        }
      }
    });

    if (authError) {
      alert(authError.message);
      return;
    }

    // プロフィール情報をprofilesテーブルに保存
    const { error: profileError } = await supabaseClient
      .from('profiles')
      .insert([
        {
          id: authData.user?.id,
          email: email,
          full_name: fullName,
        }
      ]);

    if (profileError) {
      alert(profileError.message);
    } else {
      alert("SignUp success! Check your email if confirmation required.");
    }
  };

  return (
    <div>
      <input
        type="email"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      /><br />
      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      /><br />
      <input
        type="text"
        placeholder="Full Name"
        onChange={(e) => setFullName(e.target.value)}
      /><br />
      <button onClick={handleLogin}>Login</button>
      <button onClick={handleSignUp}>SignUp</button>
    </div>
  );
}
