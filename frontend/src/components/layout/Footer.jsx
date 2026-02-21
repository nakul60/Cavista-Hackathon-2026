import { motion } from "framer-motion";
import { Heart, Mail, Linkedin, Github, Twitter } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: Github, href: "#", label: "GitHub" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Mail, href: "mailto:contact@medscript.com", label: "Email" },
  ];

  const footerLinks = [
    { label: "About", href: "#" },
    { label: "Privacy", href: "#" },
    { label: "Terms", href: "#" },
    { label: "Contact", href: "#" },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <motion.footer
      className="bg-[var(--bg-subtle)] border-t border-[var(--border)] mt-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-6 py-12">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Brand */}
          <motion.div variants={itemVariants} className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[var(--green-deep)] rounded-full flex items-center justify-center">
                <Heart className="text-white w-6 h-6" />
              </div>
              <span className="text-2xl font-bold text-[var(--green-deep)]" style={{ fontFamily: "var(--font-heading)" }}>
                MedScript
              </span>
            </div>
            <p className="text-[var(--text-slate)] text-sm">
              Smart EMR & Diagnostic Assistant powered by AI for better
              healthcare.
            </p>
          </motion.div>

          {/* Links */}
          <motion.div variants={itemVariants} className="flex flex-col gap-4">
            <h3 className="text-lg font-bold text-[var(--text-ink)]">Quick Links</h3>
            <div className="flex flex-col gap-2">
              {footerLinks.map((link) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  className="text-[var(--text-slate)] hover:text-[var(--green)] transition-colors text-sm"
                  whileHover={{ x: 5 }}
                >
                  {link.label}
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Social */}
          <motion.div variants={itemVariants} className="flex flex-col gap-4">
            <h3 className="text-lg font-bold text-[var(--text-ink)]">Follow Us</h3>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-[var(--bg-card)] hover:bg-[var(--green-mid)] rounded-lg flex items-center justify-center text-[var(--text-slate)] hover:text-white transition-all duration-300"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                  title={social.label}
                >
                  <social.icon size={20} />
                </motion.a>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Divider */}
  <motion.div className="h-px bg-gradient-to-r from-transparent via-[var(--border)] to-transparent my-8" />

        {/* Copyright */}
        <motion.div
          className="flex flex-col md:flex-row items-center justify-between gap-4 text-[var(--text-slate)] text-sm"
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <p>© {currentYear} medScript. All rights reserved.</p>
          <p className="flex items-center gap-2">
            Built with <Heart className="w-4 h-4 text-alert-red" /> for better
            healthcare
          </p>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer;
