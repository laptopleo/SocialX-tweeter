export enum PLAN_TYPE {
    FREE = "FREE",
    BASIC = "BASIC",
    PRO = "PRO",
    PREMIUM_PLUS = "PREMIUM_PLUS",
  }
  
  export enum DURATION_TYPE {
    MONTHLY = "MONTHLY",
    ANNUAL = "ANNUAL",
  }
  
  export const PRICING_CARDS = [
    // Basic Plan
    {
      planType: PLAN_TYPE.BASIC,
      duration: DURATION_TYPE.MONTHLY,
      typeName: "Basic",
      priceMonthly: "7.20",
      priceAnnual: "72.00",
      savePercent: "16%",
      description: "Essential features for casual users",
      highlightFeature: "",
      features: [
        "Small reply boost",
        "Bookmark folders",
        "Highlights tab",
        "Edit post",
        "Longer posts",
      ],
      isPopular: false,
    },
    // Premium Plan (Most Popular)
    {
      planType: PLAN_TYPE.PRO,
      duration: DURATION_TYPE.MONTHLY,
      typeName: "Premium",
      priceMonthly: "18.30",
      priceAnnual: "183.00",
      savePercent: "16%",
      description: "Everything in Basic, and",
      highlightFeature: "Everything in Basic, and",
      features: [
        "Half Ads in For You and Following",
        "Larger reply boost",
        "Get paid to post",
        "Checkmark",
        "Grok with increased limits",
        "X Pro, Analytics, Media Studio",
        "Creator Subscriptions",
      ],
      isPopular: true,
    },
    // Premium+ Plan
    {
      planType: PLAN_TYPE.PREMIUM_PLUS,
      duration: DURATION_TYPE.MONTHLY,
      typeName: "Premium+",
      priceMonthly: "136.08",
      priceAnnual: "1360.80",
      savePercent: "0%",
      description: "Everything in Premium, and",
      highlightFeature: "Everything in Premium, and",
      features: [
        "Fully ad-free",
        "Largest reply boost",
        "Write Articles",
        "Radar",
      ],
      badge: "SuperGrok",
      badgeFeatures: [
        "Highest usage limits",
        "Early access to new features",
      ],
      isPopular: false,
    },
  ];
  
  export const BASIC_PLAN = PRICING_CARDS[0];
  export const PRO_PLAN = PRICING_CARDS[1];
  export const PREMIUM_PLUS_PLAN = PRICING_CARDS[2];