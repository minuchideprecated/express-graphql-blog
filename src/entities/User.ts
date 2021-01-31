import { hash, verify } from 'argon2';
import { Field, Int, ObjectType } from 'type-graphql';
import {
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@ObjectType()
@Entity()
class User extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ type: 'text', unique: true })
  email: string;

  @Field()
  @Column({ type: 'text' })
  password: string;

  @Field({ nullable: true })
  @Column({ type: 'text', unique: true, nullable: true })
  nickname?: string;

  @Column('timestampz')
  @CreateDateColumn()
  createdAt: string;

  @Column('timestampz')
  @UpdateDateColumn()
  updatedAt: string;

  private hashPassword(password: string): Promise<string> {
    return hash(password);
  }

  @BeforeInsert()
  @BeforeUpdate()
  async savePassword(): Promise<void> {
    if (this.password) {
      const hashedPassword = await this.hashPassword(this.password);
      this.password = hashedPassword;
    }
  }

  public verifyPassword(password: string): Promise<boolean> {
    return verify(this.password, password);
  }
}

export default User;
