import { IsEmail, IsEmpty, Length } from "class-validator";

export class CreateCustomerInputs {
  @IsEmail()
  email: string;

  @Length(10)
  phone: string;

  @Length(6, 12)
  password: string;
}

export class CustomerLoginInputs {
  @IsEmail()
  email: string;

  @Length(6, 12)
  password: string;
}

export class CustomerUpdateInputs {
  @Length(3, 16)
  firstName: string;

  @Length(3, 16)
  lastName: string;

  @Length(6, 16)
  address: string;
}

export interface CustomerPayload {
  _id: string;
  email: string;
  verified: boolean;
}

export class OrderInputs {
  _id: string;
  unit: string;
}
