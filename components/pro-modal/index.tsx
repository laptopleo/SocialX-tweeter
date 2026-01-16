"use client";
import React, { useState } from "react";
import { useStore } from "@/hooks/useStore";
import Modal from "../modal";
import { Check, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { Button } from "../ui/button";
import axios from "axios";
import { BASE_URL } from "@/lib/base-url";
import { toast } from "@/hooks/use-toast";
import { Spinner } from "../spinner";
import { PRICING_CARDS, DURATION_TYPE } from "@/constants/pricing-plans";
import { cn } from "@/lib/utils";

const ProModal = () => {
  const { isProModalOpen, onCloseProModal } = useStore();
  const [loading, setLoading] = React.useState(false);
  const [isAnnual, setIsAnnual] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(1); // Start with Premium (middle card)

  const onSubscribe = async (planName: string) => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/api/stripe`);
      console.log(response, "response:");
      if (response.data.url && typeof window !== "undefined") {
        window.location.href = response.data.url;
      } else {
        toast({
          title: "Error",
          description: "Stripe session URL not found",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Error",
        description: `An error occurred while processing your subscription. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (loading) return;
    onCloseProModal();
  };

  const nextCard = () => {
    setCurrentCardIndex((prev) => (prev + 1) % PRICING_CARDS.length);
  };

  const prevCard = () => {
    setCurrentCardIndex((prev) => (prev - 1 + PRICING_CARDS.length) % PRICING_CARDS.length);
  };

  return (
    <Modal
      title="Upgrade to Premium"
      subTitle="Enjoy an enhanced experience, exclusive creator tools, top-tier verification and security."
      isCentered
      isOpen={isProModalOpen}
      onClose={handleClose}
      body={
        <div className="w-full px-2 md:px-4 pb-6">
          {/* Toggle Annual/Monthly */}
          <div className="flex items-center justify-center gap-2 md:gap-3 mb-6 md:mb-8">
            <button
              onClick={() => setIsAnnual(false)}
              className={cn(
                "px-4 md:px-6 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-medium transition-all duration-200",
                !isAnnual
                  ? "bg-primary text-white"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={cn(
                "px-4 md:px-6 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-medium transition-all duration-200 relative",
                isAnnual
                  ? "bg-primary text-white"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              Annual
              <span className="absolute -top-2 -right-2 bg-green-500 text-white text-[10px] md:text-xs px-1.5 md:px-2 py-0.5 rounded-full whitespace-nowrap">
                Best Value
              </span>
            </button>
          </div>

          {/* Desktop: 3 Cards Side by Side */}
          <div className="hidden md:grid md:grid-cols-3 gap-4 max-w-[950px] mx-auto">
            {PRICING_CARDS.map((plan, index) => (
              <PricingCard
                key={plan.planType}
                plan={plan}
                isAnnual={isAnnual}
                loading={loading}
                onSubscribe={onSubscribe}
              />
            ))}
          </div>

          {/* Mobile: Carousel with Chevrons */}
          <div className="md:hidden relative max-w-[340px] mx-auto">
            <div className="overflow-hidden px-8">
              <div
                className="flex transition-transform duration-300 ease-in-out"
                style={{ transform: `translateX(-${currentCardIndex * 100}%)` }}
              >
                {PRICING_CARDS.map((plan) => (
                  <div key={plan.planType} className="w-full flex-shrink-0">
                    <PricingCard
                      plan={plan}
                      isAnnual={isAnnual}
                      loading={loading}
                      onSubscribe={onSubscribe}
                      isMobile
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Chevron Navigation */}
            <button
              onClick={prevCard}
              className="absolute left-0 top-1/2 -translate-y-1/2 
                bg-background/90 backdrop-blur-sm border border-border rounded-full p-2 shadow-lg
                hover:bg-muted transition-colors z-10"
              aria-label="Previous plan"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextCard}
              className="absolute right-0 top-1/2 -translate-y-1/2 
                bg-background/90 backdrop-blur-sm border border-border rounded-full p-2 shadow-lg
                hover:bg-muted transition-colors z-10"
              aria-label="Next plan"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Dots Indicator */}
            <div className="flex justify-center gap-2 mt-6">
              {PRICING_CARDS.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentCardIndex(index)}
                  className={cn(
                    "h-2 rounded-full transition-all duration-200",
                    currentCardIndex === index
                      ? "bg-primary w-6"
                      : "bg-muted hover:bg-muted-foreground/50 w-2"
                  )}
                  aria-label={`Go to plan ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      }
    />
  );
};

// Pricing Card Component
interface PricingCardProps {
  plan: any;
  isAnnual: boolean;
  loading: boolean;
  onSubscribe: (planName: string) => void;
  isMobile?: boolean;
}

const PricingCard: React.FC<PricingCardProps> = ({ plan, isAnnual, loading, onSubscribe, isMobile = false }) => {
  const price = isAnnual ? plan.priceAnnual : plan.priceMonthly;
  const period = isAnnual ? "/year" : "/month";

  return (
    <div
      className={cn(
        "flex flex-col gap-3 border rounded-2xl relative transition-all duration-200 h-full",
        isMobile ? "p-4" : "p-6",
        plan.isPopular
          ? "border-primary shadow-lg shadow-primary/20 md:scale-105"
          : "border-border hover:border-primary/50"
      )}
    >
      {/* Popular Badge */}
      {plan.isPopular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-xs px-3 py-1 rounded-full flex items-center gap-1">
          <Check className="w-3 h-3" />
          <span>Best Value</span>
        </div>
      )}

      {/* Plan Name */}
      <div>
        <h3 className={cn("font-semibold", isMobile ? "text-lg" : "text-xl")}>{plan.typeName}</h3>
        {isAnnual && plan.savePercent !== "0%" && (
          <span className="text-xs text-green-500 font-medium">SAVE {plan.savePercent}</span>
        )}
      </div>

      {/* Price */}
      <div className="flex items-baseline gap-1">
        <span className={cn("font-bold", isMobile ? "text-3xl" : "text-4xl")}>${price}</span>
        <span className="text-sm text-muted-foreground">{period}</span>
      </div>

      {/* Description */}
      <p className={cn("text-muted-foreground", isMobile ? "text-xs" : "text-sm")}>{plan.description}</p>

      {/* Features */}
      <div className="flex-1">
        {plan.highlightFeature && (
          <p className={cn("font-medium mb-2", isMobile ? "text-xs" : "text-sm")}>{plan.highlightFeature}</p>
        )}
        <ul className={cn("space-y-1.5", isMobile && "space-y-1")}>
          {plan.features.map((feature: string, index: number) => (
            <li key={index} className={cn("flex gap-2 items-start", isMobile ? "text-xs" : "text-sm")}>
              <Check className={cn("text-primary mt-0.5 flex-shrink-0", isMobile ? "w-3 h-3" : "w-4 h-4")} />
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        {/* Badge Features (Premium+) */}
        {plan.badge && (
          <div className={cn("mt-3 rounded-lg bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20", isMobile ? "p-2" : "p-3")}>
            <div className="flex items-center gap-2 mb-1.5">
              <Sparkles className={cn("text-purple-500", isMobile ? "w-3 h-3" : "w-4 h-4")} />
              <span className={cn("font-semibold", isMobile ? "text-xs" : "text-sm")}>{plan.badge}</span>
            </div>
            <ul className="space-y-1">
              {plan.badgeFeatures.map((feature: string, index: number) => (
                <li key={index} className="flex gap-2 items-start text-xs text-muted-foreground">
                  <Check className="w-3 h-3 text-purple-500 mt-0.5 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Subscribe Button */}
      <Button
        variant={plan.isPopular ? "brandPrimary" : "outline"}
        className="w-full mt-2"
        size={isMobile ? "sm" : "default"}
        disabled={loading}
        onClick={() => onSubscribe(plan.typeName)}
      >
        {loading && <Spinner size="default" />}
        Subscribe & Pay
      </Button>
    </div>
  );
};

export default ProModal;
