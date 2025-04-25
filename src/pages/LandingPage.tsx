import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, FileText, Clock, Shield, Globe, Zap, Users,
  ArrowDownToLine, Cog, Database, FileCheck, Layers
} from "lucide-react";

const AnimatedBackground = () => {
  const shapes = [
    { type: "square", color: "#4ADE80", size: "70px", left: "5%", top: "15%", delay: 0, rotate: 12 },
    { type: "circle", color: "#60A5FA", size: "55px", left: "15%", top: "65%", delay: 2, rotate: 0 },
    { type: "square", color: "#F472B6", size: "65px", left: "85%", top: "10%", delay: 1, rotate: -15 },
    { type: "circle", color: "#FBBF24", size: "60px", left: "75%", top: "70%", delay: 3, rotate: 0 },
    { type: "square", color: "#818CF8", size: "50px", left: "45%", top: "5%", delay: 2.5, rotate: 20 },
    { type: "circle", color: "#34D399", size: "75px", left: "92%", top: "45%", delay: 1.5, rotate: 0 },
    { type: "square", color: "#A78BFA", size: "45px", left: "8%", top: "85%", delay: 0.5, rotate: -10 },
    { type: "circle", color: "#F87171", size: "50px", left: "60%", top: "90%", delay: 2.8, rotate: 0 },
    { type: "square", color: "#38BDF8", size: "40px", left: "25%", top: "30%", delay: 4, rotate: 15 },
    { type: "circle", color: "#FB923C", size: "65px", left: "70%", top: "40%", delay: 3.5, rotate: 0 },
  ];

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {shapes.map((shape, index) => (
        <motion.div
          key={index}
          className={`absolute ${shape.type === 'circle' ? 'rounded-full' : 'rounded-xl'} opacity-5 backdrop-blur-3xl`}
          style={{
            width: shape.size,
            height: shape.size,
            left: shape.left,
            top: shape.top,
            backgroundColor: shape.color,
            rotate: `${shape.rotate}deg`,
          }}
          animate={{
            rotate: shape.type === 'circle' ? [0, 360] : [`${shape.rotate}deg`, `${shape.rotate + 360}deg`],
            y: ["0%", "15%", "0%"],
            x: ["0%", "10%", "0%"],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 25 + shape.delay,
            repeat: Infinity,
            ease: "easeInOut",
            times: [0, 0.5, 1],
            delay: shape.delay,
          }}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-950/90 via-blue-900/90 to-blue-950/90 backdrop-blur-sm" />
    </div>
  );
};

const GlassMorphCard = ({ children, className = "" }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`relative overflow-hidden rounded-3xl border border-white/10 backdrop-blur-xl ${className}`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/10 pointer-events-none" />
      <div className="absolute -inset-1 bg-gradient-to-br from-blue-500/10 via-transparent to-purple-500/10 rounded-3xl blur-xl opacity-50 group-hover:opacity-100 transition duration-300" />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
};

const LandingPage = () => {
  const { isAuthenticated } = useAuth();

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  const stagger = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  // Animation for flow diagram
  const flowAnimation = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.5 }
    }
  };

  const arrowAnimation = {
    hidden: { width: 0 },
    visible: { 
      width: "100%",
      transition: { duration: 0.8, delay: 0.3 }
    }
  };

  const iconAnimation = {
    hidden: { scale: 0, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: { type: "spring", stiffness: 260, damping: 20 }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-950 via-blue-900 to-blue-950 relative">
      <AnimatedBackground />
      
      <div className="relative z-10">
        <nav className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-white/10 p-2 rounded-xl backdrop-blur-xl border border-white/10">
                <Shield className="h-8 w-8 text-blue-300" />
              </div>
              <div className="text-2xl font-bold text-white">PatentFlow</div>
            </div>
            <div className="flex items-center space-x-4">
              {!isAuthenticated ? (
                <>
                  <Link to="/signin">
                    <Button variant="ghost" className="text-white hover:bg-white/10 hover:text-blue-200 backdrop-blur-sm">
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/signup">
                    <Button className="bg-blue-500/90 hover:bg-blue-400/90 text-white shadow-lg shadow-blue-500/20 backdrop-blur-sm border border-white/10">
                      Get Started
                    </Button>
                  </Link>
                </>
              ) : (
                <Link to="/dashboard">
                  <Button className="bg-blue-500/90 hover:bg-blue-400/90 text-white shadow-lg shadow-blue-500/20 backdrop-blur-sm border border-white/10">
                    Go to Dashboard
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </nav>

        <main className="container mx-auto px-6">
          <motion.div 
            initial="initial"
            animate="animate"
            variants={stagger}
            className="py-20"
          >
            <motion.div 
              variants={fadeIn}
              className="flex flex-col items-center text-center max-w-4xl mx-auto"
            >
              <GlassMorphCard className="p-12">
                <h1 className="text-6xl font-bold text-white mb-6 leading-tight">
                  Simplify Your{" "}
                  <span className="bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">
                    Trademark Management
                  </span>
                </h1>
                <p className="text-xl text-blue-100 mb-8 max-w-2xl">
                  Streamline your trademark filing process with our intelligent platform. 
                  From application to registration, we make IP protection effortless.
                </p>
                {!isAuthenticated && (
                  <div className="flex gap-4 justify-center">
                    <Link to="/signup">
                      <Button 
                        size="lg" 
                        className="bg-blue-500/90 hover:bg-blue-400/90 text-white text-lg px-8 shadow-lg shadow-blue-500/20 transform hover:scale-105 transition-transform border border-white/10"
                      >
                        Start Free Trial
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </Link>
                    <Link to="/about">
                      <Button 
                        size="lg" 
                        variant="outline" 
                        className="text-white border-white/20 hover:bg-white/10 text-lg px-8 backdrop-blur-sm"
                      >
                        Learn More
                      </Button>
                    </Link>
                  </div>
                )}
              </GlassMorphCard>
            </motion.div>

            <motion.div 
              variants={fadeIn}
              className="mt-20 relative p-12"
            >
              <GlassMorphCard className="p-12">
                <div className="text-center mb-16">
                  <h2 className="text-4xl font-bold text-white mb-4">
                    How It <span className="text-blue-400">Works</span>
                  </h2>
                  <p className="text-xl text-blue-200 max-w-2xl mx-auto">
                    Seamless document generation powered by advanced technology
                  </p>
                </div>

                <div className="relative z-10">
                  <div className="max-w-6xl mx-auto">
                    {/* Connecting Lines SVG */}
                    <div className="absolute inset-0 pointer-events-none">
                      <svg className="w-full h-full">
                        {/* Line from Documents to Processing */}
                        <motion.path
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{
                            duration: 1.5,
                            delay: 1,
                            ease: "easeInOut"
                          }}
                          d="M 35% 25% Q 50% 35%, 50% 45%"
                          stroke="url(#gradientBlue)"
                          strokeWidth="2"
                          fill="none"
                          strokeDasharray="5,5"
                        />
                        {/* Line from Custom App to Processing */}
                        <motion.path
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{
                            duration: 1.5,
                            delay: 1.2,
                            ease: "easeInOut"
                          }}
                          d="M 65% 25% Q 50% 35%, 50% 45%"
                          stroke="url(#gradientBlue)"
                          strokeWidth="2"
                          fill="none"
                          strokeDasharray="5,5"
                        />
                        {/* Line from Processing to Output */}
                        <motion.path
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{
                            duration: 1.5,
                            delay: 2,
                            ease: "easeInOut"
                          }}
                          d="M 50% 55% L 50% 75%"
                          stroke="url(#gradientBlue)"
                          strokeWidth="2"
                          fill="none"
                          strokeDasharray="5,5"
                        />
                        {/* Gradient Definitions */}
                        <defs>
                          <linearGradient id="gradientBlue" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#60A5FA" />
                            <stop offset="100%" stopColor="#3B82F6" />
                          </linearGradient>
                        </defs>
                        {/* Animated Particles */}
                        <motion.circle
                          initial={{ offsetDistance: "0%" }}
                          animate={{ offsetDistance: "100%" }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "linear"
                          }}
                          r="4"
                          fill="#60A5FA"
                        >
                          <animateMotion
                            dur="2s"
                            repeatCount="indefinite"
                            path="M 35% 25% Q 50% 35%, 50% 45%"
                          />
                        </motion.circle>
                        <motion.circle
                          initial={{ offsetDistance: "0%" }}
                          animate={{ offsetDistance: "100%" }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "linear",
                            delay: 0.5
                          }}
                          r="4"
                          fill="#60A5FA"
                        >
                          <animateMotion
                            dur="2s"
                            repeatCount="indefinite"
                            path="M 65% 25% Q 50% 35%, 50% 45%"
                          />
                        </motion.circle>
                        <motion.circle
                          initial={{ offsetDistance: "0%" }}
                          animate={{ offsetDistance: "100%" }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "linear",
                            delay: 1
                          }}
                          r="4"
                          fill="#60A5FA"
                        >
                          <animateMotion
                            dur="2s"
                            repeatCount="indefinite"
                            path="M 50% 55% L 50% 75%"
                          />
                        </motion.circle>
                      </svg>
                    </div>

                    {/* Layer 1: Input Sources */}
                    <motion.div
                      initial="hidden"
                      animate="visible"
                      variants={{
                        hidden: { opacity: 0 },
                        visible: {
                          opacity: 1,
                          transition: {
                            staggerChildren: 0.3,
                            delayChildren: 0.2
                          }
                        }
                      }}
                      className="flex justify-center gap-32 mb-20"
                    >
                      <motion.div
                        variants={{
                          hidden: { opacity: 0, y: 50, scale: 0.8 },
                          visible: { 
                            opacity: 1, 
                            y: 0, 
                            scale: 1,
                            transition: {
                              type: "spring",
                              stiffness: 200,
                              damping: 20
                            }
                          }
                        }}
                        whileHover={{ scale: 1.05 }}
                        className="flex flex-col items-center"
                      >
                        <div className="w-24 h-24 bg-white rounded-2xl shadow-lg flex items-center justify-center mb-3 relative overflow-hidden group">
                          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent" />
                          <img src="/document-icon.svg" alt="Document" className="w-16 h-16 relative z-10" />
                          <motion.div 
                            initial={{ opacity: 0 }}
                            whileHover={{ opacity: 1 }}
                            className="absolute inset-0 bg-blue-500/10 transition-opacity duration-300" 
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-600">Documents</span>
                      </motion.div>

                      <motion.div
                        variants={{
                          hidden: { opacity: 0, y: 50, scale: 0.8 },
                          visible: { 
                            opacity: 1, 
                            y: 0, 
                            scale: 1,
                            transition: {
                              type: "spring",
                              stiffness: 200,
                              damping: 20
                            }
                          }
                        }}
                        whileHover={{ scale: 1.05 }}
                        className="flex flex-col items-center"
                      >
                        <div className="w-24 h-24 bg-white rounded-2xl shadow-lg flex items-center justify-center mb-3 relative overflow-hidden group">
                          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent" />
                          <img src="/custom-app-icon.svg" alt="Custom App" className="w-16 h-16 relative z-10" />
                          <motion.div 
                            initial={{ opacity: 0 }}
                            whileHover={{ opacity: 1 }}
                            className="absolute inset-0 bg-blue-500/10 transition-opacity duration-300" 
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-600">Custom App</span>
                      </motion.div>
                    </motion.div>

                    {/* Layer 2: Processing */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ 
                        duration: 0.8, 
                        delay: 1.5,
                        type: "spring",
                        stiffness: 100,
                        damping: 20
                      }}
                      className="flex justify-center mb-20"
                    >
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="bg-white rounded-2xl shadow-lg p-8 w-96 relative overflow-hidden group"
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent" />
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                          className="absolute right-4 top-4"
                        >
                          <Cog className="w-8 h-8 text-blue-500/30" />
                        </motion.div>
                        <motion.div
                          animate={{ rotate: -360 }}
                          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                          className="absolute left-4 bottom-4"
                        >
                          <Cog className="w-6 h-6 text-blue-500/20" />
                        </motion.div>
                        <div className="flex items-center gap-4 relative z-10">
                          <div className="p-4 bg-blue-100 rounded-xl">
                            <Layers className="w-10 h-10 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="text-xl font-semibold mb-2">Smart Processing</h3>
                            <p className="text-gray-600">AI-powered document generation and validation</p>
                          </div>
                        </div>
                      </motion.div>
                    </motion.div>

                    {/* Layer 3: Output */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.6, delay: 2.8 }}
                      className="flex justify-center items-center"
                    >
                      <motion.div
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ 
                          duration: 0.8, 
                          delay: 3,
                          type: "spring",
                          stiffness: 100
                        }}
                        whileHover={{ scale: 1.05 }}
                        className="bg-white rounded-2xl shadow-lg p-6 relative overflow-hidden group w-96"
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent" />
                        <div className="flex items-center gap-4 relative z-10">
                          <div className="p-3 bg-blue-100 rounded-xl">
                            <FileCheck className="w-8 h-8 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold mb-1">Generated Documents</h3>
                            <p className="text-sm text-gray-600">Ready for use and compliant</p>
                          </div>
                        </div>
                        <motion.div
                          animate={{ 
                            boxShadow: [
                              "0 0 0 0 rgba(59, 130, 246, 0)",
                              "0 0 0 10px rgba(59, 130, 246, 0.1)",
                              "0 0 0 20px rgba(59, 130, 246, 0)"
                            ]
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                          className="absolute inset-0 rounded-2xl"
                        />
                      </motion.div>
                    </motion.div>
                  </div>
                </div>
              </GlassMorphCard>
            </motion.div>

            <motion.div 
              variants={fadeIn}
              className="mt-24 grid grid-cols-1 md:grid-cols-2 gap-16 items-center"
            >
              <GlassMorphCard className="p-8">
                <h2 className="text-4xl font-bold text-white mb-8">
                  Why Choose <span className="text-blue-400">PatentFlow</span>?
                </h2>
                <div className="space-y-8">
                  <div className="flex items-start gap-6">
                    <div className="p-3 bg-blue-500/20 rounded-xl backdrop-blur-xl border border-white/10">
                      <Zap className="h-8 w-8 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2 text-white">Fast Processing</h3>
                      <p className="text-blue-200">Generate trademark applications in minutes, not hours.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-6">
                    <div className="p-3 bg-blue-500/20 rounded-xl backdrop-blur-xl border border-white/10">
                      <Shield className="h-8 w-8 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2 text-white">Secure Platform</h3>
                      <p className="text-blue-200">Your intellectual property is protected with enterprise-grade security.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-6">
                    <div className="p-3 bg-blue-500/20 rounded-xl backdrop-blur-xl border border-white/10">
                      <Users className="h-8 w-8 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2 text-white">Expert Support</h3>
                      <p className="text-blue-200">Get assistance from our team of IP professionals whenever you need it.</p>
                    </div>
                  </div>
                </div>
              </GlassMorphCard>

              <GlassMorphCard className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 p-10">
                <div className="relative z-10">
                  <h3 className="text-3xl font-bold mb-6 text-white">Ready to get started?</h3>
                  <p className="mb-8 text-blue-200 text-lg">Join thousands of businesses protecting their intellectual property with PatentFlow.</p>
                  {!isAuthenticated && (
                    <Link to="/signup">
                      <Button 
                        size="lg" 
                        className="w-full bg-blue-500/90 hover:bg-blue-400/90 text-white shadow-lg shadow-blue-500/20 transform hover:scale-105 transition-transform border border-white/10"
                      >
                        Start Your Free Trial
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </Link>
                  )}
                </div>
              </GlassMorphCard>
            </motion.div>
          </motion.div>
        </main>

        <footer className="border-t border-white/10 py-12 mt-24 backdrop-blur-xl">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-white/10 p-2 rounded-xl backdrop-blur-xl border border-white/10">
                    <Shield className="h-6 w-6 text-blue-400" />
                  </div>
                  <div className="text-xl font-bold text-white">PatentFlow</div>
                </div>
                <p className="text-blue-200">
                  Making trademark protection accessible and efficient for everyone.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-4 text-white text-lg">Product</h4>
                <ul className="space-y-3 text-blue-200">
                  <li className="hover:text-blue-400 cursor-pointer transition-colors">Features</li>
                  <li className="hover:text-blue-400 cursor-pointer transition-colors">Pricing</li>
                  <li className="hover:text-blue-400 cursor-pointer transition-colors">Use Cases</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4 text-white text-lg">Company</h4>
                <ul className="space-y-3 text-blue-200">
                  <li className="hover:text-blue-400 cursor-pointer transition-colors">About</li>
                  <li className="hover:text-blue-400 cursor-pointer transition-colors">Blog</li>
                  <li className="hover:text-blue-400 cursor-pointer transition-colors">Careers</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4 text-white text-lg">Legal</h4>
                <ul className="space-y-3 text-blue-200">
                  <li className="hover:text-blue-400 cursor-pointer transition-colors">Privacy Policy</li>
                  <li className="hover:text-blue-400 cursor-pointer transition-colors">Terms of Service</li>
                  <li className="hover:text-blue-400 cursor-pointer transition-colors">Contact</li>
                </ul>
              </div>
            </div>
            <div className="border-t border-white/10 mt-12 pt-8 text-center text-blue-200">
              <p>© 2024 PatentFlow. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default LandingPage; 