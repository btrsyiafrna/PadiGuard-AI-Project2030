"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { UploadCloud, Thermometer, Droplets, MapPin, Send, AlertTriangle, Activity, ShieldCheck, CheckCircle2, Info } from "lucide-react";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"image" | "weather">("image");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [base64Image, setBase64Image] = useState<string | null>(null);
  const [weatherData, setWeatherData] = useState({ temp: 28, humidity: 85, location: "Kedah" });
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ analysis: string, actionPlan: string, timestamp: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create preview
      const objectUrl = URL.createObjectURL(file);
      setImagePreview(objectUrl);
      
      // Convert to base64 for API
      const reader = new FileReader();
      reader.onloadend = () => {
        setBase64Image(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleWeatherChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setWeatherData(prev => ({ ...prev, [name]: name === 'location' ? value : Number(value) }));
  };



  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setResult(null);



    try {
      if (activeTab === "image" && !base64Image) {
        throw new Error("Sila muat naik gambar terlebih dahulu. (Please upload an image first.)");
      }



      const payload = activeTab === "image" ? base64Image : weatherData;
      
      // Removed duplicate check here as it's now at the top

      // Connecting to Genkit dev flow server
      const response = await fetch("https://padiguard-backend-878147307907.asia-southeast1.run.app/padiGuardMasterFlow", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: payload
        }),
      });

      if (!response.ok) {
        throw new Error(`Server bermasalah (${response.status}). Sila pastikan Genkit berjalan di port 4000.`);
      }

      const data = await response.json();
      setResult(data.result); // Genkit wraps return in `result`
    } catch (err: any) {
      setError(`Ralat Sistem: ${err.message || "Gagal menyambung ke Swarm Intelligence PadiGuard. Sila semburkan api (restart) server anda."}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen text-slate-900 font-sans selection:bg-emerald-200 selection:text-emerald-950">
      {/* Header */}
      <header className="bg-emerald-900/40 backdrop-blur-xl text-white border-b border-emerald-500/20 sticky top-0 z-50 shadow-2xl">
        <div className="max-w-6xl mx-auto px-6 py-6 relative">
          <div className="flex items-center gap-6 justify-center md:justify-start">
            <div className="bg-white p-2 rounded-2xl shadow-xl border-2 border-emerald-400">
              <Image 
                src="/logo.png" 
                alt="PadiGuard AI Logo" 
                width={140} 
                height={50} 
                className="h-12 w-auto object-contain"
                priority
              />
            </div>
            <div className="h-12 w-px bg-emerald-500/30 hidden md:block"></div>
            <div className="text-center md:text-left">
              <h1 className="text-3xl font-black tracking-tighter uppercase drop-shadow-lg">PadiGuard AI</h1>
              <p className="text-emerald-300 font-bold text-lg tracking-tight">Sistem Pintar Diagnosis & Pencegahan Penyakit Padi</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10 grid lg:grid-cols-12 gap-10">
        
        {/* Left Column: Input Form */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-card inner-glow rounded-[32px] p-8 ring-1 ring-white/20">
            {/* Tabs */}
            <div className="flex gap-2 p-1 bg-white/20 backdrop-blur-lg rounded-3xl mb-8 border border-white/30 inner-glow">
              <button
                onClick={() => setActiveTab("image")}
                className={`flex-1 min-h-[56px] px-6 rounded-2xl text-lg font-black transition-all flex justify-center items-center gap-3 ${
                  activeTab === "image" ? "bg-white shadow-xl text-emerald-900 border border-white/50" : "text-emerald-100 hover:bg-white/10"
                }`}
              >
                <Activity className="w-6 h-6" />
                Pemeriksaan Visual
              </button>
              <button
                onClick={() => setActiveTab("weather")}
                className={`flex-1 min-h-[56px] px-6 rounded-2xl text-lg font-black transition-all flex justify-center items-center gap-3 ${
                  activeTab === "weather" ? "bg-white shadow-xl text-emerald-900 border border-white/50" : "text-emerald-100 hover:bg-white/10"
                }`}
              >
                <Thermometer className="w-6 h-6" />
                Data Cuaca
              </button>
            </div>

            {/* Content Form */}
            {activeTab === "image" ? (
              <div className="space-y-4">
                <label className="block text-xl font-black text-stone-800 mb-2 uppercase tracking-tighter flex items-center gap-2">
                  <ShieldCheck className="w-6 h-6 text-emerald-600" /> Muat Naik Imej Diagnosis
                </label>
                <div className="border-2 border-dashed border-emerald-200 rounded-3xl bg-emerald-50/30 p-8 text-center hover:bg-emerald-50/50 transition-all relative group overflow-hidden">
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                  />
                  {imagePreview ? (
                    <div className="relative">
                      <img src={imagePreview} alt="Preview" className="max-h-64 mx-auto rounded-2xl shadow-lg border-4 border-white" />
                      {loading && (
                        <div className="absolute inset-0 bg-emerald-900/40 backdrop-blur-[2px] rounded-2xl overflow-hidden pointer-events-none ring-4 ring-emerald-400/50 ring-inset">
                          <div className="animate-scan w-full h-[8px] bg-gradient-to-b from-transparent via-emerald-400 to-transparent shadow-[0_0_25px_rgba(52,211,153,1)] absolute z-30"></div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-4 py-4">
                      <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg border border-emerald-50 text-emerald-600 group-hover:scale-110 transition-transform">
                        <UploadCloud className="w-10 h-10" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-emerald-800 font-bold">Pilih atau seret imej diagnosis ke ruangan ini</p>
                        <p className="text-stone-400 text-xs">Format: JPG, PNG (Maks 5MB)</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
               <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2 flex items-center gap-2">
                    <Thermometer className="w-4 h-4 text-emerald-600" /> Suhu (°C)
                  </label>
                  <input 
                    type="number" 
                    name="temp"
                    value={weatherData.temp}
                    onChange={handleWeatherChange}
                    className="w-full rounded-xl border-stone-200 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 p-3 bg-stone-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2 flex items-center gap-2">
                    <Droplets className="w-4 h-4 text-blue-500" /> Kelembapan (%)
                  </label>
                  <input 
                    type="number" 
                    name="humidity"
                    value={weatherData.humidity}
                    onChange={handleWeatherChange}
                    className="w-full rounded-xl border-stone-200 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 p-3 bg-stone-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-rose-500" /> Lokasi Sawah
                  </label>
                  <input 
                    type="text" 
                    name="location"
                    value={weatherData.location}
                    onChange={handleWeatherChange}
                    className="w-full rounded-xl border-stone-200 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 p-3 bg-stone-50"
                  />
                </div>
              </div>
            )}

            <button 
              onClick={handleSubmit}
              disabled={loading}
              className={`mt-6 w-full min-h-[64px] ${
                (activeTab === 'image' ? base64Image : true) && !loading ? 'animate-flow-pulse bg-emerald-600 hover:bg-emerald-700' : 'bg-stone-400'
              } text-white py-4 rounded-2xl font-black text-xl shadow-2xl transition-all flex justify-center items-center gap-4 disabled:opacity-70 disabled:cursor-not-allowed uppercase tracking-tighter`}
            >
              {loading ? (
                <div className="flex items-center gap-4">
                  <div className="w-7 h-7 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Sila Tunggu...</span>
                </div>
              ) : (
                <>Analyze <Send className="w-7 h-7" /></>
              )}
            </button>
            
            {error && (
              <div className="mt-4 p-4 bg-rose-50 text-rose-700 rounded-xl flex gap-3 text-sm font-medium border border-rose-100">
                <AlertTriangle className="w-5 h-5 shrink-0" />
                <p>{error}</p>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-7 flex flex-col h-full">
          <div className="glass-card inner-glow rounded-[32px] p-8 ring-1 ring-white/20 flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-stone-100">
              <h2 className="text-3xl font-black text-emerald-900 flex items-center gap-4 uppercase tracking-tighter">
                <div className="w-4 h-12 bg-emerald-600 rounded-full shadow-[0_0_20px_rgba(16,185,129,0.4)]"></div>
                Laporan PadiGuard AI
              </h2>
              <Info className="w-8 h-8 text-stone-300" />
            </div>

            {!result ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center px-10 text-stone-400">
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="w-32 h-32 bg-stone-50 rounded-full flex items-center justify-center mb-8 border border-stone-100"
                >
                  <Activity className="w-16 h-16 opacity-30" />
                </motion.div>
                <p className="text-xl font-bold max-w-sm">Sediakan imej atau data persekitaran untuk memulakan diagnosis.</p>
              </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-8 text-xl leading-relaxed font-medium"
              >
                {/* Traffic Light Status Badge */}
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="flex justify-center"
                >
                  {result.analysis.toLowerCase().includes('dikesan') || result.analysis.toLowerCase().includes('jangkitan') ? (
                    <div className="px-10 py-4 rounded-3xl bg-rose-600 text-white font-black text-xl uppercase tracking-tighter shadow-[0_0_30px_rgba(225,29,72,0.4)] border-2 border-rose-400 flex items-center gap-4 status-glow-red animate-pulse">
                       <div className="w-6 h-6 bg-white rounded-full animate-ping"></div>
                       🛑 STATUS: BAHAYA
                    </div>
                  ) : result.analysis.toLowerCase().includes('risiko') ? (
                    <div className="px-10 py-4 rounded-3xl bg-amber-500 text-white font-black text-xl uppercase tracking-tighter shadow-[0_0_30px_rgba(245,158,11,0.4)] border-2 border-amber-300 flex items-center gap-4 status-glow-yellow">
                       <div className="w-6 h-6 bg-white rounded-full"></div>
                       ⚠️ STATUS: AMARAN
                    </div>
                  ) : (
                    <div className="px-10 py-4 rounded-3xl bg-emerald-600 text-white font-black text-xl uppercase tracking-tighter shadow-[0_0_30px_rgba(16,185,129,0.4)] border-2 border-emerald-400 flex items-center gap-4 status-glow-green">
                       <CheckCircle2 className="w-8 h-8" /> 🟢 STATUS: SELAMAT
                    </div>
                  )}
                </motion.div>

                <motion.div 
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="glass-card inner-glow rounded-3xl p-8 border-white/40 ring-1 ring-black/5"
                >
                  <h3 className="font-black text-stone-800 mb-4 uppercase tracking-widest text-sm opacity-60 flex items-center gap-2">
                    <Activity className="w-4 h-4" /> Diagnosis Patologi
                  </h3>
                  <div className="text-slate-900 whitespace-pre-wrap">{result.analysis}</div>
                </motion.div>

                <motion.div 
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="bg-emerald-950 text-emerald-50 rounded-3xl p-8 shadow-2xl border border-emerald-800/50 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-6 opacity-10">
                    <ShieldCheck className="w-40 h-40" />
                  </div>
                  <h3 className="font-black text-emerald-400 mb-4 uppercase tracking-widest text-sm relative z-10 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4" /> Pelan Tindakan Strategik (MARDI)
                  </h3>
                  <div className="text-white font-bold whitespace-pre-wrap relative z-10 text-xl leading-relaxed">{result.actionPlan}</div>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.1 }}
                  className="flex justify-end"
                >
                  <span className="text-sm font-bold text-stone-400 bg-stone-100 px-6 py-2 rounded-full border border-stone-200 uppercase tracking-tighter">
                    Sistem 2030 Terkini: {new Date(result.timestamp).toLocaleTimeString()}
                  </span>
                </motion.div>
              </motion.div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
