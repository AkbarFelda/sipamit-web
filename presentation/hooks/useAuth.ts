import { useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/core/services/authService";
import Cookies from "js-cookie";

export interface LoginPayload {
  username: string;
  password: string;
}

export interface ChangePasswordPayload {
  old_password: string;
  new_password: string;
}

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (payload: LoginPayload) => {
    setLoading(true);
    setError(null);
    try {
      const data = await authService.login(payload);
      Cookies.set("user_token", data.token);
      Cookies.set("user_name", data.user.nama);
      router.replace("/homepage");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan saat login");
    } finally {
      setLoading(false);
    }
  };

  //const handleChangePassword = async (payload: ChangePasswordPayload) => {
  //   setLoading(true);
  //   setError(null);
  //   try {
  //     const token = localStorage.getItem("user_token") || "";
  //     await authService.changePassword(payload, token);
  //     alert("Password berhasil diubah!");
  //     router.push("/profile");
  //   } catch (err) {
  //     setError(err instanceof Error ? err.message : "Gagal mengubah password");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleLogout = () => {
    Cookies.remove("user_token");
    router.replace("/");
  };

  return {
    login: handleLogin,
    // changePassword: handleChangePassword,
    logout: handleLogout,
    loading,
    error
  };
}