import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

type Belt = Tables<"belts">;

export default function Progress() {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [beltLevel, setBeltLevel] = useState("");
  const [belts, setBelts] = useState<Belt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isLoading && !user) { navigate("/auth"); return; }
    if (!user) return;

    const fetchProgress = async () => {
      try {
        // Fetch all belts from database ordered by rank
        const { data: beltsData, error: beltsError } = await supabase
          .from("belts")
          .select("*")
          .order("rank", { ascending: true });

        if (beltsError) {
          setError(beltsError.message);
          setLoading(false);
          return;
        }

        setBelts(beltsData || []);

        // Fetch user's current belt level
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("belt_level")
          .eq("id", user.id)
          .maybeSingle();

        if (userError) {
          setError(userError.message);
        } else {
          setBeltLevel(userData?.belt_level || "White");
        }
        
        setLoading(false);
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProgress();
  }, [user, isLoading, navigate]);

  if (isLoading || !user) return null;

  const currentIndex = belts.findIndex((b) => b.name === beltLevel);
  const currentBelt = belts[currentIndex];

  return (
    <div className="min-h-screen bg-background px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => navigate("/dashboard")}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors font-body mb-6 inline-block"
        >
          ← Back to Dashboard
        </button>

        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="font-display text-3xl font-bold glow-text mb-8"
        >
          🥋 Progress
        </motion.h1>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <span className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          </div>
        ) : error ? (
          <p className="text-destructive font-body">{error}</p>
        ) : belts.length === 0 ? (
          <p className="text-muted-foreground font-body">No belts found in the system.</p>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-8"
          >
            <h2 className="font-display text-lg font-semibold text-foreground mb-6 text-center">
              Current Belt Level
            </h2>

            <div className="flex flex-col items-center gap-6">
              {currentBelt && (
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className={`w-48 h-12 rounded-lg ${currentBelt.color_class} ${currentBelt.text_color} flex items-center justify-center font-display font-bold text-xl shadow-lg`}
                >
                  {beltLevel} Belt
                </motion.div>
              )}

              <div className="w-full mt-4">
                <div className="flex justify-between mb-2">
                  {belts.map((belt, i) => (
                    <div key={belt.id} className="flex flex-col items-center gap-1">
                      <div
                        className={`w-6 h-3 rounded-sm ${belt.color_class} ${
                          i <= currentIndex ? "opacity-100" : "opacity-30"
                        }`}
                      />
                      <span className={`text-[10px] font-body ${
                        i <= currentIndex ? "text-foreground" : "text-muted-foreground"
                      }`}>
                        {belt.name}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentIndex + 1) / belts.length) * 100}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-2 rounded-full"
                    style={{ background: "var(--gradient-primary)" }}
                  />
                </div>
              </div>

              {currentBelt?.description && (
                <p className="text-sm text-muted-foreground font-body text-center mt-4">
                  {currentBelt.description}
                </p>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
