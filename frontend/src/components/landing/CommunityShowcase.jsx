import React from 'react';
import { motion } from 'framer-motion';
import s from './LandingPage.module.css';

const stories = [
  {
    destination: 'Rajasthan Circuit',
    traveler: 'Priya M.',
    duration: '10 days',
    quote: 'Had every single detail planned without losing any of the spontaneity. The itinerary builder made it so easy.',
    image: 'https://images.unsplash.com/photo-1599661046289-e31897f87183?auto=format&fit=crop&w=800&q=80',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80',
  },
  {
    destination: 'Goa Beach Week',
    traveler: 'Rahul & Friends',
    duration: '7 days',
    quote: 'We used Wanderly for a group trip of 8. Everyone could see the plan, suggest activities, and track spending.',
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80',
  },
  {
    destination: 'Himachal Adventure',
    traveler: 'Aditi S.',
    duration: '14 days',
    quote: 'From Manali to Spiti — a complex route made simple. The budget tracker saved us from overspending.',
    image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80',
  },
];

export const CommunityShowcase = () => {
  return (
    <section id="community" style={{ backgroundColor: '#f3ede4', padding: 'clamp(64px, 10vw, 120px) clamp(20px, 5vw, 80px)' }}>
      <div style={{ maxWidth: '1440px', margin: '0 auto' }}>
        <motion.p
          className={s.label}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          07 — Travel Stories
        </motion.p>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 24 }}>
          <motion.h2
            className={s.displayLg}
            style={{ color: '#1a1714', marginTop: 12 }}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            STORIES WORTH<br />SHARING.
          </motion.h2>
          <motion.p
            className={s.bodyText}
            style={{ maxWidth: 360 }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Real trips, real travelers — see how Wanderly turns plans into memories.
          </motion.p>
        </div>

        <div className={s.communityGrid}>
          {stories.map((story, i) => (
            <motion.div
              key={story.destination}
              className={s.communityCard}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
            >
              <div style={{ position: 'relative', overflow: 'hidden' }}>
                <img
                  src={story.image}
                  alt={`Travel story — ${story.destination}`}
                  className={s.communityImage}
                  loading="lazy"
                />
                <div style={{ position: 'absolute', top: 14, left: 14, background: 'rgba(200,98,42,0.9)', color: '#fff', fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.06em', padding: '4px 10px', borderRadius: 100 }}>
                  {story.duration}
                </div>
              </div>
              <div className={s.communityCardBody}>
                <p style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#c8622a', marginBottom: 10 }}>
                  {story.destination}
                </p>
                <p className={s.communityCardQuote}>"{story.quote}"</p>
                <div className={s.communityCardAuthor}>
                  <img src={story.avatar} alt={story.traveler} className={s.communityAvatar} />
                  <div>
                    <p className={s.communityAuthorName}>{story.traveler}</p>
                    <p className={s.communityAuthorTrip}>{story.duration} trip</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
