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
        <div className="w-full px-2 pb-6 md:px-4">
          {/* Toggle Annual/Monthly */}
          <div className="mb-6 flex items-center justify-center gap-2 md:mb-8 md:gap-3">
            <button
              onClick={() => setIsAnnual(false)}
              className={cn(
                "rounded-full px-4 py-1.5 text-xs font-medium transition-all duration-200 md:px-6 md:py-2 md:text-sm",
                !isAnnual
                  ? "bg-primary text-white"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}>
              Monthly
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={cn(
                "relative rounded-full px-4 py-1.5 text-xs font-medium transition-all duration-200 md:px-6 md:py-2 md:text-sm",
                isAnnual
                  ? "bg-primary text-white"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}>
              Annual
              <span className="absolute -top-2 -right-2 rounded-full bg-green-500 px-1.5 py-0.5 text-[10px] whitespace-nowrap text-white md:px-2 md:text-xs">
                Best Value
              </span>
            </button>
          </div>

          {/* Desktop: 3 Cards Side by Side */}
          <div className="mx-auto hidden max-w-[950px] gap-4 md:grid md:grid-cols-3">
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
          <div className="relative mx-auto max-w-[340px] md:hidden">
            <div className="overflow-hidden px-8">
              <div
                className="flex transition-transform duration-300 ease-in-out"
                style={{ transform: `translateX(-${currentCardIndex * 100}%)` }}>
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
              className="border-border bg-background/90 hover:bg-muted absolute top-1/2 left-0 z-10 -translate-y-1/2 rounded-full border p-2 shadow-lg backdrop-blur-sm transition-colors"
              aria-label="Previous plan">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={nextCard}
              className="border-border bg-background/90 hover:bg-muted absolute top-1/2 right-0 z-10 -translate-y-1/2 rounded-full border p-2 shadow-lg backdrop-blur-sm transition-colors"
              aria-label="Next plan">
              <ChevronRight className="h-5 w-5" />
            </button>

            {/* Dots Indicator */}
            <div className="mt-6 flex justify-center gap-2">
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

const PricingCard: React.FC<PricingCardProps> = ({
  plan,
  isAnnual,
  loading,
  onSubscribe,
  isMobile = false,
}) => {
  const price = isAnnual ? plan.priceAnnual : plan.priceMonthly;
  const period = isAnnual ? "/year" : "/month";

  return (
    <div
      className={cn(
        "relative flex h-full flex-col gap-3 rounded-2xl border transition-all duration-200",
        isMobile ? "p-4" : "p-6",
        plan.isPopular
          ? "border-primary shadow-primary/20 shadow-lg md:scale-105"
          : "border-border hover:border-primary/50"
      )}>
      {/* Popular Badge */}
      {plan.isPopular && (
        <div className="bg-primary absolute -top-3 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-full px-3 py-1 text-xs text-white">
          <Check className="h-3 w-3" />
          <span>Best Value</span>
        </div>
      )}

      {/* Plan Name */}
      <div>
        <h3 className={cn("font-semibold", isMobile ? "text-lg" : "text-xl")}>{plan.typeName}</h3>
        {isAnnual && plan.savePercent !== "0%" && (
          <span className="text-xs font-medium text-green-500">SAVE {plan.savePercent}</span>
        )}
      </div>

      {/* Price */}
      <div className="flex items-baseline gap-1">
        <span className={cn("font-bold", isMobile ? "text-3xl" : "text-4xl")}>${price}</span>
        <span className="text-muted-foreground text-sm">{period}</span>
      </div>

      {/* Description */}
      <p className={cn("text-muted-foreground", isMobile ? "text-xs" : "text-sm")}>
        {plan.description}
      </p>

      {/* Features */}
      <div className="flex-1">
        {plan.highlightFeature && (
          <p className={cn("mb-2 font-medium", isMobile ? "text-xs" : "text-sm")}>
            {plan.highlightFeature}
          </p>
        )}
        <ul className={cn("space-y-1.5", isMobile && "space-y-1")}>
          {plan.features.map((feature: string, index: number) => (
            <li
              key={index}
              className={cn("flex items-start gap-2", isMobile ? "text-xs" : "text-sm")}>
              <Check
                className={cn(
                  "text-primary mt-0.5 flex-shrink-0",
                  isMobile ? "h-3 w-3" : "h-4 w-4"
                )}
              />
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        {/* Badge Features (Premium+) */}
        {plan.badge && (
          <div
            className={cn(
              "mt-3 rounded-lg border border-purple-500/20 bg-gradient-to-r from-purple-500/10 to-blue-500/10",
              isMobile ? "p-2" : "p-3"
            )}>
            <div className="mb-1.5 flex items-center gap-2">
              <Sparkles className={cn("text-purple-500", isMobile ? "h-3 w-3" : "h-4 w-4")} />
              <span className={cn("font-semibold", isMobile ? "text-xs" : "text-sm")}>
                {plan.badge}
              </span>
            </div>
            <ul className="space-y-1">
              {plan.badgeFeatures.map((feature: string, index: number) => (
                <li key={index} className="text-muted-foreground flex items-start gap-2 text-xs">
                  <Check className="mt-0.5 h-3 w-3 flex-shrink-0 text-purple-500" />
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
        className="mt-2 w-full"
        size={isMobile ? "sm" : "default"}
        disabled={loading}
        onClick={() => onSubscribe(plan.typeName)}>
        {loading && <Spinner size="default" />}
        Subscribe & Pay
      </Button>
    </div>
  );
};

export default ProModal;
