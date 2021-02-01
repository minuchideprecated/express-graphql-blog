import { Arg, Mutation, Resolver } from 'type-graphql';
import User from '../entities/User';
import { createUserInput } from '../types/userInput';

@Resolver()
export class UserResolver {
  @Mutation(() => Boolean)
  async createUser(@Arg('data') data: createUserInput): Promise<boolean> {
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
