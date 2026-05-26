import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { validateForm } from '@/utils/helpers';
import { apiMethods } from '@/api/client';
import { containerVariants, itemVariants } from '@/utils/animations';
import Section from './Section';
import Button from './Button';
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import { CONTACT_INFO } from '@/constants';

interface FormData {
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
}

const Contact: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    service: 'Corporate Video',
    message: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { isValid, errors: validationErrors } = validateForm(formData);
    if (!isValid) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      await apiMethods.submitContact(formData);
      setSubmitted(true);
      setFormData({ name: '', email: '', phone: '', service: 'Corporate Video', message: '' });
      setTimeout(() => setSubmitted(false), 5000);
    } catch (error) {
      setErrors({ submit: 'Failed to send message. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Section
      id="contact"
      title="Get in Touch"
      subtitle="Let's discuss your next project"
      background="gradient"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Info */}
        <motion.div
          className="space-y-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          {[
            { icon: FaPhone, label: 'Phone', value: CONTACT_INFO.phone, href: `tel:${CONTACT_INFO.phone}` },
            { icon: FaEnvelope, label: 'Email', value: CONTACT_INFO.email, href: `mailto:${CONTACT_INFO.email}` },
            { icon: FaMapMarkerAlt, label: 'Address', value: CONTACT_INFO.address, href: '#' },
          ].map((item, i) => (
            <motion.a
              key={item.label}
              href={item.href}
              className="flex items-start gap-4 group"
              variants={itemVariants}
              custom={i * 0.1}
            >
              <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-accent to-gold flex items-center justify-center text-primary flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                <item.icon size={20} />
              </div>
              <div>
                <p className="text-sm text-text-secondary mb-1">{item.label}</p>
                <p className="text-lg font-semibold text-text-primary group-hover:text-accent transition-colors duration-300">
                  {item.value}
                </p>
              </div>
            </motion.a>
          ))}

          {/* Hours */}
          <motion.div
            className="p-4 rounded-lg border border-border bg-secondary/50"
            variants={itemVariants}
            custom={0.3}
          >
            <p className="text-sm text-text-secondary mb-2">Business Hours</p>
            <p className="font-semibold text-text-primary">{CONTACT_INFO.hours}</p>
          </motion.div>
        </motion.div>

        {/* Contact Form */}
        <motion.form
          onSubmit={handleSubmit}
          className="lg:col-span-2 space-y-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          {submitted && (
            <motion.div
              className="p-4 rounded-lg bg-accent/10 border border-accent text-accent"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              ✓ Message sent successfully! We&apos;ll get back to you soon.
            </motion.div>
          )}

          <motion.div variants={itemVariants}>
            <label className="block text-sm font-semibold mb-2">Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-lg bg-[rgba(255,255,255,0.02)] border ${
                errors.name ? 'border-red-500' : 'border-[rgba(255,255,255,0.04)]'
              } text-text-primary placeholder-text-secondary/50 focus:outline-none focus:border-[rgba(212,175,55,0.8)] transition-colors duration-300`}
              placeholder="Your name"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </motion.div>

          <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-6" variants={itemVariants}>
            <div>
              <label className="block text-sm font-semibold mb-2">Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg bg-secondary border ${
                  errors.email ? 'border-red-500' : 'border-border'
                } text-text-primary placeholder-text-secondary/50 focus:outline-none focus:border-accent transition-colors duration-300`}
                placeholder="your@email.com"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Phone *</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg bg-secondary border ${
                  errors.phone ? 'border-red-500' : 'border-border'
                } text-text-primary placeholder-text-secondary/50 focus:outline-none focus:border-accent transition-colors duration-300`}
                placeholder="+91 98765 43210"
              />
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <label className="block text-sm font-semibold mb-2">Service</label>
              <select
              name="service"
              value={formData.service}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-secondary border border-border text-text-primary focus:outline-none focus:border-accent transition-colors duration-300"
            >
              <option>Corporate Video</option>
              <option>Documentary</option>
              <option>Photography</option>
              <option>Motion Graphics</option>
              <option>Other</option>
            </select>
          </motion.div>

          <motion.div variants={itemVariants}>
            <label className="block text-sm font-semibold mb-2">Message *</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={5}
              className={`w-full px-4 py-3 rounded-lg bg-secondary border ${
                errors.message ? 'border-red-500' : 'border-border'
              } text-text-primary placeholder-text-secondary/50 focus:outline-none focus:border-accent transition-colors duration-300 resize-none`}
              placeholder="Tell us about your project..."
            />
            {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
          </motion.div>

          <motion.div variants={itemVariants}>
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              loading={loading}
            >
              {loading ? 'Sending...' : 'Send Message'}
            </Button>
          </motion.div>
        </motion.form>
      
      {/* WhatsApp Floating Button */}
      <a
        href={`https://wa.me/${CONTACT_INFO.phone.replace(/[\s+\-()]/g, '')}`}
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-fab"
        aria-label="Chat on WhatsApp"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20.52 3.48C18.14 1.1 15 0 12 0 5.37 0 0 5.37 0 12c0 2.12.56 4.18 1.62 6.02L0 24l6.3-1.6c1.69.91 3.6 1.38 5.5 1.38 6.63 0 12-5.37 12-12 0-3-1.1-6.14-3.28-8.4z" fill="#000" opacity="0.05"/>
          <path d="M12 2.4c2.34 0 4.47.9 6.06 2.52 1.59 1.62 2.46 3.78 2.46 6.06 0 1.62-.45 3.18-1.32 4.56l-.06.12-1.44 3.06-3.12-.78c-1.26.6-2.64.9-4.02.9-6.06 0-11-4.94-11-11S5.94 2.4 12 2.4z" fill="#000" opacity="0.05"/>
          <path d="M17.16 14.88c-.36-.18-2.16-1.08-2.5-1.2-.36-.12-.62-.18-.88.18-.24.36-.86 1.2-1.06 1.44-.18.24-.36.27-.72.09-.36-.18-1.5-.56-2.86-1.76-1.06-.94-1.78-2.1-1.98-2.46-.18-.36-.02-.56.16-.74.16-.16.36-.42.54-.63.18-.21.24-.36.36-.6.12-.24.06-.45-.03-.63-.06-.18-.88-2.12-1.2-2.9-.32-.78-.64-.66-.88-.66l-.74.01c-.24 0-.63.09-.96.45-.33.36-1.26 1.24-1.26 3.02 0 1.78 1.29 3.5 1.47 3.74.18.24 2.54 3.88 6.16 5.44 3.62 1.58 3.62.96 4.28.9.66-.06 2.16-.88 2.46-1.72.3-.84.3-1.56.21-1.72-.09-.18-.33-.27-.72-.45z" fill="#000" opacity="0.12"/>
        </svg>
      </a>
      </div>
    </Section>
  );
};

export default Contact;
