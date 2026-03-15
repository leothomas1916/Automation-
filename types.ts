
export type PostType = 
  | 'weekly_plan'
  | 'monthly_plan'
  | 'screen_repair'
  | 'battery_issue'
  | 'water_damage'
  | 'laptop_slow'
  | 'iphone_special'
  | 'review_highlight'
  | 'limited_offer'
  | 'brand_awareness'
  | 'gbp_offer'
  | 'gbp_event'
  | 'gbp_update'
  | 'seo_schema';

export type GMBApiType = 'OFFER' | 'EVENT' | 'STANDARD' | 'WHAT_NEW';

export type MicroLocation = 
  | 'Indiranagar' 
  | 'Koramangala' 
  | 'HSR Layout' 
  | 'Marathahalli' 
  | 'Whitefield' 
  | 'Electronic City' 
  | 'JP Nagar' 
  | 'Halasuru' 
  | 'Bangalore General';

export interface PostOptions {
  type: PostType;
  location: MicroLocation;
  month: string;
  startDate: string;
  offerDetails?: string;
  batchSize?: number;
}

export interface WeeklyPost {
  day: string;
  date: string; // Specific date for scheduling
  topic: string;
  content: string;
  imagePrompt: string;
  offerValue: string;
  promoCode: string;
  validUntil: string;
  gmbApiType: GMBApiType; // For direct API automation
  status?: 'draft' | 'scheduled' | 'published';
}

export interface GeneratedContent {
  textContent: string;
  imagePrompt: string;
  weeklyPosts?: WeeklyPost[];
  location?: string;
  campaignContext?: string;
  schemaMarkup?: string;
}
