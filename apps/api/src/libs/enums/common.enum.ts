import { registerEnumType } from '@nestjs/graphql';

/** Site languages. English is required everywhere; Korean is optional. */
export enum Locale {
  EN = 'en',
  KO = 'ko',
}
registerEnumType(Locale, { name: 'Locale' });

/** User-facing error messages, shared by all components. */
export enum Message {
  SOMETHING_WENT_WRONG = 'Something went wrong!',
  NO_DATA_FOUND = 'No data found!',
  CREATE_FAILED = 'Creation failed!',
  UPDATE_FAILED = 'Update failed!',
  REMOVE_FAILED = 'Removal failed!',
  UPLOAD_FAILED = 'Upload failed!',
  BAD_REQUEST = 'Bad request!',
  NOT_AUTHENTICATED = 'You are not authenticated. Please log in first!',
  WRONG_CREDENTIALS = 'Incorrect email or password!',
  ONLY_SPECIFIC_ROLES_ALLOWED = 'Access is restricted to specific roles!',
  NOT_ALLOWED_REQUEST = 'Request is not allowed!',
  PROVIDE_ALLOWED_FORMAT = 'Unsupported file format!',
}

export enum Direction {
  ASC = 1,
  DESC = -1,
}
registerEnumType(Direction, { name: 'Direction' });
