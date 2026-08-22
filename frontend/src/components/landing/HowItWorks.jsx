import React from 'react';
import { motion } from 'framer-motion';
import { Search, LayoutList, Navigation } from 'lucide-react';
import s from './LandingPage.module.css';

const steps = [
  {
    num: '01',
    icon: Search,
    title: 'Discover',
    description: 'Find cities, attractions, and experiences that match your travel style. Browse curated destinations or search for exactly what excites you.',
  },
  {
    num: '02',
    icon: LayoutList,
    title: 'Design',
    description: 'Build your itinerary day by day. Add activities, set timings, assign stops to cities — your entire journey takes shape in one place.',
  },
  {
    num: '03',
    icon: Navigation,
    title: 'Go',
    description: 'Follow your journey as it unfolds. Track spending against your budget, check off activities, and share your trip with fellow travelers.',
  },
];

export const HowItWorks = () => {
  return (
    <section id="how-it-works" style={{ backgroundColor: '#faf8f4', padding: 'clamp(64px, 10vw, 120px) clamp(20px, 5vw, 80px)' }}>
      <div style={{ maxWidth: '1440px', margin: '0 auto' }}>
        <motion.p
          className={s.label}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          04 — How It Works
        </motion.p>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 24, marginBottom: 0 }}>
          <motion.h2
            className={s.displayLg}
            style={{ color: '#1a1714', marginTop: 12 }}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            FROM IDEA<br />TO ITINERARY.
          </motion.h2>
          <motion.p
            className={s.bodyText}
            style={{ maxWidth: 360 }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Three steps is all it takes to turn the places you've been dreaming about into a trip you can actually take.
          </motion.p>
        </div>

        <div className={s.stepsRow}>
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.num}
                className={s.step}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className={s.stepNumber}>{step.num}</div>
                <div className={s.stepIcon}>
                  <Icon size={24} />
                </div>
                <h3 className={s.stepTitle}>{step.title}</h3>
                <p className={s.stepDesc}>{step.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
