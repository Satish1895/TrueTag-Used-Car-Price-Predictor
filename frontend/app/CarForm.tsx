"use client";

import { useState, useEffect } from "react";
import CountUp from "react-countup";

interface Metadata {
    brands_and_models: Record<string, string[]>;
    states: string[];
    fuel_types: string[];
    transmissions: string[];
    body_types: string[];
}

export default function CarForm() {
    const [metadata, setMetadata] = useState<Metadata | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const [selectedBrand, setSelectedBrand] = useState("");
    const [selectedModel, setSelectedModel] = useState("");
    const [year, setYear] = useState("");
    const [distance, setDistance] = useState("");
    const [selectedState, setSelectedState] = useState("");
    const [fuel, setFuel] = useState("");
    const [transmission, setTransmission] = useState("");
    const [bodyType, setBodyType] = useState("");
    const [owner, setOwner] = useState(1);

    const [predictedPrice, setPredictedPrice] = useState<number | null>(null);
    const [isPredicting, setIsPredicting] = useState(false);
    const [insight, setInsight] = useState<string | null>(null);

    // Helper to automatically target the correct server address
    const getBackendUrl = () => {
        if (typeof window !== "undefined") {
            return `http://${window.location.hostname}:8000`;
        }
        return "http://localhost:8000";
    };

    const handleBrandChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedBrand(e.target.value);
        setSelectedModel("");
    };

    const handlePredict = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsPredicting(true);
        setPredictedPrice(null);
        setInsight(null);

        const payload = {
            distance: Number(distance),
            owner: Number(owner),
            brand: selectedBrand,
            model_name: selectedModel,
            year: Number(year),
            state: selectedState,
            fuel: fuel,
            drive: transmission,
            body_type: bodyType
        };
        try {
            const response = await fetch(`${getBackendUrl()}/api/predict`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
            if (!response.ok) {
                throw new Error(`FastAPI rejected the data.`);
            }
            const data = await response.json();
            setPredictedPrice(data.predicted_price);
            setInsight(data.insight);
        } catch (error) {
            console.error("Error predicting price:", error);
            alert(`Failed to get prediction. Ensure all fields are filled.`);
        } finally {
            setIsPredicting(false);
        }
    };

    useEffect(() => {
        const fetchMetadata = async () => {
            try {
                const response = await fetch(`${getBackendUrl()}/api/metadata`);
                const data = await response.json();
                setMetadata(data);
                setIsLoading(false);
            } catch (error) {
                console.error("Error fetching metadata:", error);
                setIsLoading(false);
            }
        };
        fetchMetadata();
    }, []);

    return (
        <div className="w-full flex flex-col lg:flex-row justify-center gap-10 items-center pointer-events-auto">

            {/* LEFT COLUMN: Vehicle Specifications Form */}
            <div className={`transition-all duration-700 ease-in-out w-full ${predictedPrice !== null || isPredicting ? "lg:w-1/2" : "max-w-2xl"}`}>
                <div className="bg-slate-900/90 backdrop-blur-md p-8 rounded-2xl border border-white/5 shadow-2xl">
                    <h2 className="text-xl font-semibold mb-6 text-gray-100">Vehicle Specifications</h2>

                    {isLoading ? (
                        <div className="animate-pulse flex space-x-4">
                            <div className="flex-1 space-y-4 py-1">
                                <div className="h-4 bg-slate-700 rounded w-3/4"></div>
                                <div className="space-y-2">
                                    <div className="h-4 bg-slate-700 rounded"></div>
                                    <div className="h-4 bg-slate-700 rounded w-5/6"></div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        metadata && (
                            <form className="space-y-6" onSubmit={handlePredict}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    {/* Brand */}
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-1">Brand</label>
                                        <select className="w-full bg-slate-800/80 border border-slate-700 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-cyan-500 outline-none transition-all" value={selectedBrand} onChange={handleBrandChange} required>
                                            <option value="">-- Select Brand --</option>
                                            {Object.keys(metadata.brands_and_models).sort((a, b) => a.localeCompare(b)).map((brandName) => (
                                                <option key={brandName} value={brandName}>{brandName}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Model */}
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-1">Model</label>
                                        <select className="w-full bg-slate-800/80 border border-slate-700 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-cyan-500 outline-none disabled:opacity-50 transition-all" value={selectedModel} onChange={(e) => setSelectedModel(e.target.value)} disabled={!selectedBrand} required>
                                            <option value="">-- Select Model --</option>
                                            {selectedBrand && [...metadata.brands_and_models[selectedBrand]].sort((a, b) => a.localeCompare(b)).map((modelName) => (
                                                <option key={modelName} value={modelName}>{modelName}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Year */}
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-1">Manufacturing Year</label>
                                        <input type="number" min="1990" max="2024" className="w-full bg-slate-800/80 border border-slate-700 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-cyan-500 outline-none transition-all" placeholder="e.g. 2018" value={year} onChange={(e) => setYear(e.target.value)} required />
                                    </div>

                                    {/* Distance Driven */}
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-1">Distance Driven (km)</label>
                                        <input type="number" min="0" className="w-full bg-slate-800/80 border border-slate-700 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-cyan-500 outline-none transition-all" placeholder="e.g. 45000" value={distance} onChange={(e) => setDistance(e.target.value)} required />
                                    </div>

                                    {/* Owner */}
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-1">Ownership History</label>
                                        <select className="w-full bg-slate-800/80 border border-slate-700 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-cyan-500 outline-none transition-all" value={owner} onChange={(e) => setOwner(Number(e.target.value))}>
                                            <option value="1">1st Owner</option>
                                            <option value="2">2nd Owner</option>
                                            <option value="3">3rd Owner</option>
                                            <option value="4">4th Owner</option>
                                            <option value="5">5th Owner or more</option>
                                        </select>
                                    </div>

                                    {/* State */}
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-1">Registration State</label>
                                        <select className="w-full bg-slate-800/80 border border-slate-700 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-cyan-500 outline-none transition-all" value={selectedState} onChange={(e) => setSelectedState(e.target.value)} required>
                                            <option value="">-- Select State --</option>
                                            {[...metadata.states].sort((a, b) => a.localeCompare(b)).map((state) => (
                                                <option key={state} value={state}>{state}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Fuel */}
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-1">Fuel Type</label>
                                        <select className="w-full bg-slate-800/80 border border-slate-700 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-cyan-500 outline-none transition-all" value={fuel} onChange={(e) => setFuel(e.target.value)} required>
                                            <option value="">-- Select Fuel --</option>
                                            {[...metadata.fuel_types].sort((a, b) => a.localeCompare(b)).map((f) => (
                                                <option key={f} value={f}>{f}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Transmission */}
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-1">Transmission</label>
                                        <select className="w-full bg-slate-800/80 border border-slate-700 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-cyan-500 outline-none transition-all" value={transmission} onChange={(e) => setTransmission(e.target.value)} required>
                                            <option value="">-- Select Transmission --</option>
                                            {[...metadata.transmissions].sort((a, b) => a.localeCompare(b)).map((t) => (
                                                <option key={t} value={t}>{t}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Body Type */}
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-slate-400 mb-1">Body Type</label>
                                        <select className="w-full bg-slate-800/80 border border-slate-700 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-cyan-500 outline-none transition-all" value={bodyType} onChange={(e) => setBodyType(e.target.value)} required>
                                            <option value="">-- Select Body Type --</option>
                                            {[...metadata.body_types].sort((a, b) => a.localeCompare(b)).map((b) => (
                                                <option key={b} value={b}>{b}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <button type="submit" disabled={isPredicting} className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3.5 px-4 rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_25px_rgba(56,189,248,0.5)] tracking-wide">
                                        {isPredicting ? "Processing Data..." : "Predict Price"}
                                    </button>
                                </div>
                            </form>
                        )
                    )}
                </div>
            </div>

            {/* RIGHT COLUMN: Loading State & AI Market Analysis */}
            {(predictedPrice !== null || isPredicting) && (
                <div className="w-full lg:w-1/2 flex flex-col justify-center h-full animate-in fade-in slide-in-from-right-8 duration-700">

                    {isPredicting ? (
                        <div className="flex flex-col items-center justify-center p-12 bg-slate-900/40 backdrop-blur-md rounded-3xl border border-cyan-500/20 shadow-2xl">
                            <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-cyan-400 rounded-full animate-spin mb-6 shadow-[0_0_15px_rgba(34,211,238,0.5)]"></div>
                            <p className="text-cyan-400 font-semibold tracking-widest uppercase animate-pulse text-sm">Calculating Algorithmic Valuation...</p>
                        </div>
                    ) : predictedPrice !== null ? (
                        <div className="p-8 bg-slate-900/70 backdrop-blur-xl border border-indigo-500/30 rounded-3xl shadow-2xl text-center relative overflow-hidden">

                            {/* Soft background glow effect */}
                            <div className="absolute -top-20 -right-20 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
                            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

                            <p className="text-cyan-400 font-bold mb-4 uppercase tracking-widest text-sm relative z-10">Estimated Market Value</p>

                            <div className="text-6xl font-extrabold text-white mb-8 drop-shadow-[0_0_15px_rgba(34,211,238,0.2)] relative z-10">
                                <CountUp start={0} end={predictedPrice} duration={2.5} separator="," prefix="₹" />
                            </div>

                            {insight && (
                                <div className="pt-6 border-t border-white/10 text-left bg-slate-950/60 p-6 rounded-2xl shadow-inner relative z-10">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="h-2.5 w-2.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_10px_rgba(34,211,238,0.8)]"></div>
                                        <span className="text-xs font-bold text-cyan-400 tracking-widest uppercase">AI Market Analyst</span>
                                    </div>
                                    <p className="text-slate-300 text-[15px] leading-relaxed">
                                        {insight}
                                    </p>
                                </div>
                            )}
                        </div>
                    ) : null}
                </div>
            )}
        </div>
    );
}