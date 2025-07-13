import type {AccountInput_TargetOf_profile} from './';

export interface AccountInput {
    username: string;
    password: string;
    profile?: AccountInput_TargetOf_profile | undefined;
}
