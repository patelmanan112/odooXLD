import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import s from './LandingPage.module.css';

export const FinalCTA = () => {
  return (
    <>
      <section className={s.finalCTASection}>
        <div className={s.finalCTABg} />
        <div className={s.finalCTAContent}>
          <motion.p
            className={s.labelLight}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            style={{ marginBottom: 24 }}
          >
            08 — Begin
          </motion.p>
          <motion.h2
            className={s.finalCTAHeadline}
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            YOUR NEXT<br /><em>ADVENTURE</em><br />IS WAITING.
          </motion.h2>
          <motion.p
            className={s.finalCTACopy}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Turn the places you've been dreaming about into a journey you can actually take. Plan your first trip today — it's free.
          </motion.p>
          <motion.div
            className={s.finalCTABtns}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.35, duration: 0.6 }}
          >
            <Link to="/register" className={s.btnPrimary}>
              Start Planning <ArrowRight size={16} />
            </Link>
            <Link to="/login" className={s.btnDark}>
              Log In
            </Link>
          </motion.div>
        </div>
      </section>

      <footer className={s.footer}>
        <div className={s.footerLogo}>Wander<span>ly</span></div>
        <p className={s.footerCopy}>© 2026 Wanderly. Made with ♥ for travelers.</p>
        <div style={{ display: 'flex', gap: 24 }}>
          {['Privacy', 'Terms', 'Contact'].map(item => (
            <a key={item} href="#" style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.3)', textDecoration: 'none' }} onClick={e => e.preventDefault()}>
              {item}
            </a>
          ))}
        </div>
      </footer>
    </>
  );
};
