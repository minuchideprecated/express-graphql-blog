import { IsEmail, Length } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import User from '../entities/User';

@InputType()
export class createUserInput implements Partial<User> {
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
