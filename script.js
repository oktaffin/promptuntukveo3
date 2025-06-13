document.addEventListener("DOMContentLoaded", () => {
  // --- PENGATURAN AWAL & ELEMEN ---
  const form = document.getElementById("prompt-form");

  // Objek untuk menampung semua elemen input agar mudah diakses
  const inputs = {
    judul: document.getElementById("judul_scane"),
    deskripsiKarakter: document.getElementById("deskripsi_karakter"),
    suaraKarakter: document.getElementById("suara_karakter"),
    aksiKarakter: document.getElementById("aksi_karakter"),
    ekspresiKarakter: document.getElementById("ekspresi_karakter"),
    latar: document.getElementById("latar_tempat_waktu"),
    detailVisual: document.getElementById("detail_visual"),
    gerakanKamera: document.getElementById("gerakan_kamera"),
    suasana: document.getElementById("suasana"),
    suaraLingkungan: document.getElementById("suara_lingkungan"),
    dialog: document.getElementById("dialog_karakter"),
    negativePrompt: document.getElementById("negative_prompt"),
  };

  // Elemen output
  const outputIndonesia = document.getElementById("output_indonesia");
  const outputInggris = document.getElementById("output_inggris");

  // Nilai default untuk negative prompt saat reset
  const defaultNegativePrompt = inputs.negativePrompt.value;

  const cameraMovements = {
    Static: "Statis",
    "Zoom In": "Perbesar",
    "Zoom Out": "Perkecil",
    "Pan Left": "Geser Kiri",
    "Pan Right": "Geser Kanan",
    "Tilt Up": "Miring ke Atas",
    "Tilt Down": "Miring ke Bawah",
    "Dolly In (Truck In)": "Maju",
    "Dolly Out (Truck Out)": "Mundur",
    "Orbit (3D Rotation)": "Mengorbit",
    "Crane Up": "Naik",
    "Crane Down": "Turun",
    "Tracking Shot": "Tembakan Mengikuti",
    "Handheld/Shaky": "Genggam/Goyang",
    "Roll Left": "Putar Kiri",
    "Roll Right": "Putar Kanan",
  };

  // Mengisi dropdown gerakan kamera secara dinamis
  for (const [english, indonesian] of Object.entries(cameraMovements)) {
    const option = document.createElement("option");
    option.value = english;
    option.textContent = `${english} (${indonesian})`;
    inputs.gerakanKamera.appendChild(option);
  }

  // --- FUNGSI UTAMA ---
  function generatePrompts() {
    // Mengambil semua nilai dari input
    const values = {};
    for (const key in inputs) {
      values[key] = inputs[key].value.trim();
    }

    // Membuat Prompt Bahasa Indonesia (Deskriptif)
    outputIndonesia.value = `**Judul Adegan:** ${
      values.judul || "(tidak ditentukan)"
    }

**Deskripsi Karakter:**
Seorang karakter konsisten: ${values.deskripsiKarakter || "(tidak ditentukan)"}
Suara karakter: ${values.suaraKarakter || "(tidak ditentukan)"}

**Aksi & Ekspresi:**
Dalam adegan ini, karakter terlihat ${
      values.aksiKarakter || "(melakukan aksi)"
    } dengan ekspresi wajah ${values.ekspresiKarakter || "(tidak ditentukan)"}.

**Latar, Waktu, & Suasana:**
Berlatar di ${
      values.latar || "(tidak ditentukan)"
    }. Suasana keseluruhan adalah ${values.suasana || "(tidak ditentukan)"}.

**Sinematografi & Detail Visual:**
Gaya visual video adalah ${
      values.detailVisual || "(tidak ditentukan)"
    }. Gerakan kamera yang digunakan adalah ${values.gerakanKamera} (${
      cameraMovements[values.gerakanKamera]
    }).

**Desain Suara & Dialog:**
Suara lingkungan yang dominan adalah: ${
      values.suaraLingkungan || "(tidak ditentukan)"
    }.
${
  values.dialog
    ? `Dialog Karakter: "${values.dialog}"`
    : "*(Tidak ada dialog dalam adegan ini)*"
}

**Hal yang harus dihindari:**
${values.negativePrompt}`;

    // Membuat Final Prompt untuk AI (Format Kata Kunci)
    const finalPromptParts = [
      values.judul ? `Scene Title: ${values.judul}` : null,
      values.deskripsiKarakter
        ? `A consistent character: ${values.deskripsiKarakter}`
        : null,
      values.suaraKarakter ? `character voice: ${values.suaraKarakter}` : null,
      values.aksiKarakter ? `action: ${values.aksiKarakter}` : null,
      values.ekspresiKarakter ? `expression: ${values.ekspresiKarakter}` : null,
      values.latar ? `setting: ${values.latar}` : null,
      values.suasana ? `atmosphere: ${values.suasana}` : null,
      values.detailVisual ? `visual style: ${values.detailVisual}` : null,
      values.gerakanKamera
        ? `camera movement: cinematic ${values.gerakanKamera}`
        : null,
      values.suaraLingkungan ? `sound design: ${values.suaraLingkungan}` : null,
      values.dialog ? `dialogue (in Indonesian): "${values.dialog}"` : null,
      values.negativePrompt ? `--no ${values.negativePrompt}` : null,
    ].filter((part) => part !== null); // Hapus bagian yang kosong

    outputInggris.value = finalPromptParts.join(", ");
  }

  function handleCopy(e) {
    const button = e.currentTarget;
    const targetId = button.dataset.target;
    const textarea = document.getElementById(targetId);

    if (textarea.value) {
      navigator.clipboard
        .writeText(textarea.value)
        .then(() => {
          const originalIcon = button.innerHTML;
          button.innerHTML = `<i class="fa-solid fa-check"></i> Disalin!`;
          button.classList.add("copied");
          setTimeout(() => {
            button.innerHTML = originalIcon;
            button.classList.remove("copied");
          }, 2000);
        })
        .catch((err) => console.error("Gagal menyalin:", err));
    }
  }

  // --- EVENT LISTENERS ---
  document
    .getElementById("generateBtn")
    .addEventListener("click", generatePrompts);

  // Menggunakan event 'reset' dari form untuk efisiensi
  form.addEventListener("reset", () => {
    // Reset output secara manual karena bukan bagian dari form
    outputIndonesia.value = "";
    outputInggris.value = "";
    // Kembalikan nilai default negative prompt setelah reset
    setTimeout(() => (inputs.negativePrompt.value = defaultNegativePrompt), 0);
  });

  // Tambahkan event listener untuk semua tombol salin
  document.querySelectorAll(".copy-btn").forEach((button) => {
    button.addEventListener("click", handleCopy);
  });
});
