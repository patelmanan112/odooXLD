import React from 'react';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import s from './LandingPage.module.css';

const destinations = [
  {
    city: 'Udaipur',
    country: 'Rajasthan, India',
    tag: 'Heritage',
    descriptor: 'City of Lakes',
    image: 'https://www.thehosteller.com/_next/image/?url=https%3A%2F%2Fstatic.thehosteller.com%2Fhostel%2Fimages%2Fcover%20photo.jpg%2Fcover%20photo-1696914123916.jpg&w=3840&q=75',
  },
  {
    city: 'Goa',
    country: 'India',
    tag: 'Beaches',
    descriptor: 'Sun & Surf',
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80',
  },
  {
    city: 'Manali',
    country: 'Himachal Pradesh',
    tag: 'Adventure',
    descriptor: 'Alpine Trails',
    image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80',
  },
  {
    city: 'Jaipur',
    country: 'Rajasthan, India',
    tag: 'Culture',
    descriptor: 'The Pink City',
    image: 'https://images.unsplash.com/photo-1603262110263-fb0112e7cc33?auto=format&fit=crop&w=800&q=80',
  },
  {
    city: 'Mumbai',
    country: 'Maharashtra, India',
    tag: 'City',
    descriptor: 'City of Dreams',
    image: 'https://images.unsplash.com/photo-1595658658481-d53d3f999875?auto=format&fit=crop&w=800&q=80',
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }
  })
};

export const DestinationShowcase = () => {
  return (
    <section id="discover" style={{ backgroundColor: '#faf8f4', padding: 'clamp(64px, 10vw, 120px) clamp(20px, 5vw, 80px)' }}>
      <div style={{ maxWidth: '1440px', margin: '0 auto' }}>
        <motion.p
          className={s.label}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          02 — Discover
        </motion.p>

        <motion.h2
          className={s.displayLg}
          style={{ color: '#1a1714', marginTop: 12, marginBottom: 0, maxWidth: 600 }}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          WHERE WILL<br />YOU GO NEXT?
        </motion.h2>

        <motion.p
          className={s.bodyText}
          style={{ maxWidth: 480, marginTop: 16 }}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          From palaces by the lake to trails through the Himalayas — discover the destinations that become your next story.
        </motion.p>

        <div className={s.destinationGrid}>
          {destinations.map((dest, i) => (
            <motion.div
              key={dest.city}
              className={s.destCard}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-40px' }}
            >
              <img
                src={dest.image}
                alt={`${dest.city}, ${dest.country} — ${dest.descriptor}`}
                className={s.destImage}
                loading="lazy"
              />
              <div className={s.destOverlay} />
              <div className={s.destInfo}>
                <p className={s.destCity}>{dest.city}</p>
                <p className={s.destCountry}>
                  <MapPin size={10} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 3 }} />
                  {dest.country}
                </p>
                <span className={s.destTag}>{dest.tag}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
