import React from "react";
import { PLAN_TYPE, PRICING_CARDS } from "@/constants/pricing-plans";
import { CheckCircle2 } from "lucide-react";
import Section from "../section-label";
import UpgradeCard from "./upgrade-card";
import Image from "next/image";
import { checkUserSubscription } from "@/app/actions/subcription";
import SubscriptionButton from "./subscription-button";

const BillingSettings = async () => {
  const plan = await checkUserSubscription();
  const planFeatures = PRICING_CARDS.find(
    (card) => card.planType.toUpperCase() === plan?.toUpperCase()
  )?.features;

  if (!planFeatures) return;
  return (
    <div className="w-full px-4 pt-5">
      <div>
        <Section
          label="Billing settings"
          message="Add payment information, upgrade and modify your plan."
        />
      </div>
      <div className="mt-4 flex justify-start gap-2 lg:justify-center">
        {plan && plan === PLAN_TYPE.FREE ? (
          <UpgradeCard />
        ) : plan && plan === PLAN_TYPE.PRO ? (
          <div className="*: relative h-[220px] w-full max-w-[350px]">
            <Image
              src="/assets/creditcard.png"
              width={400}
              height={400}
              alt="Pro Plan"
              className="h-full w-full"
            />
            <div className="w-ful absolute inset-0 left-0 top-0 flex h-full items-center justify-center rounded-lg bg-black/20">
              <SubscriptionButton />
            </div>
          </div>
        ) : null}

        <div className="lg:col-span-2">
          <h3 className="mb-2 text-xl font-semibold">Current Plan</h3>
          <p className="text-sm font-semibold">{plan}</p>
          <div className="gap- mt-2 flex flex-col">
            {planFeatures.map((feature) => (
              <div key={feature} className="flex gap-2">
                <CheckCircle2 className="text-muted-foreground" />
                <p className="text-muted-foreground">{feature}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillingSettings;
