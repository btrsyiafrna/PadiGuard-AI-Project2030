"use client";

import { useState } from "react";
import { UploadCloud, Thermometer, Droplets, MapPin, Send, AlertTriangle, Leaf, Activity } from "lucide-react";

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
      const payload = activeTab === "image" ? { data: base64Image } : { data: weatherData };
      
      if (activeTab === "image" && !base64Image) {
        throw new Error("Sila muat naik gambar terlebih dahulu. (Please upload an image first.)");
      }

      // Connecting to Genkit dev flow server
      const response = await fetch("http://127.0.0.1:4000/padiGuardMasterFlow", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Server bermasalah (${response.status}). Sila pastikan Genkit berjalan di port 4000.`);
      }

      const data = await response.json();
      setResult(data.result); // Genkit wraps return in `result`
    } catch (err: any) {
      setError(err.message || "Ralat tidak dijangka berlaku.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 text-slate-800 font-sans selection:bg-emerald-200">
      {/* Header */}
      <header className="bg-emerald-800 text-white shadow-xl shadow-emerald-900/10 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
        <div className="max-w-5xl mx-auto px-6 py-8 relative">
          <div className="flex items-center gap-3">
            <Leaf className="w-10 h-10 text-emerald-400" />
            <div>
              <h1 className="text-3xl font-bold tracking-tight">PadiGuard AI</h1>
              <p className="text-emerald-200 mt-1">Diagnosis Tumbuhan & Analisis Risiko Penyakit (Sovereign RAG)</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12 grid md:grid-cols-12 gap-10">
        
        {/* Left Column: Input Form */}
        <div className="md:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-stone-200">
            {/* Tabs */}
            <div className="flex gap-2 p-1 bg-stone-100 rounded-2xl mb-8">
              <button
                onClick={() => setActiveTab("image")}
                className={`flex-1 py-3 px-4 rounded-xl text-sm font-semibold transition-all flex justify-center items-center gap-2 ${
                  activeTab === "image" ? "bg-white shadow-sm text-emerald-700" : "text-stone-500 hover:text-stone-700"
                }`}
              >
                <Activity className="w-4 h-4" />
                Diagnosis Imej
              </button>
              <button
                onClick={() => setActiveTab("weather")}
                className={`flex-1 py-3 px-4 rounded-xl text-sm font-semibold transition-all flex justify-center items-center gap-2 ${
                  activeTab === "weather" ? "bg-white shadow-sm text-emerald-700" : "text-stone-500 hover:text-stone-700"
                }`}
              >
                <Thermometer className="w-4 h-4" />
                Ramalan Cuaca
              </button>
            </div>

            {/* Content Form */}
            {activeTab === "image" ? (
              <div className="space-y-4">
                <label className="block text-sm font-medium text-stone-700 mb-2">Muat Naik Gambar Daun Padi</label>
                <div className="border-2 border-dashed border-emerald-200 rounded-2xl bg-emerald-50/50 p-8 text-center hover:bg-emerald-50 transition-colors relative group">
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="max-h-48 mx-auto rounded-lg shadow-sm" />
                  ) : (
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm text-emerald-600 group-hover:scale-110 transition-transform">
                        <UploadCloud className="w-8 h-8" />
                      </div>
                      <span className="text-emerald-700 font-medium">Klik atau seret gambar ke sini</span>
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

            {/* Submit Button */}
            <button 
              onClick={handleSubmit}
              disabled={loading}
              className="mt-8 w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-emerald-600/30 transition-all flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-6 h-6 border-4 border-white-300 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>Hantar ke PadiGuard <Send className="w-5 h-5 ml-1" /></>
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

        {/* Right Column: AI Response Pane */}
        <div className="md:col-span-7 flex flex-col h-full">
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-stone-200 flex-1 flex flex-col">
            <h2 className="text-xl font-bold text-emerald-900 mb-6 flex items-center gap-3">
              <div className="w-2 h-8 bg-emerald-500 rounded-full"></div>
              Laporan Analisis AI
            </h2>

            {!result ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center px-10 text-stone-400">
                <div className="w-24 h-24 bg-stone-50 rounded-full flex items-center justify-center mb-6">
                  <Leaf className="w-10 h-10 opacity-20" />
                </div>
                <p>Sila masukkan gambar atau data cuaca untuk mendapatkan laporan analisis patologi dari PadiGuard Swarm.</p>
              </div>
            ) : (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 text-sm md:text-base leading-relaxed">
                
                <div className="bg-stone-50 rounded-2xl p-6 border border-stone-100">
                  <h3 className="font-bold text-stone-800 mb-3 uppercase tracking-wider text-xs">Diagnosa Awalan (Detection/Prediction)</h3>
                  <div className="text-stone-700 whitespace-pre-wrap">{result.analysis}</div>
                </div>

                <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100 shadow-inner shadow-emerald-900/5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-5">
                    <Activity className="w-32 h-32" />
                  </div>
                  <h3 className="font-bold text-emerald-800 mb-3 uppercase tracking-wider text-xs relative z-10">Pelan Tindakan RAG (PadiGuard Advisor)</h3>
                  <div className="text-emerald-900 font-medium whitespace-pre-wrap relative z-10">{result.actionPlan}</div>
                </div>
                
                <div className="flex justify-end">
                  <span className="text-xs text-stone-400 bg-stone-100 px-3 py-1 rounded-full">
                    Selesai pada: {new Date(result.timestamp).toLocaleString()}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
