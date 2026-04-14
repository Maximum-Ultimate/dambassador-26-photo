import {
  createSignal,
  onMount,
  onCleanup,
  Show,
  For,
  createMemo,
} from "solid-js";
import { Transition } from "solid-transition-group";
import { Search, X, MousePointerClick } from "lucide-solid";

// Import data foto yang sudah diproses di photos.js
import { GALA_PHOTOS } from "./photos";

// Assets
import bgHome from "./assets/img-design/bgHome.webp";
import bgGallery from "./assets/img-design/bgGallery.webp";
import homeTitle from "./assets/img-design/homeTitle.webp";
import homeTitle2 from "./assets/img-design/homeTitle2.webp";
import galleryTitle from "./assets/img-design/galleryTitle.webp";

export default function App() {
  const [step, setStep] = createSignal(1);
  const [search, setSearch] = createSignal("");
  const [selectedImg, setSelectedImg] = createSignal(null);
  const [showSearchModal, setShowSearchModal] = createSignal(false);

  let searchInputRef;
  let timer;

  // Timer auto-reset ke Welcome Screen jika tidak ada aktivitas
  const resetTimer = () => {
    clearTimeout(timer);
    if (step() === 2) {
      timer = setTimeout(() => goWelcome(), 20000); // 20 detik idle
    }
  };

  const goWelcome = () => {
    setStep(1);
    setSearch("");
    setSelectedImg(null);
    setShowSearchModal(false);
  };

  const toggleSearch = () => {
    setShowSearchModal(!showSearchModal());
    if (showSearchModal()) {
      setTimeout(() => searchInputRef?.focus(), 300);
    }
  };

  const filteredPhotos = createMemo(() => {
    const s = search().toLowerCase();
    return s === ""
      ? GALA_PHOTOS
      : GALA_PHOTOS.filter((p) => p.name.toLowerCase().includes(s));
  });

  onMount(() => {
    window.addEventListener("click", resetTimer);
    window.addEventListener("keydown", (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        toggleSearch();
      }
      resetTimer();
    });
  });

  onCleanup(() => {
    window.removeEventListener("click", resetTimer);
    clearTimeout(timer);
  });

  return (
    <div class="relative w-screen h-screen bg-[#050505] text-white overflow-hidden font-sans select-none">
      {/* --- 1. WELCOME SCREEN --- */}
      <Transition
        onEnter={(el, done) => {
          el.animate([{ opacity: 0 }, { opacity: 1 }], {
            duration: 800,
          }).finished.then(done);
        }}
        onExit={(el, done) => {
          el.animate(
            [
              { opacity: 1, filter: "blur(0px)" },
              { opacity: 0, filter: "blur(20px)" },
            ],
            { duration: 600 },
          ).finished.then(done);
        }}
      >
        <Show when={step() === 1}>
          <div
            onClick={() => setStep(2)}
            class="absolute inset-0 z-50 flex flex-col items-center justify-center cursor-pointer bg-black overflow-hidden"
          >
            {/* Background Image dengan Overlay */}
            <div class="absolute inset-0 z-0">
              <img src={bgHome} class="w-full h-full object-cover" />
            </div>

            {/* Content */}
            <img class="absolute top-20" src={homeTitle2} alt="" />
            <div class="relative z-10 animate-slide-up flex flex-col items-center">
              <img src={homeTitle} class="w-[1000px] max-w-[90vw] mb-4" />
              <p class="mt-6 text-yellow-500 tracking-[0.5em] uppercase text-xl animate-pulse">
                Sentuh Layar untuk Memulai
              </p>
            </div>
          </div>
        </Show>
      </Transition>

      {/* --- 2. GALLERY VIEW --- */}
      <Show when={step() === 2}>
        <div class="relative h-full w-full flex flex-col overflow-hidden bg-black">
          {/* Background Image Layer */}
          <div class="absolute inset-0 z-0">
            <img src={bgGallery} class="w-full h-full object-cover" />
            {/* <div class="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" /> */}
          </div>

          {/* Content Layer */}
          <div class="relative z-10 h-full flex flex-col p-8 pt-10">
            <header class="mb-12 text-center animate-slide-up">
              <img src={galleryTitle} alt="" />
              {/* <div class="h-1 w-24 bg-purple-600 mx-auto mt-4 rounded-full shadow-[0_0_15px_rgba(168,85,247,0.8)]" /> */}
            </header>

            {/* Kita pendekin pb-72 jadi pb-20 dan tambahin max-h-screen biar gak bablas ke bawah */}
            <div class="flex-1 overflow-y-auto custom-scrollbar pb-20 px-4 max-h-[80vh]">
              <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
                <For each={filteredPhotos()}>
                  {(photo, i) => (
                    <div
                      onClick={() => setSelectedImg(photo)}
                      style={{ "animation-delay": `${i() * 0.03}s` }}
                      class="animate-slide-up group relative aspect-[3/4] rounded-[2rem] overflow-hidden border border-white/10 bg-zinc-900/50 backdrop-blur-sm shadow-2xl transition-all hover:border-purple-500/50 hover:shadow-purple-500/20 active:scale-95 cursor-pointer"
                    >
                      <img
                        src={photo.url}
                        loading="lazy"
                        class="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000 ease-out"
                      />
                      <div class="absolute inset-x-3 bottom-3 p-5 rounded-[1.5rem] bg-black/40 backdrop-blur-xl border border-white/10 transform translate-y-2 group-hover:translate-y-0 transition-all duration-500 opacity-0 group-hover:opacity-100">
                        <p class="font-bold text-xl uppercase leading-tight truncate">
                          {photo.name}
                        </p>
                        <p class="text-[10px] text-purple-400 font-black uppercase tracking-widest mt-1.5">
                          {photo.category}
                        </p>
                      </div>
                    </div>
                  )}
                </For>
              </div>
            </div>

            {/* Floating Action Button */}
            <button
              onClick={toggleSearch}
              class="fixed bottom-1/2 left-5 md:left-7 md:translate-x-0 w-24 h-24 bg-yellow-600/20 backdrop-blur-2xl hover:bg-yellow-600 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(234,179,8,0.4)] border border-white/20 transition-all active:scale-90 z-40 animate-slide-up"
            >
              <Search size={40} class="text-white" strokeWidth={2.5} />
            </button>
            {/* Tombol Kembali ke Halaman Utama */}
            {/* Tombol Kembali ke Menu Utama - Posisinya di bawah tengah */}
            <div class="fixed bottom-10 left-1/2 -translate-x-1/2 z-40 animate-slide-up">
              <button
                onClick={goWelcome}
                class="flex items-center gap-3 px-8 py-4 bg-amber-600/20 backdrop-blur-2xl hover:bg-amber-600 rounded-full border border-white/20 shadow-[0_0_40px_rgba(251,191,36,0.3)] transition-all active:scale-95 group"
              >
                <X
                  size={20}
                  class="text-white group-hover:rotate-90 transition-transform duration-300"
                  strokeWidth={3}
                />
                <span class="text-xs md:text-sm font-black uppercase tracking-[0.2em] text-white whitespace-nowrap">
                  Kembali ke Menu Utama
                </span>
              </button>
            </div>
          </div>
        </div>
      </Show>

      {/* --- 3. SEARCH MODAL --- */}
      <Transition
        onEnter={(el, done) => {
          const a = el.animate([{ opacity: 0 }, { opacity: 1 }], {
            duration: 300,
          });
          const b = el.querySelector(".modal-box").animate(
            [
              {
                transform: "scale(0.9) translateY(-30px)",
                filter: "blur(10px)",
              },
              { transform: "scale(1) translateY(0)", filter: "blur(0)" },
            ],
            { duration: 400, easing: "ease-out" },
          );
          Promise.all([a.finished, b.finished]).then(done);
        }}
        onExit={(el, done) => {
          el.animate([{ opacity: 1 }, { opacity: 0 }], {
            duration: 200,
          }).finished.then(done);
        }}
      >
        <Show when={showSearchModal()}>
          <div class="fixed inset-0 z-[60] flex items-start justify-center pt-[12vh] px-6">
            <div
              onClick={toggleSearch}
              class="absolute inset-0 bg-black/70 backdrop-blur-md"
            />
            <div class="modal-box relative w-full max-w-2xl bg-[#1c1c1e]/80 border border-white/20 rounded-[2.5rem] shadow-[0_50px_100px_rgba(0,0,0,0.8)] overflow-hidden backdrop-blur-3xl">
              <div class="flex items-center p-8 gap-5 border-b border-white/10">
                {/* ICON SEARCH: Sekarang warna emas */}
                <Search class="text-amber-400" size={32} />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Ketik nama Anda..."
                  class="flex-1 bg-transparent text-3xl font-medium outline-none placeholder:text-zinc-600"
                  onInput={(e) => setSearch(e.currentTarget.value)}
                  value={search()}
                />
                <button
                  onClick={toggleSearch}
                  class="p-3 hover:bg-white/10 rounded-2xl transition-colors"
                >
                  <X size={28} class="text-zinc-500" />
                </button>
              </div>
              <div class="p-6 max-h-[50vh] overflow-y-auto custom-scrollbar">
                <div class="grid grid-cols-1 gap-3">
                  <For each={filteredPhotos().slice(0, 8)}>
                    {(p) => (
                      <div
                        onClick={() => {
                          setSelectedImg(p);
                          setShowSearchModal(false);
                        }}
                        class="flex items-center gap-5 p-4 rounded-2xl hover:bg-amber-900/30 border border-transparent hover:border-amber-500/50 transition-all cursor-pointer group"
                      >
                        <img
                          src={p.url}
                          class="w-16 h-16 rounded-full object-cover border-2 border-white/10 group-hover:border-amber-400"
                        />
                        <div>
                          <p class="text-xl font-bold uppercase text-white">
                            {p.name}
                          </p>
                          <p class="text-xs text-zinc-500 font-bold uppercase">
                            {p.category}
                          </p>
                        </div>
                      </div>
                    )}
                  </For>
                </div>
              </div>
            </div>
          </div>
        </Show>
      </Transition>

      {/* --- 4. FULLSCREEN VIEWER --- */}
      <Transition
        onEnter={(el, done) => {
          el.animate(
            [
              { opacity: 0, backdropFilter: "blur(0px)" },
              { opacity: 1, backdropFilter: "blur(30px)" },
            ],
            { duration: 400 },
          );
          el.querySelector(".img-container")
            .animate(
              [
                { transform: "scale(0.7) translateY(50px)", opacity: 0 },
                { transform: "scale(1) translateY(0)", opacity: 1 },
              ],
              { duration: 500, easing: "ease-out" },
            )
            .finished.then(done);
        }}
        onExit={(el, done) => {
          el.animate([{ opacity: 1 }, { opacity: 0 }], {
            duration: 300,
          }).finished.then(done);
        }}
      >
        <Show when={selectedImg()}>
          <div
            onClick={() => setSelectedImg(null)}
            class="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-0"
          >
            {/* Container utama tanpa padding biar foto pol gedenya */}
            <div class="img-container relative w-screen h-screen flex flex-col items-center justify-center p-2">
              <img
                src={selectedImg().url}
                /* Aksen shadow diganti jadi amber (emas) */
                class="w-auto h-full max-h-[92vh] object-contain rounded-lg shadow-[0_0_100px_rgba(251,191,36,0.3)] border border-white/10"
              />

              {/* Teks category diganti jadi text-amber-400 (emas) */}
              <div class="mt-2 text-center bg-black/50 backdrop-blur-md p-3 px-8 rounded-full border border-white/10 shadow-2xl">
                <h3 class="text-2xl md:text-4xl font-black tracking-tighter uppercase leading-none text-white">
                  {selectedImg().name}
                </h3>
                <p class="text-amber-400 font-black tracking-[0.2em] uppercase text-[10px] mt-1">
                  {selectedImg().category}
                </p>
              </div>
            </div>
          </div>
        </Show>
      </Transition>
    </div>
  );
}
