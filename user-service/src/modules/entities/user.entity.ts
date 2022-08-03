import { Exclude } from 'class-transformer';
import { BaseTable } from 'src/base/base.entity';
import { UserType } from 'src/enums/user.enum';
import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';

@Entity()
export class User extends BaseTable {
  constructor(partial: Partial<User>) {
    super();
    Object.assign(this, partial);
  }
  @Column({
    type: 'varchar',
    nullable: true,
  })
  full_name: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  email: string;

  @Exclude()
  @Column({
    type: 'varchar',
    nullable: true,
  })
  password: string;

  @Column({
    type: 'enum',
    enum: UserType,
    default: UserType.CLIENT,
  })
  user_type?: UserType;
}
