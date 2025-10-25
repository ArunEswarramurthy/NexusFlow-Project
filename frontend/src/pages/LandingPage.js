import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import NexusFlowLogo from '../components/common/NexusFlowLogo';
import { 
  Users, CheckCircle, BarChart3, Shield, Zap, ArrowRight, Star, Play, Menu, X, Clock, Globe, Rocket, Sparkles, Target, TrendingUp, Award, Layers, Workflow, Brain, Infinity, Cpu
} from 'lucide-react';

// Tab Slider Component
const HowItWorksSlider = () => {
  const [activeTab, setActiveTab] = useState(0);
  
  const tabs = [
    {
      id: 0,
      title: "Dashboard Overview",
      subtitle: "Real-time insights at a glance",
      description: "Get instant visibility into your team's performance with our comprehensive dashboard. Track active tasks, monitor progress, and identify bottlenecks before they impact your deadlines.",
      features: ["Live task tracking", "Performance metrics", "Team activity feed", "Progress analytics"],
      mockup: {
        title: "Team Dashboard",
        stats: ["24 Active Tasks", "85% Completion Rate", "12 Team Members"],
        chart: "📊 Performance trending up 15%"
      }
    },
    {
      id: 1,
      title: "Task Management",
      subtitle: "Streamlined workflow automation",
      description: "Create, assign, and track tasks with intelligent automation. Our AI-powered system suggests optimal assignments based on team capacity and expertise.",
      features: ["Smart task assignment", "Automated workflows", "Priority management", "Deadline tracking"],
      mockup: {
        title: "Task Board",
        stats: ["To Do: 8", "In Progress: 12", "Completed: 24"],
        chart: "✅ 94% on-time completion"
      }
    },
    {
      id: 2,
      title: "Team Collaboration",
      subtitle: "Seamless communication hub",
      description: "Foster collaboration with integrated messaging, file sharing, and real-time updates. Keep everyone aligned with centralized communication.",
      features: ["Real-time messaging", "File sharing", "Video calls", "Activity notifications"],
      mockup: {
        title: "Team Chat",
        stats: ["5 Active Chats", "23 Files Shared", "100% Team Online"],
        chart: "💬 Response time: 2 minutes"
      }
    },
    {
      id: 3,
      title: "Analytics & Reports",
      subtitle: "Data-driven decision making",
      description: "Make informed decisions with comprehensive analytics and customizable reports. Track productivity trends and optimize team performance.",
      features: ["Custom reports", "Productivity insights", "Trend analysis", "Export capabilities"],
      mockup: {
        title: "Analytics Hub",
        stats: ["40% Productivity Boost", "99.2% Uptime", "4.9⭐ User Rating"],
        chart: "📈 Growth trajectory: Excellent"
      }
    }
  ];
  
  return (
    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
      <div className="border-b border-gray-200">
        <div className="flex overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 min-w-0 px-6 py-4 text-sm font-semibold transition-all duration-300 ${
                activeTab === tab.id
                  ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <div className="truncate">{tab.title}</div>
            </button>
          ))}
        </div>
      </div>
      
      <div className="p-8 lg:p-12">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="grid lg:grid-cols-2 gap-12 items-center"
        >
          <div>
            <div className="mb-6">
              <h3 className="text-3xl font-bold text-gray-900 mb-2">
                {tabs[activeTab].title}
              </h3>
              <p className="text-lg text-indigo-600 font-semibold mb-4">
                {tabs[activeTab].subtitle}
              </p>
              <p className="text-gray-600 leading-relaxed text-lg">
                {tabs[activeTab].description}
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-8">
              {tabs[activeTab].features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700 font-medium">{feature}</span>
                </div>
              ))}
            </div>
            
            <button 
              onClick={() => window.location.href = '/register'}
              className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-semibold rounded-xl hover:from-indigo-500 hover:to-blue-500 transform hover:scale-105 transition-all duration-300 shadow-lg"
            >
              Try This Feature
            </button>
          </div>
          
          <div className="relative">
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                </div>
                <div className="text-white/60 text-sm">{tabs[activeTab].mockup.title}</div>
              </div>
              
              <div className="space-y-4">
                {tabs[activeTab].mockup.stats.map((stat, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                    <span className="text-white font-medium">{stat}</span>
                    <div className="w-16 h-2 bg-white/20 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-indigo-400 to-blue-400 rounded-full"
                        style={{ width: `${Math.random() * 40 + 60}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
                
                <div className="mt-6 p-4 bg-gradient-to-r from-indigo-500/20 to-blue-500/20 rounded-lg border border-indigo-400/30">
                  <div className="text-white font-semibold text-center">
                    {tabs[activeTab].mockup.chart}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="absolute -top-4 -right-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg animate-pulse">
              Live Demo
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const LandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle smooth scrolling to sections
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  // Handle contact form submission
  const handleContactSubmit = async (e) => {
    e.preventDefault();
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Thank you for your message! We\'ll get back to you soon.');
      setContactForm({ name: '', email: '', message: '' });
      setIsContactModalOpen(false);
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    }
  };

  // Handle demo video
  const handleWatchDemo = () => {
    setIsVideoModalOpen(true);
  };

  // Handle get started button
  const handleGetStarted = () => {
    navigate('/register');
  };

  // Handle login buttons
  const handleUserLogin = () => {
    navigate('/login');
  };

  const handleAdminLogin = () => {
    navigate('/admin/login');
  };

  const features = [
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Role-Based Access Control",
      description: "Control who sees and does what with granular permissions and role management.",
      color: "from-primary-500 to-secondary-500"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Hierarchical Team Structure",
      description: "Organize teams in departments and groups with unlimited nesting levels.",
      color: "from-secondary-500 to-primary-500"
    },
    {
      icon: <CheckCircle className="w-8 h-8" />,
      title: "Task Assignment & Tracking",
      description: "Assign, monitor, and approve tasks seamlessly with real-time updates.",
      color: "from-accent-500 to-accent-600"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Real-Time Notifications",
      description: "Stay updated with instant alerts via email, in-app, and push notifications.",
      color: "from-accent-400 to-accent-500"
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Detailed Analytics",
      description: "Track performance with comprehensive reports and visual dashboards.",
      color: "from-primary-600 to-secondary-600"
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Google OAuth Integration",
      description: "Quick and secure login with Google account integration.",
      color: "from-secondary-600 to-primary-600"
    }
  ];

  const steps = [
    {
      step: "01",
      title: "Admin creates organization account",
      description: "Register your organization and verify email with OTP"
    },
    {
      step: "02", 
      title: "Add team members and assign roles",
      description: "Invite users, set permissions, and organize into groups"
    },
    {
      step: "03",
      title: "Create and assign tasks",
      description: "Build tasks with deadlines, priorities, and attachments"
    },
    {
      step: "04",
      title: "Track progress in real-time",
      description: "Monitor status changes, comments, and submissions"
    },
    {
      step: "05",
      title: "Review and approve completed work",
      description: "Approve tasks or request revisions with feedback"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Project Manager",
      company: "TechCorp Inc.",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=64&h=64&fit=crop&crop=face",
      content: "NexusFlow transformed how our team collaborates. The role-based access control is exactly what we needed.",
      rating: 5
    },
    {
      name: "Michael Chen",
      role: "Engineering Lead", 
      company: "StartupXYZ",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face",
      content: "The hierarchical team structure and task tracking features have increased our productivity by 40%.",
      rating: 5
    },
    {
      name: "Emily Rodriguez",
      role: "Operations Director",
      company: "GrowthCo",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=face", 
      content: "Real-time notifications and detailed analytics help us stay on top of everything. Highly recommended!",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrollY > 50 ? 'bg-black/80 backdrop-blur-xl border-b border-purple-500/30' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <NexusFlowLogo size={48} />
              <span className="text-3xl font-black bg-gradient-to-r from-indigo-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">NexusFlow</span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center space-x-10">
              <button onClick={() => scrollToSection('features')} className="text-gray-300 hover:text-purple-400 font-semibold text-lg transition-all duration-300 hover:scale-110">Features</button>
              <button onClick={() => scrollToSection('how-it-works')} className="text-gray-300 hover:text-pink-400 font-semibold text-lg transition-all duration-300 hover:scale-110">Solutions</button>
              <button onClick={() => scrollToSection('testimonials')} className="text-gray-300 hover:text-violet-400 font-semibold text-lg transition-all duration-300 hover:scale-110">Reviews</button>
              <button onClick={handleUserLogin} className="text-gray-300 hover:text-purple-400 font-semibold text-lg transition-all duration-300 hover:scale-110">Login</button>
              <button onClick={handleAdminLogin} className="px-6 py-3 border-2 border-purple-500/50 text-purple-300 rounded-xl hover:border-purple-400 hover:text-purple-200 hover:bg-purple-500/10 transition-all duration-300 font-semibold">Admin</button>
              <button onClick={handleGetStarted} className="px-8 py-3 bg-gradient-to-r from-purple-600 via-pink-600 to-violet-600 text-white rounded-xl font-bold hover:from-purple-500 hover:via-pink-500 hover:to-violet-500 transform hover:scale-110 transition-all duration-300 shadow-2xl shadow-purple-500/30">Get Started</button>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="lg:hidden p-2 rounded-lg hover:bg-slate-800 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6 text-slate-300" /> : <Menu className="w-6 h-6 text-slate-300" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:hidden bg-slate-800/95 backdrop-blur-lg border-t border-slate-700 py-6 rounded-b-2xl"
            >
              <div className="flex flex-col space-y-4 px-4">
                <button onClick={() => scrollToSection('features')} className="text-slate-300 hover:text-cyan-400 font-medium py-2 transition-colors text-left">Features</button>
                <button onClick={() => scrollToSection('how-it-works')} className="text-slate-300 hover:text-cyan-400 font-medium py-2 transition-colors text-left">Solutions</button>
                <button onClick={() => scrollToSection('testimonials')} className="text-slate-300 hover:text-cyan-400 font-medium py-2 transition-colors text-left">Reviews</button>
                <button onClick={handleUserLogin} className="text-slate-300 hover:text-cyan-400 font-medium py-2 transition-colors text-left">Login</button>
                <button onClick={handleAdminLogin} className="w-full py-3 border border-slate-600 text-slate-300 rounded-lg font-medium text-center hover:border-cyan-400 hover:text-cyan-400 transition-all">Admin Login</button>
                <button onClick={handleGetStarted} className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-semibold text-center hover:from-cyan-400 hover:to-blue-400 transition-all">Get Started</button>
              </div>
            </motion.div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-20 overflow-hidden min-h-screen flex items-center">
        {/* Geometric Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white"></div>
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-bl from-indigo-50 to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-1/3 h-2/3 bg-gradient-to-tr from-blue-50 to-transparent"></div>
          <svg className="absolute top-20 right-20 w-64 h-64 text-indigo-100" fill="currentColor" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" opacity="0.3" />
          </svg>
          <svg className="absolute bottom-20 left-20 w-48 h-48 text-blue-100" fill="currentColor" viewBox="0 0 100 100">
            <polygon points="50,10 90,90 10,90" opacity="0.3" />
          </svg>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="text-left">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center px-4 py-2 bg-indigo-100 rounded-full text-sm font-semibold text-indigo-700 mb-8"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                <span>Next-Gen Team Platform</span>
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-5xl lg:text-7xl font-black mb-8 leading-tight text-gray-900"
              >
                Build Better
                <span className="block bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  Teams Together
                </span>
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xl text-gray-600 mb-10 leading-relaxed max-w-xl"
              >
                The all-in-one workspace that brings teams together with smart task management, real-time collaboration, and powerful analytics.
              </motion.p>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-4 mb-12"
              >
                <button 
                  onClick={handleGetStarted} 
                  className="group px-8 py-4 bg-indigo-600 text-white font-semibold rounded-xl text-lg hover:bg-indigo-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <span className="flex items-center justify-center">
                    <ArrowRight className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform" />
                    Get Started Free
                  </span>
                </button>
                
                <button 
                  onClick={handleWatchDemo} 
                  className="group px-8 py-4 bg-white text-gray-700 font-semibold rounded-xl text-lg border-2 border-gray-200 hover:border-indigo-300 hover:text-indigo-600 transition-all duration-300"
                >
                  <Play className="w-5 h-5 mr-2 inline transition-colors" />
                  Watch Demo
                </button>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex items-center space-x-8"
              >
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">50K+</div>
                  <div className="text-sm text-gray-500">Happy Users</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">99.9%</div>
                  <div className="text-sm text-gray-500">Uptime</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">4.9★</div>
                  <div className="text-sm text-gray-500">Rating</div>
                </div>
              </motion.div>
            </div>
            
            {/* Right Visual */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="relative"
            >
              <div className="relative bg-white rounded-2xl p-6 shadow-2xl border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  </div>
                  <div className="text-gray-500 text-sm font-medium">NexusFlow Dashboard</div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div>
                        <div className="text-gray-900 font-semibold">Project Alpha</div>
                        <div className="text-gray-500 text-sm">85% Complete</div>
                      </div>
                    </div>
                    <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="w-4/5 h-full bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full"></div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Users className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="text-gray-900 font-semibold">Team Sync</div>
                        <div className="text-gray-500 text-sm">12 Members Active</div>
                      </div>
                    </div>
                    <div className="flex -space-x-1">
                      <div className="w-8 h-8 bg-indigo-400 rounded-full border-2 border-white"></div>
                      <div className="w-8 h-8 bg-blue-400 rounded-full border-2 border-white"></div>
                      <div className="w-8 h-8 bg-cyan-400 rounded-full border-2 border-white"></div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <div className="text-gray-900 font-semibold">Performance</div>
                        <div className="text-gray-500 text-sm">+24% This Week</div>
                      </div>
                    </div>
                    <div className="text-green-600 font-bold text-lg">↗ 24%</div>
                  </div>
                </div>
              </div>
              
              {/* Floating Elements */}
              <div className="absolute -top-3 -right-3 w-12 h-12 bg-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
                <Zap className="w-6 h-6 text-white" />
              </div>
              
              <div className="absolute -bottom-3 -left-3 w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center shadow-lg">
                <Brain className="w-5 h-5 text-white" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-gray-600 font-semibold mb-8">Trusted by industry leaders worldwide</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { number: "50K+", label: "Active Users", icon: <Users className="w-6 h-6" /> },
                { number: "1M+", label: "Tasks Completed", icon: <CheckCircle className="w-6 h-6" /> },
                { number: "99.9%", label: "Uptime SLA", icon: <Shield className="w-6 h-6" /> },
                { number: "4.9★", label: "User Rating", icon: <Star className="w-6 h-6" /> }
              ].map((stat, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-xl mb-4">
                    <div className="text-indigo-600">{stat.icon}</div>
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6"
            >
              Why teams choose
              <span className="block text-indigo-600">
                NexusFlow
              </span>
            </motion.h2>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg text-gray-600 max-w-2xl mx-auto"
            >
              Simple, powerful tools that help your team stay organized and productive.
            </motion.p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {[
              {
                icon: <CheckCircle className="w-6 h-6" />,
                title: "Smart Task Management",
                description: "Create, assign, and track tasks with intelligent automation and priority management."
              },
              {
                icon: <Users className="w-6 h-6" />,
                title: "Team Collaboration",
                description: "Real-time messaging, file sharing, and unified workspaces for seamless teamwork."
              },
              {
                icon: <BarChart3 className="w-6 h-6" />,
                title: "Powerful Analytics",
                description: "Track performance with comprehensive reports and beautiful data visualizations."
              },
              {
                icon: <Shield className="w-6 h-6" />,
                title: "Enterprise Security",
                description: "Bank-level encryption and role-based permissions to keep your data safe."
              },
              {
                icon: <Zap className="w-6 h-6" />,
                title: "Lightning Fast",
                description: "Optimized performance with 99.9% uptime and sub-second response times."
              },
              {
                icon: <Globe className="w-6 h-6" />,
                title: "Works Everywhere",
                description: "Access your workspace from any device with our responsive web platform."
              }
            ].map((feature, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300"
              >
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                  <div className="text-indigo-600">{feature.icon}</div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="bg-indigo-600 rounded-2xl p-12 text-center"
          >
            <h3 className="text-3xl font-bold text-white mb-4">Ready to get started?</h3>
            <p className="text-indigo-100 mb-8 max-w-2xl mx-auto text-lg">
              Join thousands of teams already using NexusFlow to streamline their workflow.
            </p>
            <button 
              onClick={handleGetStarted}
              className="px-8 py-4 bg-white text-indigo-600 font-semibold rounded-xl text-lg hover:bg-gray-50 transition-all duration-300 shadow-lg"
            >
              Start Free Trial
            </button>
          </motion.div>
        </div>
      </section>



      {/* Testimonial Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gray-50 rounded-2xl p-8">
            <div className="flex justify-center mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
              ))}
            </div>
            <blockquote className="text-xl text-gray-700 mb-6">
              "NexusFlow transformed how our team collaborates. The role-based access control and real-time updates have increased our productivity by 40%."
            </blockquote>
            <div className="flex items-center justify-center">
              <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
              <div>
                <div className="font-semibold text-gray-900">Sarah Johnson</div>
                <div className="text-gray-600">Project Manager, TechCorp</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works - Tab Slider */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-4xl lg:text-5xl font-black text-gray-900 mb-6"
            >
              See NexusFlow in Action
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-gray-600 max-w-3xl mx-auto"
            >
              Discover how teams transform their workflow with our powerful features
            </motion.p>
          </div>
          
          <HowItWorksSlider />
        </div>
      </section>
      
      {/* Partner Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-600 mb-6">Developed in partnership with</p>
          <div className="inline-flex items-center bg-white px-6 py-4 rounded-lg shadow-sm">
            <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center mr-3">
              <span className="text-white font-bold text-sm">SBS</span>
            </div>
            <span className="text-lg font-semibold text-gray-900">Shivore Business & Solutions</span>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-navy-900 to-blue-800"></div>
          <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-full filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-green-500/20 to-teal-500/20 rounded-full filter blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>
        
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="bg-navy-800/50 backdrop-blur-2xl rounded-3xl p-16 border border-gray-700/50 shadow-2xl"
          >
            <div className="mb-8">
              <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-orange-500/20 to-green-500/20 rounded-full border border-orange-400/30 mb-6">
                <Award className="w-5 h-5 text-orange-400 mr-2" />
                <span className="text-orange-400 font-semibold">Industry Leading Platform</span>
              </div>
            </div>
            
            <h2 className="text-5xl md:text-6xl font-black mb-8 text-white">
              Ready to <span className="bg-gradient-to-r from-orange-400 to-green-400 bg-clip-text text-transparent">Dominate</span>
              <br />Your Industry?
            </h2>
            
            <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Join 10,000+ teams who've already transformed their operations and achieved unprecedented growth with NexusFlow.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
              <button 
                onClick={handleGetStarted} 
                className="group relative px-12 py-6 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-2xl text-xl shadow-2xl shadow-orange-500/25 hover:shadow-orange-500/40 transform hover:scale-105 transition-all duration-300 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-red-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative z-10 flex items-center justify-center">
                  <Rocket className="w-7 h-7 mr-3" />
                  Start Your Transformation
                </span>
              </button>
              
              <button 
                onClick={handleAdminLogin} 
                className="px-12 py-6 bg-navy-700/50 backdrop-blur-lg text-gray-300 font-semibold rounded-2xl text-xl border border-gray-600/50 hover:bg-navy-600/50 hover:border-green-400/50 hover:text-green-400 transform hover:scale-105 transition-all duration-300"
              >
                Admin Access
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="flex items-center justify-center p-4 bg-navy-700/30 rounded-xl border border-orange-600/30">
                <CheckCircle className="w-6 h-6 text-green-400 mr-3" />
                <span className="text-gray-300 font-medium">No Setup Fees</span>
              </div>
              <div className="flex items-center justify-center p-4 bg-navy-700/30 rounded-xl border border-green-600/30">
                <Shield className="w-6 h-6 text-blue-400 mr-3" />
                <span className="text-gray-300 font-medium">Enterprise Security</span>
              </div>
              <div className="flex items-center justify-center p-4 bg-navy-700/30 rounded-xl border border-blue-600/30">
                <Zap className="w-6 h-6 text-orange-400 mr-3" />
                <span className="text-gray-300 font-medium">Instant Deployment</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <NexusFlowLogo size={32} />
                <span className="text-xl font-bold">NexusFlow</span>
              </div>
              <p className="text-gray-400 mb-4">
                Streamline Teams, Amplify Productivity
              </p>
              <p className="text-sm text-gray-500">
                © 2025 NexusFlow. All rights reserved.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><button onClick={() => toast.info('About page coming soon!')} className="hover:text-white transition-colors">About Us</button></li>
                <li><button onClick={() => setIsContactModalOpen(true)} className="hover:text-white transition-colors">Contact</button></li>
                <li><button onClick={() => toast.info('Careers page coming soon!')} className="hover:text-white transition-colors">Careers</button></li>
                <li><button onClick={() => toast.info('Blog coming soon!')} className="hover:text-white transition-colors">Blog</button></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>

      {/* Video Modal */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-xl font-semibold">NexusFlow Demo</h3>
              <button 
                onClick={() => setIsVideoModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Play className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Demo video coming soon!</p>
                  <p className="text-sm text-gray-500 mt-2">Experience NexusFlow's powerful features in action</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contact Modal */}
      {isContactModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-xl font-semibold">Contact Us</h3>
              <button 
                onClick={() => setIsContactModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleContactSubmit} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    required
                    value={contactForm.name}
                    onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                    className="input"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    required
                    value={contactForm.email}
                    onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                    className="input"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                  <textarea
                    required
                    rows={4}
                    value={contactForm.message}
                    onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                    className="input"
                    placeholder="How can we help you?"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsContactModalOpen(false)}
                  className="btn btn-outline flex-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary flex-1"
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;