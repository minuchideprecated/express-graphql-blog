import { IsEmail, Length } from 'class-validator';
import { Field, InputType, ObjectType } from 'type-graphql';
import User from '../entities/User';

@ObjectType()
export class SignInResponse {
  @Field()
  accessToken: string;
}

@InputType()
export class SignInInput implements Partial<User> {
  @Field()
  email: string;

  @Field()
  password: string;
}

@InputType()
export class CreateUserInput implements Partial<User> {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  @Length(8, 30)
  password: string;

  @Field({ nullable: true })
  @Length(4, 20)
  nickname?: string;
}
