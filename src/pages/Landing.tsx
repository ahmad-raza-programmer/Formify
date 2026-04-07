import React from 'react';
import { Link } from 'react-router-dom';
import { LayoutTemplate, Share2, BarChart3, ShieldCheck, ArrowRight, CheckCircle2, Sparkles, Zap, MousePointerClick, Send, Lock } from 'lucide-react';
import { motion } from 'motion/react';

export default function Landing() {
  const features = [
    {
      name: 'Drag & Drop Builder',
      description: 'Create complex forms in minutes with our intuitive visual builder. No coding required.',
      icon: LayoutTemplate,
    },
    {
      name: 'Instant Sharing',
      description: 'Share your forms instantly with a public link or embed them directly on your website.',
      icon: Share2,
    },
    {
      name: 'Real-time Analytics',
      description: 'Watch responses come in real-time and export your data to CSV for further analysis.',
      icon: BarChart3,
    },
    {
      name: 'Secure by Default',
      description: 'Your data is protected with enterprise-grade security and role-based access controls.',
      icon: ShieldCheck,
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="min-h-screen bg-white selection:bg-green-100 selection:text-green-900 font-sans">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 border-b border-gray-100 bg-white/80 backdrop-blur-md z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-sm">
                <LayoutTemplate className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl tracking-tight text-gray-900">Formify</span>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Link to="/login" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Log in
              </Link>
              <Link to="/signup" className="bg-gray-900 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-800 transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="pt-16">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-white">
          {/* Background decorative elements */}
          <div className="absolute inset-0 z-0 pointer-events-none bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]">
            <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-green-500 opacity-20 blur-[100px]"></div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 sm:pt-32 sm:pb-32 relative z-10">
            <motion.div 
              className="text-center max-w-4xl mx-auto"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-50/80 border border-green-200/50 text-green-700 text-sm font-medium mb-8 backdrop-blur-sm shadow-sm">
                <Sparkles className="w-4 h-4 text-green-600" />
                <span>The modern way to build forms</span>
              </motion.div>
              
              <motion.h1 variants={itemVariants} className="text-[40px] tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl mb-6 leading-[1.1]">
                Build forms visually.<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 via-emerald-500 to-teal-500">
                  Collect data instantly.
                </span>
              </motion.h1>
              
              <motion.p variants={itemVariants} className="mt-4 max-w-2xl mx-auto text-base text-gray-600 sm:text-lg md:mt-6 leading-relaxed">
                The no-code drag-and-drop form builder for modern teams. Create beautiful forms, share links, and manage responses in real-time without writing a single line of code.
              </motion.p>
              
              <motion.div variants={itemVariants} className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link to="/signup" className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-semibold rounded-full text-white bg-gray-900 hover:bg-gray-800 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1">
                  Start Building for Free
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
                <Link to="/login" className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 border border-gray-200 text-base font-semibold rounded-full text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm hover:shadow-md">
                  View Demo
                </Link>
              </motion.div>
              
              <motion.div variants={itemVariants} className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500 font-medium">
                <div className="flex items-center gap-2 bg-white/50 px-3 py-1.5 rounded-full border border-gray-100">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-2 bg-white/50 px-3 py-1.5 rounded-full border border-gray-100">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <span>14-day free trial</span>
                </div>
                <div className="flex items-center gap-2 bg-white/50 px-3 py-1.5 rounded-full border border-gray-100">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <span>Cancel anytime</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Dashboard Preview Section */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="relative rounded-2xl bg-gray-900/5 p-2 sm:p-4 ring-1 ring-inset ring-gray-900/10 lg:rounded-3xl lg:p-4"
          >
            <div className="rounded-xl overflow-hidden border border-gray-200 bg-white shadow-2xl">
              {/* Mockup Header */}
              <div className="bg-gray-50 border-b border-gray-200 px-4 py-3 flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                <div className="mx-auto bg-white border border-gray-200 rounded-md px-3 py-1 text-xs text-gray-500 font-mono w-64 text-center truncate flex items-center justify-center gap-2 shadow-sm">
                  <Lock className="w-3 h-3 text-gray-400" />
                  formify.app/builder
                </div>
              </div>
              {/* Mockup Body */}
              <div className="flex h-[400px] sm:h-[500px] md:h-[600px] bg-gray-50">
                {/* Sidebar */}
                <div className="w-48 sm:w-64 border-r border-gray-200 bg-white hidden sm:block p-4">
                  <div className="h-4 w-24 bg-gray-200 rounded mb-6"></div>
                  <div className="space-y-3">
                    {[
                      { icon: LayoutTemplate, label: 'Short Text' },
                      { icon: LayoutTemplate, label: 'Long Text' },
                      { icon: LayoutTemplate, label: 'Email' },
                      { icon: LayoutTemplate, label: 'Dropdown' },
                      { icon: LayoutTemplate, label: 'Radio Buttons' },
                      { icon: LayoutTemplate, label: 'Checkboxes' },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-3 p-2 rounded-md border border-gray-100 bg-gray-50/50">
                        <div className="w-6 h-6 rounded bg-white border border-gray-200 flex items-center justify-center flex-shrink-0">
                          <item.icon className="w-3 h-3 text-gray-400" />
                        </div>
                        <div className="text-xs font-medium text-gray-600">{item.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Canvas */}
                <div className="flex-1 p-6 sm:p-10 overflow-hidden flex flex-col items-center bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
                  <div className="w-full max-w-2xl bg-white rounded-xl shadow-sm border border-gray-200 p-8 space-y-6 relative">
                    <div className="absolute top-0 left-0 w-full h-2 bg-green-500 rounded-t-xl"></div>
                    <div className="space-y-2 pt-2">
                      <div className="text-sm font-bold text-gray-800">Customer Feedback Survey</div>
                      <div className="text-xs text-gray-500">We would love to hear your thoughts on our new product.</div>
                    </div>
                    <div className="space-y-6 pt-4">
                      <div className="space-y-2">
                        <div className="text-xs font-medium text-gray-700">How satisfied are you with our service? <span className="text-red-500">*</span></div>
                        <div className="h-10 w-full bg-gray-50 border border-gray-200 rounded-md flex items-center px-3">
                          <span className="text-gray-400 text-xs">Select an option</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="text-xs font-medium text-gray-700">What could we improve?</div>
                        <div className="h-24 w-full bg-gray-50 border border-gray-200 rounded-md p-3">
                          <span className="text-gray-400 text-xs">Enter your feedback here...</span>
                        </div>
                      </div>
                      <div className="pt-4">
                        <div className="h-10 w-32 bg-green-600 rounded-md flex items-center justify-center text-white text-sm font-medium shadow-sm">
                          Submit Feedback
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* How it works Section */}
        <div className="py-24 bg-white sm:py-32 border-t border-gray-100">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center mb-16">
              <h2 className="text-base font-semibold leading-7 text-green-600">Simple Process</h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                How Formify Works
              </p>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                Get your form up and running in three simple steps.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
              <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-green-100 via-green-300 to-green-100 z-0"></div>
              
              {[
                {
                  title: '1. Build',
                  description: 'Drag and drop fields onto the canvas to create your form structure.',
                  icon: MousePointerClick,
                },
                {
                  title: '2. Share',
                  description: 'Get a unique link or embed code to share your form with the world.',
                  icon: Send,
                },
                {
                  title: '3. Analyze',
                  description: 'View responses in real-time and export data for deeper insights.',
                  icon: Zap,
                }
              ].map((step, index) => (
                <motion.div 
                  key={step.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  className="relative z-10 flex flex-col items-center text-center"
                >
                  <div className="w-24 h-24 rounded-full bg-white border-4 border-green-50 shadow-xl flex items-center justify-center mb-6">
                    <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                      <step.icon className="w-8 h-8" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="py-24 bg-gray-50 sm:py-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-base font-semibold leading-7 text-green-600">Everything you need</h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                No code. No limits.
              </p>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                Formify provides all the tools you need to create, distribute, and analyze forms without writing a single line of code.
              </p>
            </div>
            
            <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
              <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-4">
                {features.map((feature, index) => (
                  <motion.div 
                    key={feature.name} 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex flex-col bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                  >
                    <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                      <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-green-50">
                        <feature.icon className="h-5 w-5 text-green-600" aria-hidden="true" />
                      </div>
                      {feature.name}
                    </dt>
                    <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                      <p className="flex-auto">{feature.description}</p>
                    </dd>
                  </motion.div>
                ))}
              </dl>
            </div>
          </div>
        </div>
        
        {/* CTA Section */}
        <div className="bg-white">
          <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
            <div className="relative isolate overflow-hidden bg-gray-900 px-6 py-24 text-center shadow-2xl sm:rounded-3xl sm:px-16">
              <h2 className="mx-auto max-w-2xl text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
                Ready to start building?
              </h2>
              <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-300">
                Join thousands of users who are already creating beautiful forms with Formify. Start your free trial today.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <Link
                  to="/signup"
                  className="rounded-full bg-white px-8 py-4 text-base font-semibold text-gray-900 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition-all hover:scale-105"
                >
                  Get started for free
                </Link>
              </div>
              <svg
                viewBox="0 0 1024 1024"
                className="absolute left-1/2 top-1/2 -z-10 h-[64rem] w-[64rem] -translate-x-1/2 [mask-image:radial-gradient(closest-side,white,transparent)]"
                aria-hidden="true"
              >
                <circle cx={512} cy={512} r={512} fill="url(#827591b1-ce8c-4110-b064-7cb85a0b1217)" fillOpacity="0.7" />
                <defs>
                  <radialGradient id="827591b1-ce8c-4110-b064-7cb85a0b1217">
                    <stop stopColor="#10b981" />
                    <stop offset={1} stopColor="#059669" />
                  </radialGradient>
                </defs>
              </svg>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 md:flex md:items-center md:justify-between lg:px-8">
          <div className="mt-8 md:mt-0 md:order-1 flex items-center gap-2 justify-center w-full">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
              <LayoutTemplate className="w-3 h-3 text-white" />
            </div>
            <p className="text-center text-sm text-gray-500">
              &copy; {new Date().getFullYear()} Formify, Inc. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
