import React from "react";
import { useStore } from "@/hooks/useStore";
import Modal from "../modal";
import { Code2, Rocket, Target, Award, Globe, Lock } from "lucide-react";

const AboutModal = () => {
  const { isAboutModalOpen, onCloseAboutModal } = useStore();

  const stats = [
    { label: "Active Users", value: "10K+", icon: <Globe className="w-5 h-5" /> },
    { label: "Posts Created", value: "50K+", icon: <Rocket className="w-5 h-5" /> },
    { label: "Uptime", value: "99.9%", icon: <Target className="w-5 h-5" /> },
    { label: "Security Rating", value: "A+", icon: <Lock className="w-5 h-5" /> },
  ];

  const techStack = [
    "Next.js 15",
    "TypeScript",
    "Prisma ORM",
    "PostgreSQL",
    "NextAuth",
    "Stripe",
    "Redis Cache",
    "Tailwind CSS",
  ];

  return (
    <Modal
      title="About SocialX"
      subTitle="A modern social platform built with cutting-edge technology and best practices."
      isCentered
      isOpen={isAboutModalOpen}
      onClose={onCloseAboutModal}
      body={
        <div className="w-full px-6 pb-4">
          {/* Mission Statement */}
          <div className="max-w-[550px] mx-auto mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Award className="w-8 h-8 text-primary" />
              <h3 className="text-xl font-bold">Our Mission</h3>
            </div>
            <p className="text-center text-muted-foreground leading-relaxed">
              To create a safe, fast, and engaging social platform where creators 
              and communities can connect, share, and grow together. Built with 
              modern technology and a focus on user experience.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-[550px] mx-auto mb-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="flex flex-col items-center gap-2 p-4 rounded-xl 
                  border border-border bg-card hover:border-primary/50 
                  transition-all duration-200"
              >
                <div className="text-primary">{stat.icon}</div>
                <div className="text-2xl font-bold text-primary">{stat.value}</div>
                <div className="text-xs text-muted-foreground text-center">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Tech Stack */}
          <div className="max-w-[550px] mx-auto">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Code2 className="w-6 h-6 text-primary" />
              <h3 className="text-lg font-semibold">Built With</h3>
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
              {techStack.map((tech, index) => (
                <span
                  key={index}
                  className="px-3 py-1.5 text-sm rounded-full 
                    bg-primary/10 text-primary border border-primary/20
                    hover:bg-primary/20 transition-colors duration-200"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Footer Note */}
          <div className="mt-8 p-4 rounded-xl bg-gradient-to-r from-primary/10 to-purple-500/10 
            border border-primary/20 max-w-[550px] mx-auto">
            <p className="text-center text-sm">
              <span className="font-semibold">🚀 Portfolio Project</span>
              <br />
              <span className="text-muted-foreground">
                Showcasing modern web development practices, security, and performance optimization.
              </span>
            </p>
          </div>
        </div>
      }
    />
  );
};

export default AboutModal;
