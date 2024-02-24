export type RatingCreatedMessage = {
  message: string;
  meta: {
    producer: string;
    version: string;
  };
  payload: {
    object_id: string;
    user_id: string;
  };
};
