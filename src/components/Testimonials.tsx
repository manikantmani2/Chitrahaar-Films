import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { TESTIMONIALS } from '@/constants';
import { containerVariants, itemVariants } from '@/utils/animations';
import Section from './Section';
import Card from './Card';
import { FaStar } from 'react-icons/fa';
import { apiMethods } from '@/api/client';

type PublicTestimonial = {
  id: string;
  name: string;
  company: string;
  quote: string;
  image: string;
};

const Testimonials: React.FC = () => {
  const fallbackTestimonials: PublicTestimonial[] = TESTIMONIALS.map((testimonial) => ({
    id: String(testimonial.id),
    name: testimonial.name,
    company: testimonial.company,
    quote: testimonial.quote,
    image: testimonial.image,
  }));

  const [testimonials, setTestimonials] = useState<PublicTestimonial[]>(fallbackTestimonials);
  const [showForm, setShowForm] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [rating, setRating] = useState('5');
  const [eventType, setEventType] = useState('Wedding');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  React.useEffect(() => {
    let cancelled = false;

    const loadTestimonials = async () => {
      try {
        const response = await fetch('/api/public-feedback');
        if (!response.ok) {
          return;
        }

        const data = await response.json();
        if (!cancelled && Array.isArray(data?.items) && data.items.length > 0) {
          setTestimonials(data.items);
        }
      } catch {
        // use static testimonials if API unavailable
      }
    };

    void loadTestimonials();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus(null);
    try {
      await apiMethods.submitFeedback({
        name,
        email,
        rating: Number(rating),
        eventType,
        message,
      });
      setStatus('Thank you — your feedback has been submitted.');
      setName('');
      setEmail('');
      setRating('5');
      setEventType('Wedding');
      setMessage('');
      setShowForm(false);
    } catch (err) {
      console.error(err);
      setStatus('Failed to submit feedback. Please try again later.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Section
      id="feedback"
      title="Feedback"
      subtitle="Share your experience or leave a quick testimonial"
      background="dark"
    >
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-8"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        {testimonials.map((testimonial) => (
          <motion.div key={testimonial.id} variants={itemVariants}>
            <Card variant="glass" className="h-full flex flex-col">
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} size={16} className="text-gold" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-text-primary mb-6 leading-relaxed flex-grow italic">
                &quot;{testimonial.quote}&quot;
              </p>

              {/* Author */}
              <div className="flex items-center gap-4 pt-4 border-t border-accent/20">
                <Image
                  src={testimonial.image}
                  alt={testimonial.name}
                  width={48}
                  height={48}
                  loading="lazy"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold text-text-primary">{testimonial.name}</p>
                  <p className="text-xs text-accent">{testimonial.company}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}

        {/* Feedback card / CTA */}
        <motion.div key="give-feedback" variants={itemVariants}>
          <Card variant="glass" className="h-full flex flex-col p-6">
            <h3 className="text-xl font-semibold text-text-primary mb-2">Give Feedback</h3>
            <p className="text-sm text-accent mb-4">Tell us about your experience working with Chitrahaar Films.</p>
            <div className="mt-auto">
              <div className="flex gap-2">
                <button onClick={() => setShowForm(true)} className="btn btn-primary flex-1">Inline Form</button>
                <button onClick={() => setShowModal(true)} className="btn flex-1">Open Modal</button>
              </div>
            </div>

            {showForm ? (
              <form onSubmit={handleSubmit} className="flex flex-col gap-3 mt-4">
                <input
                  required
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input"
                />
                <input
                  required
                  placeholder="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input"
                />
                <select
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                  className="input"
                >
                  {[5, 4, 3, 2, 1].map((r) => (
                    <option key={r} value={r}>{`${r} star${r > 1 ? 's' : ''}`}</option>
                  ))}
                </select>
                <select value={eventType} onChange={(e) => setEventType(e.target.value)} className="input">
                  <option>Wedding</option>
                  <option>Artist</option>
                  <option>Corporate & Events</option>
                  <option>Food & Beverages</option>
                  <option>Short Films</option>
                  <option>Fashion</option>
                  <option>Other</option>
                </select>
                <textarea
                  required
                  placeholder="Your feedback"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="input h-28"
                />
                <div className="flex gap-2">
                  <button type="submit" disabled={submitting} className="btn btn-primary">
                    {submitting ? 'Sending...' : 'Submit'}
                  </button>
                  <button type="button" onClick={() => setShowForm(false)} className="btn">
                    Cancel
                  </button>
                </div>
                {status && <p className="text-sm mt-2">{status}</p>}
              </form>
            ) : null}
          </Card>
        </motion.div>
      </motion.div>

      {/* Modal form */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60" onClick={() => setShowModal(false)} />
          <div className="relative w-full max-w-lg p-6 bg-gray-900 rounded shadow-lg">
            <h3 className="text-xl font-semibold mb-2">Give Feedback</h3>
            <form onSubmit={async (e) => { e.preventDefault(); await handleSubmit(e); setShowModal(false); }} className="flex flex-col gap-3">
              <input required placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} className="input" />
              <input required placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input" />
              <select value={rating} onChange={(e) => setRating(e.target.value)} className="input">
                {[5, 4, 3, 2, 1].map((r) => (
                  <option key={r} value={r}>{`${r} star${r > 1 ? 's' : ''}`}</option>
                ))}
              </select>
              <select value={eventType} onChange={(e) => setEventType(e.target.value)} className="input">
                <option>Wedding</option>
                <option>Artist</option>
                <option>Corporate & Events</option>
                <option>Food & Beverages</option>
                <option>Short Films</option>
                <option>Fashion</option>
                <option>Other</option>
              </select>
              <textarea required placeholder="Your feedback" value={message} onChange={(e) => setMessage(e.target.value)} className="input h-28" />
              <div className="flex gap-2">
                <button type="submit" disabled={submitting} className="btn btn-primary">{submitting ? 'Sending...' : 'Submit'}</button>
                <button type="button" onClick={() => setShowModal(false)} className="btn">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Success modal */}
      {status && status.includes('Thank you') && (
        <div className="fixed inset-0 z-40 flex items-center justify-center pointer-events-none">
          <div className="bg-green-700 text-white px-6 py-4 rounded-md shadow-lg">{status}</div>
        </div>
      )}
    </Section>
  );
};

export default Testimonials;

