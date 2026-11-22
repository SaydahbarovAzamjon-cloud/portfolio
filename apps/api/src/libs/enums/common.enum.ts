import { registerEnumType } from '@nestjs/graphql';

/** Site languages. English is required everywhere; Korean is optional. */
export enum Locale {
  EN = 'en',
  KO = 'ko',
}
registerEnumType(Locale, { name: 'Locale' });

/** User-facing messages, shared by all components. */
export enum Message {
  LOGIN_SUCCESS = 'You successfully logged in to the dashboard!',
  SESSION_REFRESHED = 'Your session has been refreshed!',
  CREATE_SUCCESS = 'Created successfully!',
  UPDATE_SUCCESS = 'Updated successfully!',
  REMOVE_SUCCESS = 'Removed successfully!',
  PROFILE_REQUIRED_FIELDS = 'Profile does not exist yet: name, fullName, headline, location and contactEmail are required.',
  ALREADY_EXISTS = 'This item already exists!',
  CATEGORY_NOT_EMPTY = 'This category still has skills. Move or remove them first!',

  SOMETHING_WENT_WRONG = 'Something went wrong!',
  NO_DATA_FOUND = 'No data found!',
  CREATE_FAILED = 'Creation failed!',
  UPDATE_FAILED = 'Update failed!',
  REMOVE_FAILED = 'Removal failed!',
  UPLOAD_FAILED = 'Upload failed!',
  BAD_REQUEST = 'Bad request!',
  NOT_AUTHENTICATED = 'You are not authenticated. Please log in first!',
  WRONG_CREDENTIALS = 'Incorrect email or password!',
  SESSION_EXPIRED = 'Your session has expired. Please log in again!',
  TOO_MANY_ATTEMPTS = 'Too many attempts. Please try again later!',
  ONLY_SPECIFIC_ROLES_ALLOWED = 'Access is restricted to specific roles!',
  NOT_ALLOWED_REQUEST = 'Request is not allowed!',
  PROVIDE_ALLOWED_FORMAT = 'Unsupported file format!',
}

export enum Direction {
  ASC = 1,
  DESC = -1,
}
registerEnumType(Direction, { name: 'Direction' });
