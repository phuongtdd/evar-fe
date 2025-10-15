export interface loginPayload{
    identifier: string;
    password: string;
}

export interface registerPayload {
  user: {
    username: string;
    email: string;
    password: string;
  };
  person: {
    firstName: string;
    lastName: string;
  };
}
