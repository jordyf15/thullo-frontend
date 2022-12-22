export default interface ErrorResponse {
  errors: Error[];
}

interface Error {
  message: string;
  code: ErrorCode;
}

export enum ErrorCode {
  // general errors
  // RecordNotFound Error returned when the searched data is not found
  RecordNotFound = 103,

  // user errors
  // CurrentPasswordWrong Error returned when the inputted password does not match the current password
  CurrentPasswordWrong = 201,
  // EmailAddressInvalid Error returned when the inputted email is not valid
  EmailAddressInvalid = 202,
  // EmailAddressAlreadyRegistered Error returned when the inputted email is already registered
  EmailAddressAlreadyRegistered = 203,
  // UsernameTooShort Error returned when the inputted username is too short
  UsernameTooShort = 204,
  // UsernameToolong Error returned when the inputted username is too long
  UsernameTooLong = 205,
  // UsernameAlreadyExists Error returned when the inputted username already existed
  UsernameAlreadyExists = 206,
  // UsernameInvalid Error returned when the inputted username is not valid
  UsernameInvalid = 207,
  // NameTooShort Error returned when the inputted name is too short
  NameTooShort = 208,
  // NameTooLong Error returned when the inputted name is too long
  NameTooLong = 209,
  // PasswordTooShort Error returned when the inputted password is too short
  PasswordTooShort = 210,
  // PasswordTooLong Error returned when the inputted password is too long
  PasswordTooLong = 211,
  // PasswordInvalid Error returned when the inputted password is not valid
  PasswordInvalid = 212,

  // token errors
  // MalformedRefreshToken Error returned when the refresh token is malformed or cannot be parsed
  MalformedRefreshToken = 301,
  // InvalidRefreshToken Error returned when the refresh token is not signed on this server
  InvalidRefreshToken = 302,
  // RefreshTokenNotFound Error returned when the refresh token is not found in database
  RefreshTokenNotFound = 303,
  // MalformedAccessToken Error returned when the access token is malformed or cannot be parsed
  MalformedAccessToken = 304,
  // InvalidAccessToken Error returned when the access token is not signed on this server
  InvalidAccessToken = 305,
  // AccessTokenExpired Error returned when the access token has expired
  AccessTokenExpired = 306,
}
