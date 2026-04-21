//! DTO = Data Transfer Object

//! It defines exact structure of request
export interface UserRegisterDTO {
  name: string;
  username: string;
  email: string;
  password: string;
}

export interface UserLoginDTO {
  email: string;
  password: string;
}
