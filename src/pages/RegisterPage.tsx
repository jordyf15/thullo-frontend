import { GitHub, Google } from "@mui/icons-material";
import { Box, Link, Stack, Typography } from "@mui/material";
import React, { useState } from "react";
import {
  GoogleLoginResponse,
  GoogleLoginResponseOffline,
  useGoogleLogin,
} from "react-google-login";
import { Navigate, useNavigate } from "react-router-dom";
import appLogo from "../assets/images/logo.png";
import Footer from "../components/Footer";
import InputField from "../components/InputField";
import OAuthButton from "../components/OAuthButton";
import ThemedButton from "../components/ThemedButton";
import dependencies from "../dependencies";
import { useAppDispatch, useAppSelector } from "../hooks";
import ErrorResponse from "../models/error";
import { setLoginState } from "../slices/user";
import { UserError } from "../usecases/user";

type RegisterStatus = "not_registered" | "loading" | "registered";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [nameError, setNameError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [registerStatus, setRegisterStatus] =
    useState<RegisterStatus>("not_registered");

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const user = useAppSelector((state) => state.user);

  const handleFieldError = (error: UserError) => {
    switch (error) {
      case UserError.UsernameTooShort:
        setUsernameError("Username must be atleast 3 characters");
        break;
      case UserError.UsernameTooLong:
        setUsernameError("Username cannot be more than 30 characters");
        break;
      case UserError.UsernameContainOtherThanLettersNumbersPeriodsUnderscores:
        setUsernameError(
          "Username can only contain letters, numbers, periods, and underscores"
        );
        break;
      case UserError.UsernameStartWithPeriodOrUnderscore:
        setUsernameError("Username cannot start with period or underscore");
        break;
      case UserError.UsernameHaveConsecutivePeriodOrUnderscore:
        setUsernameError(
          "Username cannot have consecutive periods or underscores"
        );
        break;
      case UserError.UsernameEndWithPeriodOrUnderscore:
        setUsernameError("Username cannot end with period or underscore");
        break;
      case UserError.NameEmpty:
        setNameError("Name cannot be empty");
        break;
      case UserError.NameTooLong:
        setNameError("Name cannot be more than 30 characters");
        break;
      case UserError.InvalidEmail:
        setEmailError("Email address is invalid");
        break;
      case UserError.PasswordTooShort:
        setPasswordError("Password must be atleast 8 characters");
        break;
      case UserError.PasswordTooLong:
        setPasswordError("Password cannot be more than 30 characters");
        break;
      case UserError.PasswordNotContainUpperCaseLetter:
        setPasswordError("Password must contain uppercase letter");
        break;
      case UserError.PasswordNotContainLowerCaseLetter:
        setPasswordError("Password must contain lowercase letter");
        break;
      case UserError.PasswordNotContainNumericalChar:
        setPasswordError("Password must contain numerical character");
        break;
      case UserError.PasswordNotContainSpecialChar:
        setPasswordError("Password must contain special character");
        break;
      case UserError.ConfirmPasswordNotMatch:
        setConfirmPasswordError(
          "Confirm password must be the same with password"
        );
        break;
    }
  };

  const onUsernameChange = (newUsername: string) => {
    setUsername(newUsername);
    dependencies.usecases.user
      .validateUsername(newUsername)
      .then(() => {
        setUsernameError("");
      })
      .catch((err) => {
        handleFieldError(err as UserError);
      });
  };

  const onNameChange = (newName: string) => {
    setName(newName);
    dependencies.usecases.user
      .validateName(newName)
      .then(() => {
        setNameError("");
      })
      .catch((err) => handleFieldError(err as UserError));
  };

  const onEmailChange = (newEmail: string) => {
    setEmail(newEmail);
    dependencies.usecases.user
      .validateEmail(newEmail)
      .then(() => {
        setEmailError("");
      })
      .catch((err) => handleFieldError(err as UserError));
  };

  const onPasswordChange = (newPassword: string) => {
    setPassword(newPassword);
    dependencies.usecases.user
      .validatePassword(newPassword)
      .then(() => {
        setPasswordError("");
      })
      .catch((err) => {
        handleFieldError(err as UserError);
      });
  };

  const onConfirmPasswordChange = (newConfirmPassword: string) => {
    setConfirmPassword(newConfirmPassword);
    dependencies.usecases.user
      .validateConfirmPassword(password, newConfirmPassword)
      .then(() => {
        setConfirmPasswordError("");
      })
      .catch((err) => {
        handleFieldError(err as UserError);
      });
  };

  const onSubmitForm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setRegisterStatus("loading");
    dependencies.usecases.user
      .register(name, username, email, password, confirmPassword)
      .then((response) => {
        setRegisterStatus("registered");
        dispatch(
          setLoginState({
            user: response.data,
            tokenSet: response.meta,
          })
        );
        navigate("/");
      })
      .catch((err) => {
        setRegisterStatus("not_registered");

        try {
          const fieldErrors = err as UserError[];
          for (const error of fieldErrors) {
            handleFieldError(error);
          }
        } catch (error) {
          // ignore
        }

        try {
          const errorResponse = err as ErrorResponse;
          errorResponse.errors.map((err) => {
            switch (err.code) {
              case 203:
                setEmailError("Email is already registered");
                break;
              case 206:
                setUsernameError("Username is already used");
                break;
              default:
                console.log(err.code);
                console.log(err.message);
                break;
            }
            return null;
          });
        } catch (error) {
          console.log(err);
          console.log(error);
        }
      });
  };

  const onGoogleLoginSuccess = (
    googleResponse: GoogleLoginResponse | GoogleLoginResponseOffline
  ) => {
    setRegisterStatus("loading");

    const googleResp = googleResponse as GoogleLoginResponse;

    dependencies.usecases.user
      .loginWithGoogle(googleResp.tokenId)
      .then((response) => {
        setRegisterStatus("registered");
        dispatch(
          setLoginState({
            user: response.data,
            tokenSet: response.meta,
          })
        );
        navigate("/");
      })
      .catch((err) => {
        setRegisterStatus("not_registered");
        console.log(err);
      });
  };

  const onGoogleLoginFailure = (error: any) => {
    console.log(error);
  };

  const googleLogin = useGoogleLogin({
    onSuccess: onGoogleLoginSuccess,
    onFailure: onGoogleLoginFailure,
    clientId: process.env.REACT_APP_GOOGLE_SIGNIN_CLIENT_ID as string,
    isSignedIn: false,
  });

  return (
    <Stack minHeight="100vh" bgcolor="#F8F9FD">
      {user.tokenSet && <Navigate to="/" />}
      <Stack
        flexGrow={1}
        spacing="24px"
        justifyContent="center"
        alignItems="center"
      >
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Box component="img" width="40px" height="40px" src={appLogo} />
          <Typography fontWeight={600} fontSize="36px">
            Thullo
          </Typography>
        </Stack>
        <Stack
          component="form"
          onSubmit={onSubmitForm}
          borderRadius="8px"
          py="20px"
          sx={{
            px: {
              xs: "24px",
              sm: "48px",
            },
            boxSizing: {
              xs: "border-box",
              sm: "content-box",
            },
          }}
          spacing={2.5}
          bgcolor="#fff"
          boxShadow="0 0 10px rgba(0,0,0,0.15)"
          width="100vw"
          maxWidth="320px"
        >
          <Typography color="#5E6C84" fontWeight={700} textAlign="center">
            Register for an account
          </Typography>
          <InputField
            placeholder="Enter your username"
            error={usernameError}
            value={username}
            onChange={(e) => onUsernameChange(e.target.value)}
            onBlur={() => onUsernameChange(username)}
            disabled={registerStatus === "loading"}
          />
          <InputField
            placeholder="Enter your name"
            error={nameError}
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            onBlur={() => onNameChange(name)}
            disabled={registerStatus === "loading"}
          />
          <InputField
            placeholder="Enter your email"
            error={emailError}
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            onBlur={() => onEmailChange(email)}
            disabled={registerStatus === "loading"}
          />
          <InputField
            placeholder="Enter your password"
            error={passwordError}
            value={password}
            onChange={(e) => onPasswordChange(e.target.value)}
            onBlur={() => onPasswordChange(password)}
            disabled={registerStatus === "loading"}
            isPasswordField
          />
          <InputField
            placeholder="Confirm your password"
            error={confirmPasswordError}
            value={confirmPassword}
            onChange={(e) => onConfirmPasswordChange(e.target.value)}
            onBlur={() => onConfirmPasswordChange(confirmPassword)}
            isPasswordField
            disabled={registerStatus === "loading"}
          />
          <ThemedButton
            theme="primary"
            type="submit"
            disabled={registerStatus === "loading"}
          >
            Register
          </ThemedButton>
          <Typography
            fontFamily={["Roboto", "sans-serif"].join(",")}
            fontSize="14px"
            color="#97A0AF"
            textAlign="center"
          >
            or continue with these accounts
          </Typography>
          <Stack direction="row" justifyContent="center" spacing={2.5}>
            <OAuthButton
              onClick={() => googleLogin.signIn()}
              disabled={registerStatus === "loading"}
            >
              <Google />
            </OAuthButton>
            <OAuthButton>
              <GitHub />
            </OAuthButton>
          </Stack>
          <Typography
            fontSize="14px"
            textAlign="center"
            fontFamily={["Roboto", "Sans-serif"].join(",")}
            color="#97A0AF"
          >
            <>
              Already have an account?{" "}
              <Link
                color="#0052CC"
                sx={{
                  textDecoration: "none",
                }}
                fontFamily="inherit"
                href="/login"
              >
                Login
              </Link>
            </>
          </Typography>
        </Stack>
      </Stack>
      <Footer />
    </Stack>
  );
};

export default RegisterPage;
