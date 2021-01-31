import { Arg, Mutation, Resolver } from 'type-graphql';
import { getManager } from 'typeorm';
import User from '../entities/User';
import { createUserInput } from '../types/userInput';

@Resolver()
export class UserResolver {
  @Mutation(() => Boolean)
  async createUser(@Arg('data') data: createUserInput): Promise<boolean> {
    try {
      const { email, password, nickname } = data;
      return await getManager().transaction(async (transactionalEntityManager) => {
        const userRepository = transactionalEntityManager.getRepository(User);

        const user = await userRepository.findOne({ email });
        if (user) {
          return false;
        }
        await userRepository.create({ email, password, nickname }).save();

        return true;
      });
    } catch (err) {
      return err;
    }
  }
}
