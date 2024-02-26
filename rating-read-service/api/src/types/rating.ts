export type SingleRating = {
  userId: string;
  objectId: string;
  value: number;
  createdAt: string;
  config: RatingConfig;
};

export type RatingConfig = {
  name: string;
  weight: number;
};

export type RatingBody = {
  userId: string;
  objectId: string;
  createdAt: string;
  total: number;
  weightedTotal: number;
  normalizedTotal: number;
  ratings: RatingValue[];
};
 export type RatingValue = RatingConfig & {
    value: number;
    weighted: number;
 }
