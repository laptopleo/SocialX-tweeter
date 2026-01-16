import React from "react";
import { useStore } from "@/hooks/useStore";
import Modal from "../modal";
import { Sparkles, Users, Shield, Zap, Heart, TrendingUp } from "lucide-react";

const FeaturesModal = () => {
  const { isFeaturesModalOpen, onCloseFeaturesModal } = useStore();

  const features = [
    {
      icon: <Sparkles className="w-6 h-6 text-blue-500" />,
      title: "AI-Powered Content",
      description: "Generate engaging posts with our integrated AI assistant powered by Gemini and DeepSeek.",
    },
    {
      icon: <Users className="w-6 h-6 text-green-500" />,
      title: "Smart Following",
      description: "Discover and connect with people who share your interests through intelligent recommendations.",
    },
    {
      icon: <Shield className="w-6 h-6 text-purple-500" />,
      title: "Enhanced Security",
      description: "Your data is protected with enterprise-grade encryption and secure authentication.",
    },
    {
      icon: <Zap className="w-6 h-6 text-yellow-500" />,
      title: "Lightning Fast",
      description: "Experience blazing-fast performance with optimized caching and database indexing.",
    },
    {
      icon: <Heart className="w-6 h-6 text-red-500" />,
      title: "Engagement Boost",
      description: "Increase your reach with advanced analytics and engagement tracking tools.",
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-indigo-500" />,
      title: "Growth Analytics",
      description: "Track your growth with detailed insights and performance metrics.",
    },
  ];

  return (
    <Modal
      title="Platform Features"
      subTitle="Discover what makes SocialX the best social platform for creators and communities."
      isCentered
      isOpen={isFeaturesModalOpen}
      onClose={onCloseFeaturesModal}
      body={
        <div className="w-full px-6 pb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-[550px] mx-auto">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex flex-col gap-3 p-4 rounded-xl border border-border
                  hover:border-primary/50 transition-all duration-200
                  hover:shadow-lg hover:scale-[1.02]"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    {feature.icon}
                  </div>
                  <h3 className="font-semibold text-lg">{feature.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
          
          <div className="mt-8 p-4 rounded-xl bg-primary/5 border border-primary/20 max-w-[550px] mx-auto">
            <p className="text-center text-sm text-muted-foreground">
              <span className="font-semibold text-primary">Pro Tip:</span> Upgrade to Premium 
              to unlock exclusive features and boost your social presence!
            </p>
          </div>
        </div>
      }
    />
  );
};

export default FeaturesModal;
