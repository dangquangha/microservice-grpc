import { Exclude } from 'class-transformer';
import { BaseTable } from 'src/base/base.entity';
import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';

@Entity()
export class Post extends BaseTable {
  constructor(partial: Partial<Post>) {
    super();
    Object.assign(this, partial);
  }
  @Column({
    type: 'varchar',
    nullable: true,
  })
  title: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  content: string;

  @Column({
    type: 'int',
    nullable: true,
  })
  user_id: number;
}
