import React from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import s from './LandingPage.module.css';

const budgetItems = [
  { label: 'Stay', amount: 12000, pct: 41, color: '#c8622a' },
  { label: 'Transport', amount: 7200, pct: 24, color: '#d4845a' },
  { label: 'Food', amount: 5500, pct: 19, color: '#e0a882' },
  { label: 'Activities', amount: 4800, pct: 16, color: '#edd3be' },
];

const journeyStops = ['Ahmedabad', 'Udaipur', 'Jaipur', 'Manali'];

function AnimatedNumber({ target, inView }) {
  const [val, setVal] = React.useState(0);
  React.useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 1200;
    const step = 16;
    const increment = target / (duration / step);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) { setVal(target); clearInterval(timer); }
      else setVal(Math.floor(start));
    }, step);
    return () => clearInterval(timer);
  }, [inView, target]);
  return <>{val.toLocaleString('en-IN')}</>;
}

export const BudgetShowcase = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section style={{ backgroundColor: '#faf8f4', padding: 'clamp(64px, 10vw, 120px) clamp(20px, 5vw, 80px)' }}>
      <div style={{ maxWidth: '1440px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
          {/* Left — Journey Map */}
          <div>
            <motion.p
              className={s.label}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              06 — Journey Map
            </motion.p>
            <motion.h2
              className={s.displayMd}
              style={{ color: '#1a1714', marginTop: 12, marginBottom: 20 }}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              Track every city<br />of your journey.
            </motion.h2>
            <motion.p
              className={s.bodyText}
              style={{ marginBottom: 40 }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              Visualise your entire route at a glance. Know where you are, where you're going, and what's waiting ahead.
            </motion.p>

            {/* Journey stops */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {journeyStops.map((stop, i) => (
                <motion.div
                  key={stop}
                  style={{ display: 'flex', alignItems: 'stretch', gap: 16 }}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 + 0.2 }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 16 }}>
                    <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#c8622a', border: '2px solid #faf8f4', boxShadow: '0 0 0 2px #c8622a', flexShrink: 0, marginTop: 4 }} />
                    {i < journeyStops.length - 1 && (
                      <div style={{ flex: 1, width: 2, background: 'linear-gradient(to bottom, #c8622a, rgba(200,98,42,0.15))', margin: '4px 0' }} />
                    )}
                  </div>
                  <div style={{ paddingBottom: i < journeyStops.length - 1 ? 24 : 0 }}>
                    <p style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.05rem', fontWeight: 700, color: '#1a1714' }}>{stop}</p>
                    <p style={{ fontSize: '0.78rem', color: '#7a7065', marginTop: 2 }}>Day {i + 1} — {['10 Sep', '11 Sep', '12 Sep', '14 Sep'][i]}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right — Budget Panel */}
          <div ref={ref}>
            <div className={s.budgetPanel}>
              <div className={s.budgetTotal}>
                <p className={s.budgetTotalLabel}>Total Trip Budget</p>
                <p className={s.budgetTotalAmount}>
                  ₹<AnimatedNumber target={29500} inView={inView} />
                </p>
              </div>

              {budgetItems.map((item, i) => (
                <motion.div
                  key={item.label}
                  className={s.budgetItem}
                  initial={{ opacity: 0, y: 12 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                >
                  <div className={s.budgetItemHeader}>
                    <span className={s.budgetItemLabel}>{item.label}</span>
                    <span className={s.budgetItemAmount}>₹{item.amount.toLocaleString('en-IN')}</span>
                  </div>
                  <div className={s.budgetBar}>
                    <motion.div
                      className={s.budgetBarFill}
                      style={{ background: item.color }}
                      initial={{ width: 0 }}
                      animate={inView ? { width: `${item.pct}%` } : {}}
                      transition={{ duration: 1, delay: i * 0.1 + 0.2, ease: 'easeOut' }}
                    />
                  </div>
                </motion.div>
              ))}

              <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid #f3ede4', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', color: '#7a7065', fontWeight: 600 }}>Spent so far</span>
                <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, color: '#c8622a', fontSize: '1.1rem' }}>₹14,200</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
