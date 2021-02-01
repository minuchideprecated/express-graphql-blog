import { Arg, Mutation, Resolver } from 'type-graphql';
import User from '../entities/User';
import { CreateUserInput, SignInInput, SignInResponse } from '../types/userInput';
import { createAccessToken } from '../utils/jwt';

@Resolver()
export class UserResolver {
  @Mutation(() => SignInResponse)
  async signIn(@Arg('data') data: SignInInput): Promise<SignInResponse> {
    try {
      const { email, password } = data;
      const user = await User.findOne({ email });
      if (user == null) {
        throw new Error('invalid_password');
      }

      const isCorrect = await user.verifyPassword(password);
      if (isCorrect === false) {
        throw new Error('invalid_password');
      }

      const accessToken = createAccessToken(user.id);

      return { accessToken };
    } catch (err) {
      return err;
    }
  }

  @Mutation(() => Boolean)
  async createUser(@Arg('data') data: CreateUserInput): Promise<boolean> {
    try {
      const { email, password, nickname } = data;

      const user = await User.findOne({ email });
      if (user) {
        return false;
      }
      await User.create({ email, password, nickname }).save();

      return true;
    } catch (err) {
      return err;
    }
  }
}
