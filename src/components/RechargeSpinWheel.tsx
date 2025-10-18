import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Sparkles, Flame } from "lucide-react";

interface RechargeSpinWheelProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SpinWheelConfig {
  title: string;
  body_text: string;
  percentages: number[];
  colors: string[];
  fixed_winning_percentage: number;
}

const RechargeSpinWheel = ({ isOpen, onClose }: RechargeSpinWheelProps) => {
  const { user } = useAuth();
  const spinTargetRef = useRef<number | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [hasSpun, setHasSpun] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [wonBonus, setWonBonus] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
    const [config, setConfig] = useState<SpinWheelConfig>({
    title: "🪔 Diwali Dhamaka Spin Wheel 🪔",
    body_text: "May this Diwali bring you prosperity and mega bonuses!",
    percentages: [20, 5, 10, 1, 15, 30, 25, 40],
    colors: [
      "from-orange-500 via-amber-400 to-yellow-500",
      "from-red-600 via-rose-500 to-pink-500",
      "from-yellow-500 via-orange-400 to-amber-600",
      "from-purple-600 via-fuchsia-500 to-pink-600",
      "from-amber-600 via-yellow-500 to-orange-500",
      "from-rose-600 via-red-500 to-orange-600",
      "from-orange-600 via-amber-500 to-yellow-600",
      "from-pink-600 via-rose-500 to-red-600"
    ],
    fixed_winning_percentage: 20
  });

  // Generate prizes from config
  const prizes = config.percentages.map((percentage, index) => ({
    percentage,
    color: config.colors[index] || "from-gray-400 to-gray-600",
    angle: index * 45
  }));

  useEffect(() => {
    if (isOpen && user) {
      fetchConfig();
      checkSpinStatus();
    }
  }, [isOpen, user]);

  const fetchConfig = async () => {
    try {
      const { data, error } = await supabase
        .from("spin_wheel_config")
        .select("*")
        .eq("is_active", true)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setConfig({
          title: data.title,
          body_text: data.body_text,
          percentages: data.percentages,
          colors: data.colors,
          fixed_winning_percentage: data.fixed_winning_percentage
        });
      }
    } catch (error) {
      console.error("Error fetching config:", error);
    }
  };

  const checkSpinStatus = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("recharge_bonus_spins")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error && error.code !== "PGRST116") throw error;

      if (data) {
        setHasSpun(data.has_spun);
        if (data.has_spun) {
          setWonBonus(data.bonus_percentage);
        }
      }
    } catch (error) {
      console.error("Error checking spin status:", error);
    } finally {
      setLoading(false);
    }
  };

    const handleSpinComplete = async () => {
    if (!spinTargetRef.current || !user) return;
    const winningPercentage = spinTargetRef.current;
    spinTargetRef.current = null;
    setWonBonus(winningPercentage);
    setHasSpun(true);

    try {
      const { error } = await supabase
        .from("recharge_bonus_spins")
        .upsert({
          user_id: user.id,
          bonus_percentage: winningPercentage,
          has_spun: true,
          spun_at: new Date().toISOString(),
        });

      if (error) throw error;

      toast.success(`🪔 Diwali Blessings! You won ${winningPercentage}% recharge bonus! 🎆`, {
        duration: 5000,
      });
    } catch (error) {
      console.error("Error recording spin:", error);
      toast.error("Failed to record your spin. Please contact support.");
    }
  };

  const onWheelTransitionEnd = (e: React.TransitionEvent<HTMLDivElement>) => {
    if (e.propertyName !== "transform") return;
    setRotation((prev) => ((prev % 360) + 360) % 360);
    setIsSpinning(false);
    handleSpinComplete();
  };

  const spinWheel = async () => {
    if (!user || hasSpun || isSpinning) return;

    setIsSpinning(true);

    const winningPercentage = config.fixed_winning_percentage;
    let winningIndex = config.percentages.indexOf(winningPercentage);
    if (winningIndex < 0) winningIndex = 0;

    const segmentCount = config.percentages.length; // typically 8
    const segmentAngle = 360 / segmentCount; // 45
    const centerOffset = segmentAngle / 2; // 22.5
    const rotationToTop = 360 - (winningIndex * segmentAngle + centerOffset);

    const current = rotation;
    const remainder = ((current % 360) + 360) % 360;
    const deltaToTarget = ((rotationToTop - remainder) % 360 + 360) % 360;
    const spins = 5;
    const finalRotation = current + spins * 360 + deltaToTarget;

    spinTargetRef.current = winningPercentage;
    setRotation(finalRotation);
  };

    return (
    <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-[95vw] sm:max-w-[448px] mx-auto bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 border-2 sm:border-4 border-orange-400 overflow-x-hidden p-2 sm:p-6">
        {/* LED Strip Lights - Top */}
        <div className="absolute top-0 left-0 right-0 pointer-events-none z-10">
          <div className="h-3 sm:h-4 relative">
            <div className="absolute inset-x-2 top-1/2 -translate-y-1/2 h-[2px] bg-gradient-to-r from-white/30 via-white/20 to-white/30 rounded-full" />
            <div className="mx-2 flex items-center justify-between">
              {Array.from({ length: 28 }).map((_, i) => {
                const palette = ["#60a5fa", "#22c55e", "#f87171", "#f59e0b", "#a78bfa"]; // blue, green, red, amber, violet
                const color = palette[i % palette.length];
                return (
                  <span
                    key={`top-led-${i}`}
                    className="block w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full animate-twinkle"
                    style={{ backgroundColor: color, boxShadow: `0 0 6px ${color}, 0 0 10px ${color}`, animationDelay: `${(i % 8) * 0.12}s` }}
                  />
                );
              })}
            </div>
          </div>
        </div>
        
        {/* LED Strip Lights - Bottom */}
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none z-10">
          <div className="h-3 sm:h-4 relative">
            <div className="absolute inset-x-2 top-1/2 -translate-y-1/2 h-[2px] bg-gradient-to-r from-white/30 via-white/20 to-white/30 rounded-full" />
            <div className="mx-2 flex items-center justify-between">
              {Array.from({ length: 28 }).map((_, i) => {
                const palette = ["#f59e0b", "#f87171", "#22c55e", "#60a5fa", "#a78bfa"]; // amber, red, green, blue, violet
                const color = palette[i % palette.length];
                return (
                  <span
                    key={`bottom-led-${i}`}
                    className="block w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full animate-twinkle"
                    style={{ backgroundColor: color, boxShadow: `0 0 6px ${color}, 0 0 10px ${color}`, animationDelay: `${(i % 8) * 0.12 + 0.3}s` }}
                  />
                );
              })}
            </div>
          </div>
        </div>
        <DialogHeader>
                    <DialogTitle className="text-center text-lg sm:text-2xl font-bold bg-gradient-to-r from-orange-600 via-amber-500 to-yellow-600 bg-clip-text text-transparent animate-diwali-shine">
            {config.title}
          </DialogTitle>
          <p className="text-center text-xs sm:text-sm text-orange-700 font-bold mt-1">✨ Shubh Deepavali ✨</p>
        </DialogHeader>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading...</p>
          </div>
        ) : (
                                                  <div className="space-y-1 sm:space-y-2 py-1 sm:py-2">
            {/* Wheel Container */}
            <div className="relative mx-auto w-[220px] h-[220px] sm:w-[280px] sm:h-[280px] md:w-[310px] md:h-[310px]">
                                                        {/* Diwali Diyas (Lamps) - Floating Animation */}
              <div className="absolute top-1 left-1 animate-bounce" style={{ animationDuration: "2s" }}>
                <div className="text-2xl sm:text-3xl">🪔</div>
              </div>
              <div className="absolute top-1 right-1 animate-bounce" style={{ animationDuration: "2.5s", animationDelay: "0.3s" }}>
                <div className="text-2xl sm:text-3xl">🪔</div>
              </div>
              <div className="absolute bottom-1 left-1 animate-bounce" style={{ animationDuration: "2.2s", animationDelay: "0.6s" }}>
                <div className="text-2xl sm:text-3xl">🪔</div>
              </div>
              <div className="absolute bottom-1 right-1 animate-bounce" style={{ animationDuration: "2.8s", animationDelay: "0.9s" }}>
                <div className="text-2xl sm:text-3xl">🪔</div>
              </div>
              
                                                        {/* Sparkles and Fireworks */}
              <div className="absolute top-3 left-3 animate-pulse hidden sm:block">
                <Sparkles className="w-5 h-5 text-orange-500" />
              </div>
              <div className="absolute top-3 right-3 animate-pulse hidden sm:block" style={{ animationDelay: "0.5s" }}>
                <Sparkles className="w-5 h-5 text-yellow-500" />
              </div>
              <div className="absolute bottom-3 left-3 animate-pulse hidden sm:block" style={{ animationDelay: "1s" }}>
                <Flame className="w-5 h-5 text-red-500" />
              </div>
              <div className="absolute bottom-3 right-3 animate-pulse hidden sm:block" style={{ animationDelay: "1.5s" }}>
                <Flame className="w-5 h-5 text-orange-500" />
              </div>
              
              {/* Rangoli Pattern Background */}
              <div className="absolute inset-0 opacity-10">
                <svg viewBox="0 0 200 200" className="w-full h-full">
                  <pattern id="rangoli" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                    <circle cx="20" cy="20" r="15" fill="orange" opacity="0.3"/>
                    <circle cx="20" cy="20" r="8" fill="yellow" opacity="0.4"/>
                  </pattern>
                  <rect width="200" height="200" fill="url(#rangoli)"/>
                </svg>
              </div>

                                                                      {/* Pointer - Diya Flame Style */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-20">
                <div className="relative">
                  <div className="w-0 h-0 border-l-[18px] border-l-transparent border-r-[18px] border-r-transparent border-t-[36px] border-t-orange-500 drop-shadow-2xl"></div>
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 text-2xl animate-pulse" style={{ marginTop: "-34px" }}>🔥</div>
                </div>
              </div>

                                                        {/* Wheel - Enhanced Diwali Theme */}
              <div
                className="w-full h-full rounded-full relative overflow-hidden shadow-2xl border-8 border-orange-500 animate-glow"
                onTransitionEnd={onWheelTransitionEnd}
                style={{
                  transform: `rotate(${rotation}deg)`,
                  transition: isSpinning ? "transform 4s cubic-bezier(0.25, 0.1, 0.25, 1)" : "none",
                  boxShadow: isSpinning ? "0 0 60px rgba(255, 153, 0, 0.8), 0 0 100px rgba(255, 153, 0, 0.5)" : "0 20px 50px rgba(0, 0, 0, 0.3)"
                }}
              >
                                                {/* Color segments - Proper Wheel Slices */}
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <defs>
                    {prizes.map((prize, index) => (
                      <linearGradient key={`gradient-${index}`} id={`grad-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style={{ stopColor: prize.color.includes('orange-500') ? '#f97316' : prize.color.includes('red-600') ? '#dc2626' : prize.color.includes('yellow-500') ? '#eab308' : prize.color.includes('purple-600') ? '#9333ea' : prize.color.includes('amber-600') ? '#d97706' : prize.color.includes('rose-600') ? '#e11d48' : prize.color.includes('pink-600') ? '#db2777' : '#f97316' }} />
                        <stop offset="50%" style={{ stopColor: prize.color.includes('amber-400') ? '#fbbf24' : prize.color.includes('rose-500') ? '#f43f5e' : prize.color.includes('orange-400') ? '#fb923c' : prize.color.includes('fuchsia-500') ? '#d946ef' : prize.color.includes('yellow-500') ? '#eab308' : prize.color.includes('red-500') ? '#ef4444' : prize.color.includes('amber-500') ? '#f59e0b' : prize.color.includes('rose-500') ? '#f43f5e' : '#fbbf24' }} />
                        <stop offset="100%" style={{ stopColor: prize.color.includes('yellow-500') ? '#eab308' : prize.color.includes('pink-500') ? '#ec4899' : prize.color.includes('amber-600') ? '#d97706' : prize.color.includes('pink-600') ? '#db2777' : prize.color.includes('orange-500') ? '#f97316' : prize.color.includes('orange-600') ? '#ea580c' : prize.color.includes('yellow-600') ? '#ca8a04' : prize.color.includes('red-600') ? '#dc2626' : '#eab308' }} />
                      </linearGradient>
                    ))}
                  </defs>
                  {prizes.map((prize, index) => {
                    const startAngle = prize.angle - 90;
                    const endAngle = startAngle + 45;
                    const largeArcFlag = 0;
                    
                    const startRad = (startAngle * Math.PI) / 180;
                    const endRad = (endAngle * Math.PI) / 180;
                    
                    const x1 = 50 + 50 * Math.cos(startRad);
                    const y1 = 50 + 50 * Math.sin(startRad);
                    const x2 = 50 + 50 * Math.cos(endRad);
                    const y2 = 50 + 50 * Math.sin(endRad);
                    
                    return (
                      <path
                        key={`slice-${index}`}
                        d={`M 50 50 L ${x1} ${y1} A 50 50 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                        fill={`url(#grad-${index})`}
                        stroke="white"
                        strokeWidth="0.5"
                        opacity="0.95"
                      />
                    );
                  })}
                </svg>

                                                {/* Percentage labels - Enhanced visibility */}
                {prizes.map((prize, index) => {
                  // Calculate position for each label based on angle
                  const angleRad = ((prize.angle + 22.5) * Math.PI) / 180;
                  const radius = 105; // Distance from center
                  const x = 50 + radius * Math.cos(angleRad) / 3.4;
                  const y = 50 - radius * Math.sin(angleRad) / 3.4;
                  
                  return (
                    <div
                      key={`label-${index}`}
                      className="absolute font-black text-white text-xl z-10 pointer-events-none"
                      style={{
                        left: `${x}%`,
                        top: `${y}%`,
                        transform: `translate(-50%, -50%) rotate(${prize.angle + 22.5}deg)`,
                        textShadow: `
                          -2px -2px 0 #000,
                          2px -2px 0 #000,
                          -2px 2px 0 #000,
                          2px 2px 0 #000,
                          0 0 8px rgba(0,0,0,0.9),
                          0 0 12px rgba(0,0,0,0.7)
                        `,
                      }}
                    >
                                            {prize.percentage}%
                    </div>
                  );
                })}

                                                                                {/* Center circle - Diwali Diya */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70px] h-[70px] rounded-full bg-gradient-to-br from-orange-400 via-amber-400 to-yellow-500 shadow-2xl border-4 border-white flex flex-col items-center justify-center z-20 animate-pulse">
                  <span className="text-2xl mb-1">🪔</span>
                  <span className="text-white font-black text-[10px] drop-shadow-lg">SPIN</span>
                </div>
              </div>
            </div>

                                    {/* Result Message - Diwali Celebration - Moved after button */}

                                    {/* Result Message After Spin */}
            {wonBonus && (
              <div className="text-center bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 p-2 sm:p-4 rounded-xl sm:rounded-2xl shadow-2xl border-2 sm:border-4 border-orange-300">
                <div className="text-xl sm:text-2xl mb-1 sm:mb-2">🎆 🪔 🎇</div>
                <p className="text-white font-bold text-base sm:text-xl drop-shadow-lg">
                  Congratulations! {wonBonus}% Bonus!
                </p>
                <p className="text-white/95 text-[10px] sm:text-xs mt-1 sm:mt-2 font-semibold">
                  {config.body_text}
                </p>
                <div className="text-xl sm:text-2xl mt-1 sm:mt-2">🎊 ✨ 🎉</div>
              </div>
            )}

                        {/* Spin Button - Diwali Style */}
            <div className="text-center space-y-1 sm:space-y-2">
              {hasSpun ? (
                <Button
                  onClick={() => window.location.href = '/recharge'}
                  className="w-full h-10 sm:h-12 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold text-sm sm:text-base shadow-2xl transform hover:scale-105 transition-all duration-300"
                >
                  💳 Recharge & Get {wonBonus}% Extra!
                </Button>
              ) : (
                <>
                  <Button
                    onClick={spinWheel}
                    disabled={isSpinning || hasSpun}
                    className="w-full h-10 sm:h-12 text-base sm:text-lg font-bold bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 hover:from-orange-600 hover:via-amber-600 hover:to-yellow-600 text-white shadow-2xl border-2 border-orange-300 transform hover:scale-105 transition-all duration-300"
                  >
                    {isSpinning ? (
                      <span className="flex items-center gap-1 sm:gap-2">
                        🎆 Spinning... 🎇
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 sm:gap-2">
                        🪔 Spin for Diwali Dhamaka! 🪔
                      </span>
                    )}
                  </Button>
                  <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-1.5 sm:p-2 rounded-lg border border-orange-200">
                    <p className="text-[9px] sm:text-[10px] text-orange-700 font-semibold">
                      ⭐ One divine spin per devotee ⭐
                    </p>
                    <p className="text-[9px] sm:text-[10px] text-orange-600 mt-0.5">
                      May Goddess Lakshmi bless you!
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default RechargeSpinWheel;
