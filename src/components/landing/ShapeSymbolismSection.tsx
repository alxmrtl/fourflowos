'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

const shapes = [
  {
    name: 'Self',
    shape: 'Frequencies',
    image: '/assets/LOGOS/MAIN LOGO - ELEMENTS/SELF - Frequencies.png',
    symbolism: 'Energy that pulses through you.',
    description: 'The wave of vitality—always moving, never static.',
    color: '#FF6F61',
  },
  {
    name: 'Space',
    shape: 'Square',
    image: '/assets/LOGOS/MAIN LOGO - ELEMENTS/SPACE - Sqaure.png',
    symbolism: 'Structure that grounds you.',
    description: 'Four corners, stable foundation—order from chaos.',
    color: '#6BA292',
  },
  {
    name: 'Story',
    shape: 'Cross',
    image: '/assets/LOGOS/MAIN LOGO - ELEMENTS/STORY - Cross.png',
    symbolism: 'The present moment.',
    description: 'Where your timeline intersects with now—the only point you can act.',
    color: '#5B84B1',
  },
  {
    name: 'Spirit',
    shape: 'Circle',
    image: '/assets/LOGOS/MAIN LOGO - ELEMENTS/SPIRIT - Circle.png',
    symbolism: 'Infinite potential.',
    description: 'The most efficient shape in nature—completeness without edges.',
    color: '#7A4DA4',
  },
];

export default function ShapeSymbolismSection() {
  return (
    <section className="relative py-20 md:py-28 bg-[#050505] overflow-hidden">
      {/* Background circle decoration */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div
          className="w-[800px] h-[800px] rounded-full opacity-[0.03]"
          style={{
            border: '1px solid white',
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 120, repeat: Infinity, ease: 'linear' }}
        />
      </div>

      <div className="relative max-w-6xl mx-auto px-6">
        {/* Section header */}
        <motion.div
          className="text-center mb-16 md:mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            The Four Shapes
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            Each dimension has a symbol. Each symbol carries meaning.
          </p>
        </motion.div>

        {/* Shapes grid */}
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {shapes.map((shape, index) => (
            <motion.div
              key={shape.name}
              className="relative group"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className="flex items-start gap-6">
                {/* Shape image */}
                <motion.div
                  className="relative flex-shrink-0 w-24 h-24 md:w-32 md:h-32"
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  animate={{
                    scale: [1, 1.02, 1],
                  }}
                  transition={{
                    scale: {
                      duration: 4 + index,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    },
                  }}
                >
                  {/* Glow behind shape */}
                  <div
                    className="absolute inset-0 rounded-full blur-2xl opacity-30 group-hover:opacity-50 transition-opacity"
                    style={{ background: shape.color }}
                  />
                  <Image
                    src={shape.image}
                    alt={shape.shape}
                    fill
                    className="object-contain relative z-10"
                  />
                </motion.div>

                {/* Text content */}
                <div className="flex-1 pt-2">
                  {/* Dimension name */}
                  <div className="flex items-center gap-3 mb-2">
                    <h3
                      className="text-xl md:text-2xl font-bold"
                      style={{ color: shape.color }}
                    >
                      {shape.name}
                    </h3>
                    <span className="text-sm text-gray-600 font-medium uppercase tracking-wider">
                      {shape.shape}
                    </span>
                  </div>

                  {/* Symbolism */}
                  <p className="text-lg md:text-xl text-white font-medium mb-2">
                    {shape.symbolism}
                  </p>

                  {/* Description */}
                  <p className="text-gray-400 leading-relaxed">
                    {shape.description}
                  </p>
                </div>
              </div>

              {/* Decorative border on hover */}
              <motion.div
                className="absolute -inset-4 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                style={{
                  border: `1px solid ${shape.color}20`,
                  background: `radial-gradient(circle at center, ${shape.color}05, transparent 70%)`,
                }}
              />
            </motion.div>
          ))}
        </div>

        {/* Combined logo hint */}
        <motion.p
          className="text-center text-gray-500 mt-16 text-sm"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          Together, they form the FourFlow symbol—four forces in harmony.
        </motion.p>
      </div>
    </section>
  );
}
