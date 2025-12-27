"use client";

import { useState } from "react";
import MobileContainer from "@/presentation/components/MobileContainer";
import HeaderPage from "@/presentation/components/HeaderPage";
import InputPassword from "@/presentation/components/LoginPage/InputPassword";
import { Button } from "@/presentation/components/LoginPage/Button";
import { KeyRound, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ChangePasswordPage() {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleUpdatePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      alert("Semua kolom harus diisi!");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("Konfirmasi password baru tidak cocok!");
      return;
    }

    console.log("Password updated");
    alert("Password berhasil diperbarui!");
    router.push("/");
  };

  return (
    <MobileContainer className="bg-gray-50 flex flex-col pb-10">
      <HeaderPage title="Ubah Password" />

      <div className="p-6 flex-1 flex flex-col">
        <div className="flex flex-col items-center mb-8 mt-4">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-4 shadow-sm">
            <KeyRound size={40} />
          </div>
          <h2 className="text-lg font-bold text-gray-800">Keamanan Akun</h2>
          <p className="text-sm text-gray-500 text-center mt-1">
            Gunakan password yang kuat dan mudah diingat untuk melindungi akun Anda.
          </p>
        </div>

        <div className="bg-white rounded-4xl p-6 shadow-sm border border-gray-100 space-y-5">
          <InputPassword
            label="Password Saat Ini"
            placeholder="Masukkan password lama"
            value={currentPassword}
            onChange={setCurrentPassword}
          />

          <hr className="border-gray-50" />

          <InputPassword
            label="Password Baru"
            placeholder="Masukkan password baru"
            value={newPassword}
            onChange={setNewPassword}
          />

          <InputPassword
            label="Konfirmasi Password Baru"
            placeholder="Ulangi password baru"
            value={confirmPassword}
            onChange={setConfirmPassword}
          />
        </div>

        <div className="mt-6 flex items-start gap-3 p-4 bg-blue-50/50 rounded-2xl border border-blue-100">
          <ShieldCheck size={20} className="text-blue-600 shrink-0" />
          <p className="text-xs text-blue-800 leading-relaxed">
            Setelah password berhasil diubah, Anda akan diminta untuk tetap login. Pastikan Anda tidak memberitahukan password kepada siapapun.
          </p>
        </div>

        <div className="mt-auto pt-8">
          <Button label="Perbarui Password" onClick={handleUpdatePassword} />
        </div>
      </div>
    </MobileContainer>
  );
}