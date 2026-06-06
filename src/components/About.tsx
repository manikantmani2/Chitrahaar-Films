import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { TEAM_MEMBERS } from '@/constants';
import { containerVariants, itemVariants, slideLeftVariants, slideRightVariants } from '@/utils/animations';
import Section from './Section';
import Card from './Card';
import { FaInstagram, FaLinkedin } from 'react-icons/fa';

const About: React.FC = () => {
  return (
    <Section id="about" title="About Us" subtitle="The creative minds behind Chitrahaar Films">
      {/* Company Story */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={slideLeftVariants}
          custom={0}
        >
          <h3 className="text-heading-1 font-bold mb-6">Crafting Cinematic Excellence Since 2009</h3>
          <div className="space-y-4 text-text-secondary leading-relaxed">
            <p>
              Chitrahaar Films is a pioneering production house dedicated to creating exceptional visual content
              that resonates with audiences worldwide. With over 15 years of industry experience, we&apos;ve established
              ourselves as leaders in cinematic storytelling.
            </p>
            <p>
              Our multidisciplinary team combines technical expertise with creative vision to transform ideas into
              compelling narratives. From corporate productions to documentary films, we approach every project with
              the same level of dedication and artistry.
            </p>
            <p>
              We believe in the power of authentic storytelling and cutting-edge production techniques to create
              content that inspires, engages, and creates lasting impact.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-3 gap-6">
            {[
              { number: '15+', label: 'Years Experience' },
              { number: '200+', label: 'Happy Clients' },
              { number: '150+', label: 'Projects' },
            ].map((item) => (
              <div key={item.label}>
                <p className="text-heading-2 font-bold gradient-text">{item.number}</p>
                <p className="text-sm text-text-secondary">{item.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="relative"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={slideRightVariants}
          custom={0.2}
        >
          <div className="rounded-xl overflow-hidden border border-border glow-effect group">
            <Image
              src="/company-image.jpg"
              alt="Chitrahaar Films Team"
              width={1200}
              height={800}
              loading="lazy"
              className="w-full h-auto group-hover:scale-110 transition-transform duration-500"
            />
          </div>
          <div className="absolute -bottom-4 -right-4 w-32 h-32 border border-accent rounded-xl opacity-20"></div>
        </motion.div>
      </div>

      {/* Team */}
      <div className="mb-20">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h3 className="text-heading-1 font-bold gradient-text mb-4">Our Creative Team</h3>
          <p className="text-text-secondary max-w-2xl mx-auto">
            Meet the talented individuals who bring creativity and expertise to every project
          </p>
        </motion.div>

        <motion.div
          className="flex gap-4 md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-6 overflow-x-auto scrollbar-hide snap-carousel py-4 px-4 md:px-0"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          {TEAM_MEMBERS.map((member, index) => (
            <motion.div key={member.id} variants={itemVariants} custom={index * 0.1} className="snap-item min-w-[80%] sm:min-w-[60%] md:min-w-0">
              <Card variant="glass" className="text-center group">
                <div className="relative mb-4 overflow-hidden rounded-lg bg-black/20 aspect-[4/5]">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw"
                    className="object-cover object-center group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <h4 className="text-heading-2 font-bold mb-1">{member.name}</h4>
                <p className="text-accent text-sm font-semibold mb-2">{member.role}</p>
                <p className="text-text-secondary text-sm mb-4">{member.bio}</p>

                <div className="flex justify-center gap-3 pt-4 border-t border-accent/20">
                  <motion.a
                    href={member.social.instagram}
                    className="text-text-secondary hover:text-accent transition-colors duration-300"
                    whileHover={{ scale: 1.2 }}
                  >
                    <FaInstagram size={18} />
                  </motion.a>
                  <motion.a
                    href={member.social.linkedin}
                    className="text-text-secondary hover:text-accent transition-colors duration-300"
                    whileHover={{ scale: 1.2 }}
                  >
                    <FaLinkedin size={18} />
                  </motion.a>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Values */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-8 p-8 rounded-xl bg-gradient-to-r from-accent/5 via-gold/5 to-accent/5 border border-border"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        {[
          {
            title: 'Quality',
            description: 'We maintain the highest standards in every aspect of production',
          },
          {
            title: 'Innovation',
            description: 'Constantly exploring new techniques and technologies',
          },
          {
            title: 'Collaboration',
            description: 'Working closely with clients to bring their vision to life',
          },
        ].map((value, i) => (
          <motion.div key={value.title} variants={itemVariants} custom={i * 0.1}>
            <h4 className="text-heading-2 font-bold gradient-text mb-2">{value.title}</h4>
            <p className="text-text-secondary">{value.description}</p>
          </motion.div>
        ))}
      </motion.div>
    </Section>
  );
};

export default About;

