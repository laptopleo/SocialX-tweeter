import React from "react";
import { useStore } from "@/hooks/useStore";
import Modal from "../modal";
import { Code2, Rocket, Target, Award, Globe, Lock } from "lucide-react";

const AboutModal = () => {
  const { isAboutModalOpen, onCloseAboutModal } = useStore();

  const stats = [
    { label: "Active Users", value: "10K+", icon: <Globe className="h-5 w-5" /> },
    { label: "Posts Created", value: "50K+", icon: <Rocket className="h-5 w-5" /> },
    { label: "Uptime", value: "99.9%", icon: <Target className="h-5 w-5" /> },
    { label: "Security Rating", value: "A+", icon: <Lock className="h-5 w-5" /> },
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
          <div className="mx-auto mb-8 max-w-[550px]">
            <div className="mb-4 flex items-center justify-center gap-2">
              <Award className="text-primary h-8 w-8" />
              <h3 className="text-xl font-bold">Our Mission</h3>
            </div>
            <p className="text-muted-foreground text-center leading-relaxed">
              To create a safe, fast, and engaging social platform where creators and communities
              can connect, share, and grow together. Built with modern technology and a focus on
              user experience.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="mx-auto mb-8 grid max-w-[550px] grid-cols-2 gap-4 md:grid-cols-4">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="border-border bg-card hover:border-primary/50 flex flex-col items-center gap-2 rounded-xl border p-4 transition-all duration-200">
                <div className="text-primary">{stat.icon}</div>
                <div className="text-primary text-2xl font-bold">{stat.value}</div>
                <div className="text-muted-foreground text-center text-xs">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Tech Stack */}
          <div className="mx-auto max-w-[550px]">
            <div className="mb-4 flex items-center justify-center gap-2">
              <Code2 className="text-primary h-6 w-6" />
              <h3 className="text-lg font-semibold">Built With</h3>
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              {techStack.map((tech, index) => (
                <span
                  key={index}
                  className="border-primary/20 bg-primary/10 text-primary hover:bg-primary/20 rounded-full border px-3 py-1.5 text-sm transition-colors duration-200">
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Footer Note */}
          <div className="border-primary/20 from-primary/10 mx-auto mt-8 max-w-[550px] rounded-xl border bg-gradient-to-r to-purple-500/10 p-4">
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
