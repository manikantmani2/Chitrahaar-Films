import React from 'react';
import { motion } from 'framer-motion';
import { STATS } from '@/constants';
import { containerVariants, itemVariants } from '@/utils/animations';
import Section from './Section';
import { useScrollPosition } from '@/hooks';

interface CounterProps {
  end: number;
  duration: number;
}

const Counter: React.FC<CounterProps> = ({ end, duration }) => {
  const [count, setCount] = React.useState(0);
  const [started, setStarted] = React.useState(false);
  const [ref, setRef] = React.useState<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (!ref) return;

    const isInViewport = () => {
      const rect = ref.getBoundingClientRect();
      return rect.top < window.innerHeight && rect.bottom > 0;
    };

    if (isInViewport()) {
      setStarted(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true);
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(ref);
    return () => observer.disconnect();
  }, [ref, started]);

  React.useEffect(() => {
    if (!started) return;

    let startTime: number;
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = (timestamp - startTime) / (duration * 1000);

      if (progress < 1) {
        setCount(Math.floor(end * progress));
        requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    requestAnimationFrame(animate);
  }, [started, end, duration]);

  return <div ref={setRef}>{count.toLocaleString()}</div>;
};

const Stats: React.FC = () => {
  return (
    <Section
      id="stats"
      title="By The Numbers"
      subtitle="Our impact and achievements at a glance"
      background="dark"
    >
      <motion.div
        className="grid grid-cols-2 md:grid-cols-4 gap-8"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        {STATS.map((stat, index) => (
          <motion.div
            key={stat.label}
            className="text-center p-6 rounded-xl border border-border hover:border-accent transition-colors duration-300 group"
            variants={itemVariants}
            custom={index * 0.1}
          >
            <div className="text-display-medium md:text-4xl font-bold gradient-text mb-2 group-hover:scale-110 transition-transform duration-300">
              {stat.value.includes('+') ? (
                <>
                  <Counter end={parseInt(stat.value)} duration={2} />+
                </>
              ) : (
                stat.value
              )}
            </div>
            <p className="text-text-secondary text-sm">{stat.label}</p>
          </motion.div>
        ))}
      </motion.div>
    </Section>
  );
};

export default Stats;
