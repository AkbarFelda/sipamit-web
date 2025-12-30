const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface LoginPayload {
  username: string;
  password: string;
}

export const authService = {
  login: async (payload: LoginPayload) => { 
    const res = await fetch(`${API_URL}/api/mobile/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    
    if (!res.ok) throw new Error("Username atau password salah");
    return res.json();
  },


  // Logic untuk Ubah Password
//  changePassword: async (payload: any, token: string) => {
//     const res = await fetch(`${API_URL}/change-password`, {
//       method: "POST",
//       headers: { 
//         "Content-Type": "application/json",
//         "Authorization": `Bearer ${token}` // Sertakan token untuk keamanan
//       },
//       body: JSON.stringify(payload),
//     });
//     if (!res.ok) throw new Error("Gagal mengubah kata sandi");
//     return res.json();
//   }, 

// Logic untuk Logout
logout: () => {
    localStorage.removeItem("user_token");
  }
};