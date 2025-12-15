import React, { useRef, useState } from 'react';
import { X, Download, Share2, Loader2 } from 'lucide-react';
import html2canvas from 'html2canvas';

interface ShareModalProps {
  daysClean: number;
  addiction: string;
  streak: number;
  onClose: () => void;
}

const ShareModal: React.FC<ShareModalProps> = ({ daysClean, addiction, streak, onClose }) => {
  const bannerRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownload = async () => {
    if (!bannerRef.current) return;
    setIsGenerating(true);
    
    try {
      // Create canvas
      const canvas = await html2canvas(bannerRef.current, {
        scale: 2, // High resolution
        useCORS: true,
        backgroundColor: '#0f172a',
      });
      
      // Download
      const link = document.createElement('a');
      link.download = `nawathimu-progress-${daysClean}days.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error("Failed to generate image", err);
      alert("Could not generate image. Please try screenshotting manually.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex justify-between items-center">
          <h3 className="font-bold text-white flex items-center gap-2">
            <Share2 size={18} className="text-emerald-400" /> Share Progress
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        {/* Preview Area (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-950 flex justify-center">
            
          {/* THE BANNER (This is what gets captured) */}
          <div 
            ref={bannerRef}
            className="w-[320px] h-[568px] relative bg-slate-900 overflow-hidden shrink-0 shadow-2xl"
            style={{ 
                background: 'linear-gradient(145deg, #020617 0%, #0f172a 100%)' 
            }}
          >
            {/* Background Blobs */}
            <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[50%] bg-emerald-600/20 rounded-full blur-[80px]"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[80%] h-[50%] bg-blue-600/10 rounded-full blur-[80px]"></div>

            {/* Content Container */}
            <div className="relative z-10 h-full flex flex-col items-center justify-between p-8 text-center border-[12px] border-slate-900">
                
                {/* Header Text */}
                <div className="mt-4">
                    <p className="text-emerald-400 font-bold tracking-widest text-sm uppercase mb-1">MY JOURNEY</p>
                    <h2 className="text-white font-black text-3xl font-['Noto_Sans_Sinhala']">නවතිමු</h2>
                    <p className="text-slate-400 text-xs tracking-wider">Nawathimu</p>
                </div>

                {/* Main Stat */}
                <div className="flex flex-col items-center justify-center">
                    <div className="relative">
                        <span className="text-[120px] font-black text-white leading-none tracking-tighter drop-shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                            {daysClean}
                        </span>
                        <div className="absolute -right-4 top-4 text-4xl">🔥</div>
                    </div>
                    <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200 uppercase tracking-wide">
                        Days Clean
                    </p>
                    <div className="mt-4 bg-slate-800/50 px-4 py-2 rounded-full border border-slate-700/50">
                        <p className="text-slate-300 text-sm font-medium">Free from {addiction}</p>
                    </div>
                </div>

                {/* Footer / Branding */}
                <div className="w-full mt-auto mb-4">
                    <div className="bg-white p-3 rounded-2xl mx-auto w-32 h-32 flex items-center justify-center shadow-lg mb-6">
                        {/* QR Code pointing to website */}
                        <img 
                            src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://www.muttiya.com" 
                            alt="QR Code" 
                            className="w-full h-full object-contain mix-blend-multiply"
                            crossOrigin="anonymous"
                        />
                    </div>
                    
                    {/* Muttiya Logo Text */}
                    <div className="space-y-1">
                        <h3 className="text-red-600 font-black text-4xl font-['Noto_Sans_Sinhala'] drop-shadow-md">
                            මුට්ටිය<span className="text-red-600 text-2xl">.කොම්</span>
                        </h3>
                        <p className="text-slate-500 text-[10px] tracking-[0.2em] uppercase font-bold">
                            www.muttiya.com
                        </p>
                    </div>
                </div>

            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800 bg-slate-900">
          <p className="text-xs text-slate-400 text-center mb-4">
            Save this image to share on your Story!
          </p>
          <button 
            onClick={handleDownload}
            disabled={isGenerating}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-900/20 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            {isGenerating ? <Loader2 className="animate-spin" /> : <Download size={20} />}
            {isGenerating ? "Generating..." : "Download Image"}
          </button>
        </div>

      </div>
    </div>
  );
};

export default ShareModal;