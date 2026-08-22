import React from 'react';
import { motion } from 'framer-motion';
import { Globe, FileText, Map, MessageSquare, BookOpen, Calculator } from 'lucide-react';
import s from './LandingPage.module.css';

const tabs = [
  { icon: Globe, label: 'Google Flights', sub: '24 tabs open', color: '#4285f4' },
  { icon: Map, label: 'Google Maps', sub: 'Dropped pins', color: '#34a853' },
  { icon: MessageSquare, label: 'WhatsApp Groups', sub: 'Endless suggestions', color: '#25d366' },
  { icon: FileText, label: 'Notes App', sub: 'Scattered ideas', color: '#f59e0b' },
  { icon: Calculator, label: 'Excel Budget', sub: 'Out of date', color: '#217346' },
  { icon: BookOpen, label: 'Travel Blogs', sub: 'Too much info', color: '#e05735' },
];

export const ProblemSection = () => {
  return (
    <section style={{ backgroundColor: '#f3ede4', padding: 'clamp(64px, 10vw, 120px) clamp(20px, 5vw, 80px)' }}>
      <div style={{ maxWidth: '1440px', margin: '0 auto' }}>
        <div className={s.problemGrid}>
          {/* Left — The chaos */}
          <div>
            <motion.p
              className={s.label}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              03 — The Problem
            </motion.p>

            <motion.h2
              className={s.displayMd}
              style={{ color: '#1a1714', marginTop: 12, marginBottom: 20 }}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              Planning a trip shouldn't mean opening twelve tabs.
            </motion.h2>

            <motion.p
              className={s.bodyText}
              style={{ marginBottom: 36 }}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
            >
              Most people piece together their travel plans across scattered apps, spreadsheets, and group chats. By the time the trip starts, half the excitement is already lost.
            </motion.p>

            <motion.div
              style={{
                display: 'inline-block',
                padding: '12px 24px',
                background: '#1a1714',
                color: '#faf8f4',
                borderRadius: 4,
                fontSize: '0.9rem',
                fontWeight: 700,
                letterSpacing: '0.04em'
              }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              Wanderly brings it all together. →
            </motion.div>
          </div>

          {/* Right — Tab chaos visual */}
          <div className={s.tabChaos}>
            {tabs.map((tab, i) => {
              const Icon = tab.icon;
              return (
                <motion.div
                  key={tab.label}
                  className={s.tabItem}
                  style={{ transform: `rotate(${(i % 2 === 0 ? 1 : -1) * (i * 0.3)}deg)` }}
                  initial={{ opacity: 0, x: 40 }}
                  whileInView={{ opacity: 1 - i * 0.08, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                >
                  <div className={s.tabItemIcon}>
                    <Icon size={16} color={tab.color} />
                  </div>
                  <div className={s.tabItemText}>
                    <p className={s.tabItemTitle}>{tab.label}</p>
                    <p className={s.tabItemSub}>{tab.sub}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
