import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Calculator, TrendingUp, ArrowRight } from 'lucide-react';

interface OnboardingProps {
  onComplete: () => void;
}

const onboardingSteps = [
  {
    icon: Users,
    title: "Split Bills Easily",
    description: "Share expenses with friends, roommates, or colleagues effortlessly",
    color: "text-primary-green"
  },
  {
    icon: Calculator,
    title: "Smart Calculations",
    description: "Automatically calculate who owes what with precise splitting methods",
    color: "text-primary-blue"
  },
  {
    icon: TrendingUp,
    title: "Track & Analyze",
    description: "Monitor your spending patterns and group expenses with detailed reports",
    color: "text-primary-amber"
  }
];

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      localStorage.setItem('splitease_onboarding', 'true');
      onComplete();
    }
  };

  const handleSkip = () => {
    localStorage.setItem('splitease_onboarding', 'true');
    onComplete();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-green/10 to-primary-blue/10 flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center p-6">
        <motion.h1 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-2xl font-bold text-text-dark"
        >
          SplitEase
        </motion.h1>
        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={handleSkip}
          className="text-gray-500 hover:text-gray-700 transition-colors"
        >
          Skip
        </motion.button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-sm"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className={`w-24 h-24 mx-auto mb-8 rounded-3xl bg-white shadow-lg flex items-center justify-center ${onboardingSteps[currentStep].color}`}
            >
              {(() => {
                const IconComponent = onboardingSteps[currentStep].icon;
                return <IconComponent size={40} />;
              })()}
            </motion.div>

            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-3xl font-bold text-text-dark mb-4"
            >
              {onboardingSteps[currentStep].title}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-gray-600 text-lg leading-relaxed"
            >
              {onboardingSteps[currentStep].description}
            </motion.p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Navigation */}
      <div className="p-6">
        {/* Progress Indicators */}
        <div className="flex justify-center space-x-2 mb-8">
          {onboardingSteps.map((_, index) => (
            <motion.div
              key={index}
              initial={{ scale: 0.8 }}
              animate={{ 
                scale: index === currentStep ? 1.2 : 1,
                backgroundColor: index === currentStep ? '#4CAF50' : '#E5E7EB'
              }}
              className="w-3 h-3 rounded-full"
            />
          ))}
        </div>

        {/* Next Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleNext}
          className="w-full bg-primary-green text-white py-4 rounded-2xl font-semibold text-lg flex items-center justify-center space-x-2 shadow-lg ripple"
        >
          <span>{currentStep === onboardingSteps.length - 1 ? 'Get Started' : 'Next'}</span>
          <ArrowRight size={20} />
        </motion.button>
      </div>
    </div>
  );
}