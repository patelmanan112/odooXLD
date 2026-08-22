import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, MapPin, Calendar, Layers } from 'lucide-react';
import s from './LandingPage.module.css';

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } }
};

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } }
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.8, ease: 'easeOut' } }
};

export const HeroSection = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '10%']);

  return (
    <section ref={ref} className={s.hero}>
      {/* Left — Text Content */}
      <motion.div
        className={s.heroLeft}
        style={{ y: contentY }}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.p className={s.label} variants={fadeUp}>
          Wanderly / Your Travel Planner
        </motion.p>

        <motion.h1 className={s.heroHeadline} variants={fadeUp}>
          PLAN THE<br />
          JOURNEY.<br />
          <em>LIVE THE</em><br />
          STORY.
        </motion.h1>

        <motion.p className={s.heroCopy} variants={fadeUp}>
          Discover destinations, shape your itinerary day by day, and keep every detail of your journey — from activities to budget — in one beautiful place.
        </motion.p>

        <motion.div className={s.heroCTAs} variants={fadeUp}>
          <Link to="/register" className={s.btnPrimary}>
            Start Planning <ArrowRight size={16} />
          </Link>
          <a
            href="#discover"
            className={s.btnSecondary}
            onClick={e => { e.preventDefault(); document.querySelector('#discover')?.scrollIntoView({ behavior: 'smooth' }); }}
          >
            Explore Destinations
          </a>
        </motion.div>

        <motion.div className={s.statsRow} variants={fadeUp}>
          {[
            { number: '12K+', label: 'Trips Planned' },
            { number: '80+', label: 'Destinations' },
            { number: '4.9/5', label: 'User Rating' },
          ].map(stat => (
            <div key={stat.label} className={s.statItem}>
              <span className={s.statNumber}>{stat.number}</span>
              <span className={s.statLabel}>{stat.label}</span>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Right — Image Composition */}
      <motion.div
        className={s.heroRight}
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
      >
        <motion.div className={s.heroImageContainer} style={{ y: imageY }}>
          <img
            src="https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1200&q=80"
            alt="Udaipur Palace, Rajasthan — a stunning lakeside destination"
            className={s.heroImage}
            loading="eager"
          />
          <div className={s.heroImageOverlay} />
        </motion.div>

        {/* Floating Itinerary Card */}
        <motion.div
          className={s.heroFloatingCard}
          initial={{ opacity: 0, x: -30, y: 20 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ duration: 0.7, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className={s.heroFloatingCardTitle}>Your Next Escape</p>
          <p className={s.heroFloatingCardCity}>Udaipur, India</p>
          <p className={s.heroFloatingCardDates}>10 — 17 September</p>
          <div className={s.heroFloatingCardMeta}>
            <span><MapPin size={10} /> 3 Destinations</span>
            <span><Calendar size={10} /> 7 Days</span>
            <span><Layers size={10} /> 12 Activities</span>
          </div>
        </motion.div>

        {/* Floating Activity Card */}
        <motion.div
          className={s.heroActivityCard}
          initial={{ opacity: 0, x: 30, y: -20 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ duration: 0.7, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className={s.heroActivityTitle}>Today's Plan</p>
          <div className={s.heroActivityItems}>
            {[
              'City Palace Tour',
              'Lake Pichola Sunset',
              'Old City Dinner',
            ].map(a => (
              <div key={a} className={s.heroActivityItem}>
                <span className={s.heroActivityDot} />
                {a}
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className={s.scrollIndicator}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.6 }}
      >
        <span className={s.scrollLine} />
        <span>Scroll</span>
      </motion.div>
    </section>
  );
};
