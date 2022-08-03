import { SetMetadata } from '@nestjs/common';
import { SPEC_KEY } from 'src/constants/base.constant';
import { UserType } from '../../enums/user.enum';

// export const Auth = (specs: IAuthPermission[]) => SetMetadata(SPEC_KEY, specs);
export const Auth = (specs: UserType[], isOnly = false) => SetMetadata(SPEC_KEY, { specs, isOnly });
