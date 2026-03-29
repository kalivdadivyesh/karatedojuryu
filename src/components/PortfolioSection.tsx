import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const belts = [
  { title: "White to Yellow", category: "Beginner", color: "from-glow-gold/20 to-glow-red/10", desc: "Foundation techniques, stances, and basic kata." },
  { title: "Orange to Green", category: "Intermediate", color: "from-glow-red/15 to-glow-gold/20", desc: "Advanced kata, sparring fundamentals, and self-defense." },
  { title: "Blue to Brown", category: "Advanced", color: "from-glow-gold/20 to-glow-crimson/20", desc: "Complex combinations, tournament prep, and teaching basics." },
  { title: "Black Belt & Beyond", category: "Mastery", color: "from-glow-red/20 to-glow-gold/20", desc: "Leadership, advanced kumite, and instructor certification." },
];

export default function PortfolioSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="work" className="section-padding" ref={ref}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <p className="text-sm uppercase tracking-[0.3em] text-primary mb-3 font-body">Belt Journey</p>
          <h2 className="font-display font-bold text-4xl md:text-5xl">
            Path to <span className="glow-text">Mastery</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {belts.map((b, i) => (
            <motion.div
              key={b.title}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.15, duration: 0.6 }}
              className="group relative aspect-[4/3] rounded-xl overflow-hidden cursor-pointer glass-card"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${b.color} transition-opacity group-hover:opacity-80`} />
              <div className="absolute inset-0 flex flex-col justify-end p-8">
                <p className="text-xs uppercase tracking-[0.2em] text-primary mb-2 font-body">{b.category}</p>
                <h3 className="font-display font-bold text-2xl md:text-3xl text-foreground group-hover:glow-text transition-all duration-300 mb-2">
                  {b.title}
                </h3>
                <p className="text-muted-foreground text-sm font-body opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {b.desc}
                </p>
              </div>
              <div className="absolute inset-0 border border-transparent group-hover:border-primary/30 rounded-xl transition-all duration-500" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
