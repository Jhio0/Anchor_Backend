export interface SignupInput {
  name: string;
  email: string;
  password: string;
  dateOfBirth: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface CurrentUser {
  userId: string;
}

export interface AuthPayload {
  sessionId: string;
  user: {
    id: string;
    name: string;
    email: string;
    dateOfBirth: string;
  };
}

export interface AuthProviderPort {
  signup(input: SignupInput): Promise<AuthPayload>;

  login(input: LoginInput): Promise<AuthPayload>;

  getCurrentUser(sessionId: string): Promise<CurrentUser | null>;
}
