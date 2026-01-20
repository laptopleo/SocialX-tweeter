import React from "react";
import { useStore } from "@/hooks/useStore";
import Modal from "../modal";
import { Sparkles, Users, Shield, Zap, Heart, TrendingUp } from "lucide-react";

const FeaturesModal = () => {
  const { isFeaturesModalOpen, onCloseFeaturesModal } = useStore();

  const features = [
    {
      icon: <Sparkles className="h-6 w-6 text-blue-500" />,
      title: "AI-Powered Content",
      description:
        "Generate engaging posts with our integrated AI assistant powered by Gemini and DeepSeek.",
    },
    {
      icon: <Users className="h-6 w-6 text-green-500" />,
      title: "Smart Following",
      description:
        "Discover and connect with people who share your interests through intelligent recommendations.",
    },
    {
      icon: <Shield className="h-6 w-6 text-purple-500" />,
      title: "Enhanced Security",
      description:
        "Your data is protected with enterprise-grade encryption and secure authentication.",
    },
    {
      icon: <Zap className="h-6 w-6 text-yellow-500" />,
      title: "Lightning Fast",
      description:
        "Experience blazing-fast performance with optimized caching and database indexing.",
    },
    {
      icon: <Heart className="h-6 w-6 text-red-500" />,
      title: "Engagement Boost",
      description: "Increase your reach with advanced analytics and engagement tracking tools.",
    },
    {
      icon: <TrendingUp className="h-6 w-6 text-indigo-500" />,
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
          <div className="mx-auto grid max-w-[550px] grid-cols-1 gap-6 md:grid-cols-2">
            {features.map((feature, index) => (
              <div
                key={index}
                className="border-border hover:border-primary/50 flex flex-col gap-3 rounded-xl border border-gray-800 p-4 transition-all duration-200 hover:scale-[1.02] hover:shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 rounded-lg p-2">{feature.icon}</div>
                  <h3 className="text-lg font-semibold">{feature.title}</h3>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          <div className="border-primary/20 bg-primary/5 mx-auto mt-8 max-w-[550px] rounded-xl border p-4">
            <p className="text-muted-foreground text-center text-sm">
              <span className="text-primary font-semibold">Pro Tip:</span> Upgrade to Premium to
              unlock exclusive features and boost your social presence!
            </p>
          </div>
        </div>
      }
    />
  );
};

export default FeaturesModal;
