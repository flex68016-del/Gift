"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useTranslations } from "next-intl";

export function ScrollStory() {
  const t = useTranslations("landing");
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.4, 0.6, 0.8], [0, 1, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2, 0.4, 0.6, 0.8], [0.8, 1, 1, 1, 0.8]);

  return (
    <section id="how-section" className="py-20 px-6">
      <motion.div style={{ opacity, scale }} className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-12 text-center" style={{ color: "var(--color-ink)" }}>
          {t("how.title")}
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <motion.div
            className="text-center p-6 rounded-lg"
            style={{ backgroundColor: "var(--color-surface)" }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <div className="text-4xl font-bold mb-4" style={{ color: "var(--color-red)" }}>
              1
            </div>
            <h3 className="text-xl font-bold mb-3" style={{ color: "var(--color-ink)" }}>
              {t("how.step1.title")}
            </h3>
            <p style={{ color: "var(--color-ink-soft)" }}>{t("how.step1.text")}</p>
          </motion.div>

          {/* Step 2 */}
          <motion.div
            className="text-center p-6 rounded-lg"
            style={{ backgroundColor: "var(--color-surface)" }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <div className="text-4xl font-bold mb-4" style={{ color: "var(--color-red)" }}>
              2
            </div>
            <h3 className="text-xl font-bold mb-3" style={{ color: "var(--color-ink)" }}>
              {t("how.step2.title")}
            </h3>
            <p style={{ color: "var(--color-ink-soft)" }}>{t("how.step2.text")}</p>
          </motion.div>

          {/* Step 3 */}
          <motion.div
            className="text-center p-6 rounded-lg"
            style={{ backgroundColor: "var(--color-surface)" }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <div className="text-4xl font-bold mb-4" style={{ color: "var(--color-red)" }}>
              3
            </div>
            <h3 className="text-xl font-bold mb-3" style={{ color: "var(--color-ink)" }}>
              {t("how.step3.title")}
            </h3>
            <p style={{ color: "var(--color-ink-soft)" }}>{t("how.step3.text")}</p>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
