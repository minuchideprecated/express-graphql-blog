import { Arg, Ctx, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import { Context } from 'vm';
import User from '../entities/User';
import { isAuth } from '../middlewares/AuthMiddleware';
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
        throw new Error('invalidPassword');
      }

      const isCorrect = await user.verifyPassword(password);
      if (isCorrect === false) {
        throw new Error('invalidPassword');
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

  @Query(() => User, { nullable: true })
  @UseMiddleware(isAuth)
  async getUserBySelf(@Ctx() { payload }: Context) {
    try {
      return await User.findOne({ where: { id: payload!.userId } });
    } catch (err) {
      return err;
    }
  }
}
