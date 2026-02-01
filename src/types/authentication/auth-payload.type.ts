export type GuestSigupPayload = {
  userId: string;
  username: string;
  password: string;
  message: string;
};

export type SuccessPayload = {
  ok: boolean;
  message?: string;
};
