import {
  createSignal,
  onMount,
  onCleanup,
  Show,
  For,
  createMemo,
} from "solid-js";
import { Transition } from "solid-transition-group";
import { Search, X, Maximize2, MousePointerClick } from "lucide-solid";

// Data Foto dengan Nama untuk Fitur Search
const GALA_PHOTOS = [
  {
    id: 1,
    name: "Budi Santoso",
    url: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800",
  },
  {
    id: 2,
    name: "Siti Aminah",
    url: "https://images.unsplash.com/photo-1514525253361-bee8a48740c7?w=800",
  },
  {
    id: 3,
    name: "Andi Wijaya",
    url: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800",
  },
  {
    id: 4,
    name: "Rina Permata",
    url: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800",
  },
  {
    id: 5,
    name: "Joko Anwar",
    url: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800",
  },
  {
    id: 6,
    name: "Dewi Lestari",
    url: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800",
  },
  // Tambah data lainnya di sini...
];

export default function App() {
  const [step, setStep] = createSignal(1); // 1: Welcome, 2: Gallery
  const [search, setSearch] = createSignal("");
  const [selectedImg, setSelectedImg] = createSignal(null);

  let timer;

  // --- LOGIC: Inactivity Timeout (10 Detik) ---
  const resetTimer = () => {
    clearTimeout(timer);
    // Jika di halaman gallery/fullscreen, hitung mundur 10 detik balik ke awal
    if (step() === 2) {
      timer = setTimeout(() => goWelcome(), 10000);
    }
  };

  const goWelcome = () => {
    setStep(1);
    setSearch("");
    setSelectedImg(null);
  };

  const startGallery = () => {
    setStep(2);
    resetTimer();
  };

  // Filter Foto berdasarkan Nama
  const filteredPhotos = createMemo(() => {
    return GALA_PHOTOS.filter((p) =>
      p.name.toLowerCase().includes(search().toLowerCase()),
    );
  });

  onMount(() => {
    window.addEventListener("click", resetTimer);
    window.addEventListener("keydown", resetTimer);
  });

  onCleanup(() => {
    window.removeEventListener("click", resetTimer);
    window.removeEventListener("keydown", resetTimer);
    clearTimeout(timer);
  });

  return (
    <div class="relative w-screen h-screen bg-[#050505] text-white overflow-hidden font-sans select-none">
      {/* 1. HALAMAN AWAL (TAP TO START) */}
      <Show when={step() === 1}>
        <div
          onClick={startGallery}
          class="flex flex-col items-center justify-center h-full cursor-pointer group"
        >
          <div class="absolute inset-0 bg-gradient-to-tr from-purple-900/20 via-transparent to-blue-900/20" />
          <div class="relative z-10 flex flex-col items-center animate-fade-in">
            <div class="mb-8 p-6 bg-white/5 rounded-full border border-white/10 backdrop-blur-xl group-hover:scale-110 transition-transform duration-500">
              <MousePointerClick size={80} class="text-purple-400" />
            </div>
            <h1 class="text-6xl font-black tracking-tighter mb-4 italic">
              GALA MOMENTS
            </h1>
            <p class="text-zinc-400 tracking-[0.5em] uppercase animate-pulse">
              Ketuk untuk mencari nama
            </p>
          </div>
        </div>
      </Show>

      {/* 2. GALLERY & SEARCH */}
      <Show when={step() === 2}>
        <div class="h-full flex flex-col p-6 md:p-10 animate-fade-in">
          {/* Header & Search */}
          <div class="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
            <h2 class="text-3xl font-bold bg-gradient-to-r from-white to-zinc-500 bg-clip-text text-transparent">
              GALLERY RECALL
            </h2>
            <div class="relative w-full max-w-md">
              <Search
                class="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
                size={20}
              />
              <input
                type="text"
                placeholder="Cari nama Anda..."
                onInput={(e) => setSearch(e.currentTarget.value)}
                class="w-full bg-zinc-900/50 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-purple-500 outline-none transition-all shadow-2xl"
              />
            </div>
          </div>

          {/* Photo Grid */}
          <div class="flex-1 overflow-y-auto pr-2 custom-scrollbar">
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <For each={filteredPhotos()}>
                {(photo) => (
                  <div
                    onClick={() => setSelectedImg(photo)}
                    class="relative aspect-[3/4] rounded-xl overflow-hidden cursor-pointer group hover:ring-4 ring-purple-500 transition-all"
                  >
                    <img
                      src={photo.url}
                      class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                      <p class="font-medium text-sm">{photo.name}</p>
                    </div>
                  </div>
                )}
              </For>
            </div>
          </div>
        </div>
      </Show>

      {/* 3. FULLSCREEN VIEWER */}
      <Transition
        onEnter={(el, done) => {
          const a = el.animate(
            [
              { opacity: 0, scale: 0.9 },
              { opacity: 1, scale: 1 },
            ],
            { duration: 300 },
          );
          a.finished.then(done);
        }}
        onExit={(el, done) => {
          const a = el.animate(
            [
              { opacity: 1, scale: 1 },
              { opacity: 0, scale: 0.9 },
            ],
            { duration: 200 },
          );
          a.finished.then(done);
        }}
      >
        <Show when={selectedImg()}>
          <div
            onClick={() => setSelectedImg(null)}
            class="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 cursor-zoom-out"
          >
            <div class="relative max-w-5xl w-full h-full flex flex-col items-center justify-center">
              <img
                src={selectedImg().url}
                class="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
              />
              <div class="mt-6 text-center">
                <h3 class="text-2xl font-bold">{selectedImg().name}</h3>
                <p class="text-zinc-500 mt-2">
                  Ketuk di mana saja untuk menutup
                </p>
              </div>
              <button class="absolute top-4 right-4 p-4 text-white/50 hover:text-white">
                <X size={40} />
              </button>
            </div>
          </div>
        </Show>
      </Transition>
    </div>
  );
}
