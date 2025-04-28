


export type Language = { en: string; kn: string };

export interface UserSearchQuery {
  page: number;
  limit: number;
  role?: "admin" | "user" | "dantasurakshaks" | "super-admin";
  user: Users;
}

export interface Users {
  _id: string;
  name: string;
  email?: string;
  phoneNumber?: number;
  password?: string;
  role: "admin" | "user" | "dantasurakshaks" | "super-admin";
  status: string;
  isVerified: boolean
}

export interface PaginatedUsersResponse {
  users: Users[];
  total: number;
  page: number;
  limit: number;
  roles: {
    admin: number;
    user: number;
    ambassador: number;
    [key: string]: number;
  };
}

export interface GetUsersQueryParams {
  page?: number;
  limit?: number;
  role?: "admin" | "user" | "dantasurakshaks" | "super-admin";
}

export interface SBody {
  image: string;
  text: Language;
  description: Language;
  _id?: string;
}

export interface Slide {
  data: any;
  sliderImage: string;
  text: Language;
  description: Language;
  body: SBody[];
  _id: string;
}

export interface SliderResponse {
  result: Slide[];
  total: number;
  page: number;
  limit: number;
}

export interface GetSlidersQueryParams {
  page?: number;
  limit?: number;
  lang?: string;
}

export interface DentalCaries {
  en: string; kn: string

}

export interface FaqsWrongFacts {
  en: string; kn: string

}
export interface FaqsRightFacts {
  en: string; kn: string
}

export interface Faqs {
  _id: string,
  myth_fact_image: string,
  myth_fact_title: Language,
  myth_fact_body: Language,
  myth_fact_heading: Language,
  myth_fact_description: Language,
  myths_facts_wrong_fact: [FaqsWrongFacts]
  myths_facts_right_fact: [FaqsRightFacts]
  createdAt: Date,
  updatedAt: Date,
  __v: number
}

export interface CategoryType {
  _id: string,
  categoryImage: string,
  title: Language,
  createdAt: Date,
  updatedAt: Date,
}

export interface Lesion {
  _id: string;
  fullname?: string;
  age?: number;
  gender?: string;
  contact_number?: string;
  location?: string;
  symptoms?: string[] | string;
  disease_time?: number | string;
  existing_habits?: string;
  previous_dental_treatement?: string[] | string;
  submitted_by?: string;
  send_to?: string[];
  dental_images?: string[];
  status?: string,
  adminAction?: boolean
}

export interface ConfirmationPageParams {
  recordType: string;
  action: string;
  id: string;
  redirectUrl?: string;
}

export interface QuestionnaireTypes {
  demographics?: string;
  name?: string;
  age?: number;
  gender?: string;
  bloodGroup?: string;
  idCardAvailable?: string;
  cardNumber?: string;
  religion?: string;
  religion_input?: string;
  education?: string;
  occupation?: string;
  income?: number;
  phoneNumber?: string;
  address?: string;
  familyHistory?: string;
  firstDegreeRelativeOralCancer?: string
  height?: number;
  diabetes?: string
  hypertension?: string;
  dietHistory?: string;
  fruitsConsumption?: string;
  vegetableConsumption?: string;
  habitHistory?: string;
  tobaccoChewer?: string;
  tobaccoType?: string;
  discontinuedHabit?: string;
  durationOfDiscontinuingHabit?: string;
  otherConsumptionHistory?: string;
  alcoholConsumption?: string;
  smoking?: string;
  oralCavityExamination?: string;
  presenceOfLesion?: string;
  reductionInMouthOpening?: string;
  suddenWeightLoss?: string;
  presenceOfSharpTeeth?: string;
  presenceOfDecayedTeeth?: string;
  presenceOfFluorosis?: string;
  presenceOfGumDisease?: string[];
  [key: string]: unknown;
  questionary_type?: string;
  diagnosis_notes?: string;
  recomanded_actions?: string;
  comments_or_notes?: string;
  send_email_to_dantasurakshaks?: boolean
}

export interface WhatIsDiseaseDescriptionRepeater {
  what_is_disease_heading_repeat: Language;
  what_is_disease_description_repeat: Language;
}

export interface WhatIsDiseaseRepeat {
  what_is_disease_repeat_images: File[] | null | string[];
  what_is_disease_heading: Language;
  what_is_disease_disease_repeat_icon: File | null | string;
  what_is_disease_disease_repeat_description: Language;
  what_is_disease_description_repeater: WhatIsDiseaseDescriptionRepeater[];
}

export interface CauseRepeat {
  cause_repeat_title: Language;
  cause_repeat_description: Language;
  cause_repeat_icon: File | null | string;
}

export interface Cause {
  cause_title: Language;
  cause_icon: File | null | string;
  cause_para: Language;
  cause_brief: Language;
  cause_repeat: CauseRepeat[];
}

export interface SymptomRepeat {
  symptoms_repeat_title: Language;
  symptoms_repeat_description: Language;
  symptoms_repeat_icon: File | null | string;
}

export interface Symptom {
  symptoms_title: Language;
  symptoms_icon: File | null | string;
  symptoms_para: Language;
  symptoms_brief: Language;
  symptoms_repeat: SymptomRepeat[];
}

export interface PreventionTipRepeat {
  prevention_tips_repeat_title: Language;
  prevention_tips_repeat_description: Language;
  prevention_tips_repeat_icon: File | null | string;
}

export interface PreventionTip {
  prevention_tips_title: Language;
  prevention_tips_icon: File | null | string;
  prevention_tips_para: Language;
  prevention_tips_brief: Language;
  prevention_tips_repeat: PreventionTipRepeat[];
}

export interface TreatmentOptionRepeat {
  treatment_option_repeat_title: Language;
  treatment_option_repeat_description: Language;
  treatment_option_repeat_icon: File | null | string;
}

export interface TreatmentOption {
  treatment_option_title: Language;
  treatment_option_icon: File | null | string;
  treatment_option_para: Language;
  treatment_option_brief: Language;
  treatment_option_repeat: TreatmentOptionRepeat[];
}

export interface DiseaseTypes {
  _id: string;
  disease_main_title: Language;
  disease_main_image: string;
  disease_slug: Language;
  disease_title: Language;
  disease_description: Language;
  disease_icon: string;
  what_is_disease_tab_title: Language;
  what_is_disease_repeat: WhatIsDiseaseRepeat[];
  common_cause_tab_title: Language;
  common_cause: Cause[];
  symptoms_tab_title: Language;
  symptoms: Symptom[];
  prevention_tips_tab_title: Language;
  prevention_tips: PreventionTip[];
  treatment_option_tab_title: Language;
  treatment_option: TreatmentOption[];
  category: string
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface MythOrFactItem {
  para: Language;
  icon: string;
}

export interface CategoryDiseaseTypes {
  _id: string;
  disease_main_title: Language;
  disease_main_image: string;
  disease_slug: Language;
}
export interface FeatureSchema {
  _id: string
  categoryImage: string
  feature_main_title: Language;
  feature_slug: Language;
  feature_main_image?: string;
  feature_inner_title: Language;
  feature_inner_description: Language;
  feature_inner_image?: string;
  feature_myth_facts_title: Language;
  feature_myth_facts_description: Language;
  feature_myths: MythOrFactItem[];
  feature_facts: MythOrFactItem[];
  diseases: CategoryDiseaseTypes[]
  createdAt: Date;
  updatedAt: Date;
  __v: number
}

export interface RegisterEmailData {
  role: string;
  name: string;
  email: string;
  phoneNumber: string;
}

export interface RegisterVerificationEmailData {
  name: string;
  email: string;
}

export interface LesionEmailData {
  _id: string;
  lesion_type?: string;
  diagnosis_notes?: string;
  recomanded_actions?: string;
  comments_or_notes?: string;
  questionary_type?: string
}

export interface QuestionnaireEmailData {
  [key: string]: unknown;
}

export type EmailData =
  | RegisterEmailData
  | RegisterVerificationEmailData
  | LesionEmailData
  | QuestionnaireEmailData;




// FaqTypes
export interface FaqsQuestion {
  question: { en: string; kn: string };
  answer: { en: string; kn: string };
}
export interface FaqTypes {
  _id: string;
  dental_caries_title: Language;
  dental_caries: FaqsQuestion[];
  gum_diseases_title: Language;
  gum_disease: FaqsQuestion[];
  edentulism_title: Language;
  edentulism: FaqsQuestion[];
  oral_cancer_title: Language;
  oral_cancer: FaqsQuestion[];
  createdAt?: Date;
  updatedAt?: Date;
}

// TextSlide
export interface TextSlide {
  [lang: string]: string;
}

export interface TextSlideType {
  _id: string;
  slider_text: TextSlide;
  createdAt?: Date;
  updatedAt?: Date;
}


// habit health

export interface HabitHealthRepeaterItem {
  habit_health_suggesion_para: Language;
  habit_health_suggesion_icon: string;
}

export interface BadHabitsRepeaterItem {
  bad_habits_repeater_heading: Language;
  bad_habits_repeater_description: Language;
  bad_habits_repeater_icon: string;
}
export interface ImproveHabitsRepeaterItem {
  improve_habits_repeater_heading: Language;
  improve_habits_repeater_description: Language;
  improve_habits_repeater_icon: string;
}
export interface IHabitHealthTypes {
  _id: string;
  habits_health_main_title: Language;
  habits_health_main_image: string;
  habits_health_heading: Language;
  habits_health_para: Language;
  habits_health_icon: string;
  habit_health_inner_title: Language;
  habit_health_inner_repeater: HabitHealthRepeaterItem[];
  bad_habits_health_title: Language;
  bad_habits_health_para: Language;
  bad_habits_health_icon: string;
  bad_habits_health_repeater: BadHabitsRepeaterItem[];
  improve_health_habits_title: Language;
  improve_health_habits_description: Language;
  improve_health_habits_icon: string;
  improve_habits_health_repeater: ImproveHabitsRepeaterItem[];
  createdAt: Date;
  updatedAt: Date;
}


// dental emergency repeater

export interface DentalEmerDescriptionRepeater {
  denatl_emer_tab_heading: Language;
  denatl_emer_tab_paragraph: Language;
}

export interface DentalEmerRepeater {
  dental_emer_tab_title: Language;
  denatl_emer_description_repeater: DentalEmerDescriptionRepeater[];
}
export interface DentalEmergencyTypes {
  _id: string;
  dental_emergency_title: Language;
  dental_emergency_image: string;
  dental_emergency_heading: Language;
  dental_emergency_para: Language;
  dental_emergency_icon: string;
  dental_emergency_inner_title: Language;
  dental_emergency_inner_para: Language;
  dental_emergency_inner_icon: string;
  dental_emer_title: Language;
  dental_emer_sub_title: Language;
  dental_emer_repeater: DentalEmerRepeater[];
  createdAt: Date;  
  updatedAt: Date;  
  __v: number;
}















