import React from 'react';
import { motion } from 'framer-motion';
import { PRICING } from '@/constants';
import { containerVariants, itemVariants } from '@/utils/animations';
import Section from './Section';
import Card from './Card';
const Pricing: React.FC = () => {
  const pricingPlans = [
    {
      category: 'Photography',
      data: PRICING.photography,
      color: 'from-accent to-orange-500',
    },
    {
      category: 'Videography',
      data: PRICING.videography,
      color: 'from-gold to-amber-500',
    },
    {
      category: 'Wedding Packages',
      data: PRICING.wedding_package,
      color: 'from-pink-500 to-red-500',
    },
    {
      category: 'Food Photography',
      data: PRICING.food_photography,
      color: 'from-amber-500 to-yellow-500',
    },
  ];

  return (
    <Section
      id="pricing"
      title="Our Pricing"
      subtitle="Transparent, competitive rates (GST Excluded)"
      background="dark"
    >
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        {pricingPlans.map((plan, index) => (
          <motion.div key={plan.category} variants={itemVariants} custom={index * 0.1}>
            <Card variant="hover" className={`h-full flex flex-col`}>
              {/* Header */}
              <div className={`bg-gradient-to-r ${plan.color} p-4 rounded-lg mb-6 text-white`}>
                <h3 className="text-heading-2 font-bold">{plan.category}</h3>
              </div>

              {/* Pricing Items */}
              <div className="space-y-4 flex-grow">
                {Object.entries(plan.data).map(([key, value]: [string, any]) => {
                  if (key === 'gst_note') return null;

                  return (
                    <div key={key} className="pb-4 border-b border-border">
                      <p className="text-text-secondary text-sm mb-1">
                        {typeof value === 'object' && value.duration
                          ? value.duration
                          : typeof value === 'object' && value.description
                          ? value.description
                          : key.replace(/_/g, ' ').toUpperCase()}
                      </p>
                      <p className="text-heading-2 font-bold gradient-text">
                        ₹{value.amount?.toLocaleString() || value}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* GST Note */}
              <div className="mt-6 pt-4 border-t border-accent/20 bg-accent/5 p-3 rounded-lg">
                <p className="text-xs text-text-secondary italic">
                  📌 {plan.data.gst_note}
                </p>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Pricing Table */}
      <motion.div
        className="mt-16 p-8 rounded-xl border border-border bg-secondary/50"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
      >
        <h3 className="text-heading-2 font-bold mb-6 gradient-text">
          Complete Pricing Breakdown (GST Excluded)
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-3 text-text-secondary">Service</th>
                <th className="text-center p-3 text-text-secondary">Hourly</th>
                <th className="text-center p-3 text-text-secondary">Half Day (4 hrs)</th>
                <th className="text-center p-3 text-text-secondary">Full Day (8 hrs)</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border hover:bg-secondary/50 transition-colors">
                <td className="p-3 text-text-primary font-semibold">Photography</td>
                <td className="text-center p-3 text-accent">₹5,000</td>
                <td className="text-center p-3 text-accent">₹15,000</td>
                <td className="text-center p-3 text-accent">₹25,000</td>
              </tr>
              <tr className="border-b border-border hover:bg-secondary/50 transition-colors">
                <td className="p-3 text-text-primary font-semibold">Videography</td>
                <td className="text-center p-3 text-accent">₹8,000</td>
                <td className="text-center p-3 text-accent">₹24,000</td>
                <td className="text-center p-3 text-accent">₹40,000</td>
              </tr>
              <tr className="border-b border-border hover:bg-secondary/50 transition-colors">
                <td className="p-3 text-text-primary font-semibold">Food Photography</td>
                <td className="text-center p-3 text-accent">₹4,000</td>
                <td className="text-center p-3 text-accent">-</td>
                <td className="text-center p-3 text-accent">₹20,000</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-6 p-4 bg-accent/10 border border-accent rounded-lg">
          <p className="text-sm text-text-secondary">
            ⚠️ <span className="font-semibold text-accent">Important:</span> All prices listed above are{' '}
            <span className="font-bold">GST EXCLUDED</span>. 18% GST will be added to the final invoice.
            Special packages and custom requirements available on request.
          </p>
        </div>
      </motion.div>
    </Section>
  );
};

export default Pricing;
