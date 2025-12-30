const SPK_CONFIG: Record<string, { endpoint: string; statusField: string }> = {
  "pasang-baru": { 
    endpoint: "psb", 
    statusField: "flagsudahpasang" 
  },
  "pengaduan": { 
    endpoint: "pengaduan", 
    statusField: "is_complete" 
  },
  "pelayanan-lain": { 
    endpoint: "pelayanan-lain", 
    statusField: "flagproses" 
  },
  "buka-segel": { 
    endpoint: "segel", 
    statusField: "flagbukasegel" 
  }
};

export const spkService = {
  // Fungsi untuk List dengan parameter status (0 atau 1 dari Tabbar)
  getList: async (slug: string, status: number, token: string) => {
    const config = SPK_CONFIG[slug];
    if (!config) throw new Error("Kategori tidak valid");

    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    
    // URL akan jadi: .../api/mobile/spk/pengaduan?is_complete=0
    const url = `${API_URL}/api/mobile/spk/${config.endpoint}?${config.statusField}=${status}`;

    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    const result = await res.json();
    const isSuccess = result.success || result.status;
    if (!isSuccess) throw new Error(result.message || "Gagal mengambil daftar");

    return result.data;
  },

  getDetail: async (slug: string, id: string, token: string) => {
    const config = SPK_CONFIG[slug];
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    
    const url = `${API_URL}/api/mobile/spk/${config.endpoint}/${id}?${config.statusField}=0`;

    const res = await fetch(url, {
      method: "GET",
      headers: { 
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
    });

    const result = await res.json();
    const isSuccess = result.success || result.status;
    if (!isSuccess) throw new Error(result.message || "Gagal mengambil detail");

    return result.data;
  }
};