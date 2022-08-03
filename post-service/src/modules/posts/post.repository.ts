import { InjectRepository } from '@nestjs/typeorm';
import { BaseRepository } from 'src/base/base.repository';
import { EntityRepository, Repository } from 'typeorm';

import { Post } from '../entities/post.entity';

@EntityRepository(Post)
export class PostsRepository extends BaseRepository<Post> {
  constructor(@InjectRepository(Post) readonly postModel: Repository<Post>) {
    super(postModel);
  }
}
