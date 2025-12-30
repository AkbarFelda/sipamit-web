"use client";

import Image from "next/image";
import { useState } from "react";
import { Button } from "@/presentation/components/LoginPage/Button";
import InputPassword from "@/presentation/components/LoginPage/InputPassword";
import Input from "@/presentation/components/LoginPage/Input";
import MobileContainer from "@/presentation/components/MobileContainer";
import { useAuth } from "@/presentation/hooks/useAuth";
import LoadingOverlay from "@/presentation/components/LoadingOverlay"; 

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login, loading, error } = useAuth(); 

  const handleLogin = async () => {
    if (username && password) {
      await login({ username, password });
    } else {
      alert("Silakan isi username dan password");
    }
  };

  return (
    <MobileContainer className="bg-linear-to-b from-blue-top to-blue-bottom flex flex-col justify-between py-10"> 
      {loading && <LoadingOverlay message="Memverifikasi Akun..." />}

      <div>
        <div className="flex justify-center mb-6">
          <Image
            src="/image/pdamlogo.svg"
            alt="Logo PDAM"
            width={150}
            height={103}
            priority
          />
        </div>

        <div className="text-center text-black px-4">
          <h1 className="text-2xl font-bold">Masuk ke akun anda</h1>
          <p className="text-sm font-normal opacity-80">
            Masukkan username & katasandi untuk masuk
          </p>
          {error && <p className="text-red-500 text-xs mt-2 font-bold">{error}</p>}
        </div>

        <div className="flex flex-col gap-4 p-8 mt-4">
          <Input
            label="Username"
            placeholder="Masukkan Username"
            value={username}
            onChange={setUsername}
          />

          <InputPassword
            label="Password"
            placeholder="Masukkan Password"
            value={password}
            onChange={setPassword}
          />

          <Button 
            label="Masuk"
            onClick={handleLogin} 
            disabled={loading} 
          />
        </div>
      </div>

      <footer className="w-full text-center text-gray-500 text-xs pb-4">
        &copy; 2025 PDAM Sleman. All rights reserved.
      </footer>
    </MobileContainer>
  );
}