import DataMetaResponse from "../models/dataMetaResponse";
import TokenSet from "../models/tokenSet";
import User from "../models/user";
import UserRepository from "../repositories/user";

interface UserUsecase {
  userRepo: UserRepository;
  register: (
    name: string,
    username: string,
    email: string,
    password: string,
    confirmPassword: string
  ) => Promise<DataMetaResponse<User, TokenSet>>;
  validateUsername: (username: string) => Promise<void>;
  validateName: (name: string) => Promise<void>;
  validateEmail: (email: string) => Promise<void>;
  validatePassword: (password: string) => Promise<void>;
  validateConfirmPassword: (
    password: string,
    confirmPassword: string
  ) => Promise<void>;
}

export enum UserError {
  UsernameTooShort = "username_too_short",
  UsernameTooLong = "username_too_long",
  UsernameContainOtherThanLettersNumbersPeriodsUnderscores = "username_contain_other_than_letters_numbers_periods_underscores",
  UsernameStartWithPeriodOrUnderscore = "username_start_with_period_or_underscore",
  UsernameHaveConsecutivePeriodOrUnderscore = "username_have_consecutive_period_or_underscore",
  UsernameEndWithPeriodOrUnderscore = "username_end_with_period_or_underscore",
  NameEmpty = "name_empty",
  NameTooLong = "name_too_long",
  InvalidEmail = "invalid_email",
  PasswordTooShort = "password_too_short",
  PasswordTooLong = "password_too_long",
  PasswordNotContainUpperCaseLetter = "password_not_contain_uppercase_letter",
  PasswordNotContainLowerCaseLetter = "password_not_contain_lowercase_letter",
  PasswordNotContainNumericalChar = "password_not_contain_numerical_char",
  PasswordNotContainSpecialChar = "password_not_contain_special_char",
  ConfirmPasswordNotMatch = "confirm_password_not_match",
}

class RealUserUsecase implements UserUsecase {
  userRepo: UserRepository;

  constructor(userRepo: UserRepository) {
    this.userRepo = userRepo;
  }

  async register(
    name: string,
    username: string,
    email: string,
    password: string,
    confirmPassword: string
  ) {
    const errors: UserError[] = [];

    try {
      await this.validateName(name);
    } catch (error) {
      errors.push(error as UserError);
    }

    try {
      await this.validateUsername(username);
    } catch (error) {
      errors.push(error as UserError);
    }

    try {
      await this.validateEmail(email);
    } catch (error) {
      errors.push(error as UserError);
    }

    try {
      await this.validatePassword(password);
    } catch (error) {
      errors.push(error as UserError);
    }

    try {
      await this.validateConfirmPassword(password, confirmPassword);
    } catch (error) {
      errors.push(error as UserError);
    }

    if (errors.length > 0) {
      throw errors;
    }

    const resp = await this.userRepo.register(name, username, email, password);

    return resp;
  }

  async validateName(name: string) {
    if (name.length < 1) {
      throw UserError.NameEmpty;
    } else if (name.length > 30) {
      throw UserError.NameTooLong;
    }
  }

  async validateUsername(username: string) {
    if (username.length < 3) {
      throw UserError.UsernameTooShort;
    } else if (username.length > 30) {
      throw UserError.UsernameTooLong;
    }

    const allowedCharactersRegex = /^[a-z0-9._]+$/;
    if (!allowedCharactersRegex.test(username)) {
      throw UserError.UsernameContainOtherThanLettersNumbersPeriodsUnderscores;
    }

    const notStartWithPeriodOrUnderscoreRegex = /^[^_.].+$/;
    if (!notStartWithPeriodOrUnderscoreRegex.test(username)) {
      throw UserError.UsernameStartWithPeriodOrUnderscore;
    }

    const notContainConsecutiveUnderscore = /^(?!.*__)/;
    const notContainConsecutivePeriod = /^(?!.*\.\.)/;
    if (
      !notContainConsecutiveUnderscore.test(username) ||
      !notContainConsecutivePeriod.test(username)
    ) {
      throw UserError.UsernameHaveConsecutivePeriodOrUnderscore;
    }

    const notEndWithPeriodOrUnderscoreRegex = /.*[^_|.]$/;
    if (!notEndWithPeriodOrUnderscoreRegex.test(username)) {
      throw UserError.UsernameEndWithPeriodOrUnderscore;
    }
  }

  async validateEmail(email: string) {
    const emailRegex = /^[\w+\-.]+@[a-z\d\-.]+\.[a-z]+$/;
    if (!emailRegex.test(email)) {
      throw UserError.InvalidEmail;
    }
  }

  async validatePassword(password: string) {
    if (password.length < 8) {
      throw UserError.PasswordTooShort;
    } else if (password.length > 30) {
      throw UserError.PasswordTooLong;
    }

    const upperCasePattern = /.*[A-Z].*/;
    if (!upperCasePattern.test(password)) {
      throw UserError.PasswordNotContainUpperCaseLetter;
    }

    const lowercasePattern = /.*[a-z].*/;
    if (!lowercasePattern.test(password)) {
      throw UserError.PasswordNotContainLowerCaseLetter;
    }

    const numericalPattern = /.*[0-9].*/;
    if (!numericalPattern.test(password)) {
      throw UserError.PasswordNotContainNumericalChar;
    }

    const specialCharacterPattern = /.*[^A-Za-z0-9\\s].*/;
    if (!specialCharacterPattern.test(password)) {
      throw UserError.PasswordNotContainSpecialChar;
    }
  }

  async validateConfirmPassword(password: string, confirmPassword: string) {
    if (password !== confirmPassword) {
      throw UserError.ConfirmPasswordNotMatch;
    }
  }
}

export const NewUserUsecase: (UserRepository: UserRepository) => UserUsecase = (
  userRepository
) => new RealUserUsecase(userRepository);

export default UserUsecase;
