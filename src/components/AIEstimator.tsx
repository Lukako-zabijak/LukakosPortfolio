import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Loader2, ArrowRight, Clock, DollarSign, AlertCircle, CheckCircle2, Terminal, Lightbulb, ChevronDown, ChevronUp } from 'lucide-react';
import { GoogleGenAI, Type } from '@google/genai';

export default function AIEstimator() {
  const [input, setInput] = useState('');
  const [isEstimating, setIsEstimating] = useState(false);
  const [estimate, setEstimate] = useState<{ price: string; time: string; considerations: string[] } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [showConsiderations, setShowConsiderations] = useState(false);

  const handleEstimate = async () => {
    if (!input.trim()) return;
    
    setIsEstimating(true);
    setEstimate(null);
    setError(null);
    setShowConsiderations(false);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `System specification: ${input}`,
        config: {
          systemInstruction: "You are an AI estimator for a 15-year-old highly skilled Roblox developer named Lukako. He specializes in OOP, Raycasting, Anti-Cheat, and Core Game Loops. He is an exceptionally fast worker. Prices should be very affordable for indie game devs but still moneyworthy (e.g., small UI/systems $3-$15, medium systems like combat $15-$45, full game loops $40-$100+). Time estimates should reflect extreme speed (e.g., 2-12 hours for small tasks, 1-2 days for medium systems, 3-7 days for large/full games). Analyze the system specification and provide an estimated price range in USD, an estimated completion time, and 2-3 brief, actionable 'Key Considerations' or 'Common Pitfalls' specific to building this system in Roblox.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              price: {
                type: Type.STRING,
                description: "Estimated price range in USD, e.g., '$15 - $30'",
              },
              time: {
                type: Type.STRING,
                description: "Estimated completion time, e.g., '1 - 2 days'",
              },
              considerations: {
                type: Type.ARRAY,
                items: {
                  type: Type.STRING,
                },
                description: "2-3 brief, actionable key considerations or common pitfalls for this specific project in Roblox.",
              },
            },
            required: ["price", "time", "considerations"],
          },
        },
      });

      let jsonStr = response.text?.trim() || "{}";
      
      // Strip markdown code blocks if the AI accidentally includes them
      if (jsonStr.startsWith('```')) {
        jsonStr = jsonStr.replace(/^```(?:json)?\n?/i, '').replace(/\n?```$/i, '').trim();
      }
      
      const result = JSON.parse(jsonStr);
      
      if (result.price && result.time && result.considerations) {
        setEstimate({ price: result.price, time: result.time, considerations: result.considerations });
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      console.error("Estimation error:", err);
      setError("Failed to generate estimate. Please try again or contact directly.");
    } finally {
      setIsEstimating(false);
    }
  };

  return (
    <div className="relative p-8 md:p-12 border border-zinc-800 bg-zinc-900/40 backdrop-blur-sm overflow-hidden rounded-2xl shadow-2xl group">
      {/* Background Hover Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      
      {/* Scanning Animation during estimation */}
      <AnimatePresence>
        {isEstimating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-0 pointer-events-none overflow-hidden"
          >
            <motion.div
              className="w-full h-[200%] bg-gradient-to-b from-transparent via-green-500/10 to-transparent"
              animate={{ y: ["-100%", "50%"] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10">
        <div className="flex items-center gap-4 mb-8">
          <div className="relative w-12 h-12 border border-zinc-700 rounded-xl flex items-center justify-center bg-zinc-900/50 text-white overflow-hidden">
            <Sparkles className={`w-6 h-6 text-green-400 relative z-10 transition-transform duration-500 ${isEstimating ? 'scale-110 animate-pulse' : ''}`} />
            {isEstimating && (
              <motion.div 
                className="absolute inset-0 bg-green-500/20"
                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ repeat: Infinity, duration: 2 }}
              />
            )}
          </div>
          <div>
            <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tighter text-white flex items-center gap-3">
              AI Estimator
              {isEstimating && <span className="flex h-2 w-2 rounded-full bg-green-500 animate-ping" />}
            </h3>
          </div>
        </div>

        <p className="text-zinc-400 text-sm md:text-base leading-relaxed mb-8">
          Describe the exact system or mechanic you need built. My AI will instantly analyze the complexity and provide a realistic price and timeframe based on my workflow.
        </p>

        <div className="space-y-6">
          <motion.div 
            animate={{ 
              borderColor: isFocused ? "rgba(74, 222, 128, 0.4)" : "rgba(39, 39, 42, 1)",
              boxShadow: isFocused ? "0 0 20px rgba(74, 222, 128, 0.05)" : "0 0 0px rgba(0,0,0,0)"
            }}
            className="relative rounded-xl transition-colors duration-300 bg-zinc-950/50 border overflow-hidden"
          >
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="e.g., I need a modular combat system with 3 weapons, raycast hit detection, block/parry mechanics, and synced VFX..."
              className="w-full h-32 md:h-40 bg-transparent p-4 md:p-6 text-zinc-300 placeholder:text-zinc-600 focus:outline-none resize-none font-mono text-xs md:text-sm relative z-10"
            />
            <div className="absolute bottom-3 right-4 font-mono text-[10px] text-zinc-600 pointer-events-none z-10">
              {input.length} chars
            </div>
            
            {/* Animated border gradient when focused */}
            <AnimatePresence>
              {isFocused && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 pointer-events-none z-0"
                >
                  <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-green-500/50 to-transparent" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          <button
            onClick={handleEstimate}
            disabled={isEstimating || !input.trim()}
            className="w-full group relative inline-flex items-center justify-center gap-3 bg-white text-black px-8 py-4 rounded-xl font-bold text-xs md:text-sm uppercase tracking-widest overflow-hidden transition-transform hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
          >
            <span className="relative z-10 flex items-center gap-2">
              {isEstimating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Analyzing Architecture...
                </>
              ) : (
                <>
                  Generate Estimate
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </span>
            <div className="absolute inset-0 bg-zinc-200 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
          </button>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div 
                key="error"
                initial={{ opacity: 0, y: -10, scale: 0.95 }} 
                animate={{ opacity: 1, y: 0, scale: 1, x: [-5, 5, -5, 5, 0] }} 
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className="p-4 border border-red-900/50 bg-red-900/10 rounded-xl text-red-400 text-xs font-mono flex items-start gap-3 shadow-[0_0_15px_rgba(185,28,28,0.1)]"
              >
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{error}</span>
              </motion.div>
            )}

            {estimate && (
              <motion.div
                key="estimate"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="pt-6 border-t border-zinc-800 overflow-hidden"
              >
                <div className="grid grid-cols-2 gap-4">
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, type: "spring", stiffness: 200, damping: 20 }}
                    className="p-4 md:p-6 border border-green-900/30 bg-green-900/10 rounded-xl flex flex-col items-center justify-center relative overflow-hidden group/card"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300" />
                    <DollarSign className="w-5 h-5 text-green-400 mb-2 opacity-70" />
                    <p className="font-mono text-[10px] text-green-500/70 tracking-widest uppercase mb-1">Estimated Price</p>
                    <p className="text-xl md:text-2xl font-bold text-white tracking-tighter relative z-10">{estimate.price}</p>
                  </motion.div>
                  
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 20 }}
                    className="p-4 md:p-6 border border-blue-900/30 bg-blue-900/10 rounded-xl flex flex-col items-center justify-center relative overflow-hidden group/card"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300" />
                    <Clock className="w-5 h-5 text-blue-400 mb-2 opacity-70" />
                    <p className="font-mono text-[10px] text-blue-500/70 tracking-widest uppercase mb-1">Estimated Time</p>
                    <p className="text-xl md:text-2xl font-bold text-white tracking-tighter relative z-10">{estimate.time}</p>
                  </motion.div>
                </div>

                {estimate.considerations && estimate.considerations.length > 0 && (
                  <div className="mt-6 flex flex-col items-center">
                    <button
                      onClick={() => setShowConsiderations((prev) => !prev)}
                      className="flex items-center gap-2 px-5 py-2.5 text-[10px] md:text-xs font-mono tracking-widest uppercase text-zinc-400 hover:text-white transition-all bg-zinc-800/30 hover:bg-zinc-800/50 rounded-full border border-zinc-700/50 hover:border-zinc-700"
                    >
                      <Lightbulb className="w-3 h-3 md:w-4 md:h-4 text-amber-400" />
                      {showConsiderations ? "Hide Considerations" : "View Considerations"}
                      {showConsiderations ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>
                    
                    <AnimatePresence>
                      {showConsiderations && (
                        <motion.div
                          initial={{ opacity: 0, height: 0, y: -10 }}
                          animate={{ opacity: 1, height: "auto", y: 0 }}
                          exit={{ opacity: 0, height: 0, y: -10 }}
                          transition={{ type: "spring", stiffness: 200, damping: 20 }}
                          className="w-full mt-4 p-4 md:p-6 border border-amber-900/30 bg-amber-900/10 rounded-xl relative overflow-hidden origin-top"
                        >
                          <h4 className="font-mono text-[10px] text-amber-500/80 tracking-widest uppercase mb-3">Key Considerations</h4>
                          <ul className="space-y-2">
                            {estimate.considerations.map((item, idx) => (
                              <li key={idx} className="text-zinc-300 text-xs md:text-sm flex items-start gap-2">
                                <span className="text-amber-500/50 mt-0.5">▹</span>
                                <span className="leading-relaxed">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
                
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="mt-6 flex items-center justify-center gap-2 text-[10px] font-mono text-zinc-500 uppercase tracking-widest"
                >
                  <CheckCircle2 className="w-3 h-3 text-green-500" />
                  Analysis Complete
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
