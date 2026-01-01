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
    endpoint: "buka-segel",
    statusField: "status"
  },
  "penyegelan": {
    endpoint: "penyegelan",
    statusField: "status"
  }
};

export const spkService = {
  getList: async (slug: string, status: number, token: string) => {
    const config = SPK_CONFIG[slug];
    if (!config) throw new Error("Kategori tidak valid");

    const API_URL = process.env.NEXT_PUBLIC_API_URL;
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

    const url = `${API_URL}/api/mobile/spk/${config.endpoint}/${id}`;

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
  },

  submitProses: async (slug: string, formData: FormData, token: string) => {
    const endpointMap: Record<string, string> = {
      "pasang-baru": "psb",
      "pengaduan": "pengaduan",
      "pelayanan-lain": "pelayanan-lain",
      "penyegelan": "segel",
      "buka-segel": "segel"
    };

    const actionMap: Record<string, string> = {
      "pasang-baru": "proses",
      "pengaduan": "proses",
      "pelayanan-lain": "proses",
      "penyegelan": "penyegelan",
      "buka-segel": "proses",
    };

    const endpoint = endpointMap[slug] || slug;
    const action = actionMap[slug] || "proses";
    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    const res = await fetch(`${API_URL}/api/mobile/spk/${endpoint}/${action}`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
      body: formData,
    });

    const result = await res.json();
    const isSuccess = result.success || result.status;

    if (!isSuccess) throw new Error(result.message || "Gagal memproses data");

    return result;
  },

  getMerekMeter: async (token: string) => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const res = await fetch(`${API_URL}/api/filter/merek-meter`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    const result = await res.json();
    if (!result.status && !result.success) throw new Error("Gagal mengambil data merek");

    return result.data;
  },

  getJenisPenyelesaian: async (token: string) => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const res = await fetch(`${API_URL}/api/filter/jenis-penyelesaian`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    const result = await res.json();
    if (!result.status && !result.success) throw new Error("Gagal mengambil data jenis penyelesaian");

    return result.data;
  }
};