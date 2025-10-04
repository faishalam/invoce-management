export type TInputLogin = {
  password: string;
  email: string;
};

export type TLoginResponse = {
  access_token: string;
  role: string;
};

export type TInputRegister = {
  username: string;
  email: string;
  password: string;
};

export type TRegisterResponse = {
  id: string;
  access_token: string;
  role: string;
  username: string;
};

export type TUserLoggedInResponse = {
  email: string;
  username: string;
  role: string;
};
