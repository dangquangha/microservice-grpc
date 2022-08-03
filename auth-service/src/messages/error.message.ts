export const AUTH_MESSAGE = {
  EMAIL_NOT_EXIST: 'The account does not exist in the system. Please try again',
  EMAIL_HAS_TAKEN: 'The Email has been taken',
  EMAIL_NOT_VERIFY: 'The account does not verify.',
  EMAIL_EXIST: 'The account is already exist in the system. Please try again',
  WRONG_CREDENTIAL: 'Email or password is incorrect!',
  MAX_NUMBER: (fieldName: string, condition: number) => `The ${fieldName} field no more than ${condition} numbers`,
  MAX_LETTER: (fieldName: string, condition: number) => `The ${fieldName} field no more than ${condition} characters`,
  WRONG_CODE: 'The code field is expire or incorrect.',
  REGISTER_SEND_CODE: 'Register code sent to your Email',
  CHANGE_PASSWORD_SUCCESS: 'Change password successfully!',
};
