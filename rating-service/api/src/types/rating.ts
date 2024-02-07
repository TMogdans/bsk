export type RatingMessage = {
  meta: {
    producer: string;
    version: string;
  };
  payload: {
    object_id: string;
    user_id: string;
    material_quality: number;
    layout: number;
    complexity: number;
    difficulty: number;
    fun: number;
    variety: number;
    replayability: number;
  };
};

export type Config = {
  id: string;
  name: string;
  weight: number;
  order: number;
};
