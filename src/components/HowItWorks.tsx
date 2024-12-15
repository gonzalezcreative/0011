import React from 'react';
import { ClipboardList, Tags, PartyPopper } from 'lucide-react';

export const HowItWorks = () => {
  const steps = [
    {
      icon: <ClipboardList className="h-6 w-6 mb-3 mx-auto text-purple-300" />,
      title: "Submit Your Request",
      description: "Tell us what you need for your perfect party - from bounce houses to sound systems!"
    },
    {
      icon: <Tags className="h-6 w-6 mb-3 mx-auto text-purple-300" />,
      title: "Get Multiple Quotes",
      description: "Local rental providers compete to offer you their best deals"
    },
    {
      icon: <PartyPopper className="h-6 w-6 mb-3 mx-auto text-purple-300" />,
      title: "Party Time!",
      description: "Choose your favorite offer and let the celebration begin"
    }
  ];

  return (
    <div className="py-12 px-4">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-2xl font-bold text-white mb-8">How It Works</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div 
              key={index}
              className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-white"
            >
              {step.icon}
              <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
              <p className="text-sm text-gray-200">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};