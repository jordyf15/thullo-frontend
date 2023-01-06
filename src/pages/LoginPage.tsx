import { GitHub, Google } from "@mui/icons-material";
import { Box, Link, Stack, Typography } from "@mui/material";
import React, { useState } from "react";
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

type LoginStatus = "not_logged_in" | "loading" | "logged_in";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loginStatus, setLoginStatus] = useState<LoginStatus>("not_logged_in");

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const user = useAppSelector((state) => state.user);

  const handleFieldError = (error: UserError) => {
    switch (error) {
      case UserError.EmailEmpty:
        setEmailError("Email must not be empty");
        break;
      case UserError.PasswordEmpty:
        setPasswordError("Password must not be empty");
        break;
    }
  };

  const onEmailChange = (newEmail: string) => {
    setEmail(newEmail);
    dependencies.usecases.user
      .checkEmptyEmail(newEmail)
      .then(() => {
        setEmailError("");
      })
      .catch((err) => {
        handleFieldError(err as UserError);
      });
  };

  const onPasswordChange = (newPassword: string) => {
    setPassword(newPassword);
    dependencies.usecases.user
      .checkEmptyPassword(newPassword)
      .then(() => {
        setPasswordError("");
      })
      .catch((err) => {
        handleFieldError(err as UserError);
      });
  };

  const onSubmitForm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setLoginStatus("loading");
    dependencies.usecases.user
      .login(email, password)
      .then((response) => {
        setLoginStatus("logged_in");
        dispatch(
          setLoginState({
            user: response.data,
            tokenSet: response.meta,
          })
        );
        navigate("/");
      })
      .catch((err) => {
        setLoginStatus("not_logged_in");

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
              case 103:
                setEmailError("Email was not found");
                break;
              case 201:
                setPasswordError("Password is incorrect");
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
            Log in to Thullo
          </Typography>
          <InputField
            placeholder="Enter your email"
            error={emailError}
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            onBlur={() => onEmailChange(email)}
            disabled={loginStatus === "loading"}
          />
          <InputField
            placeholder="Enter your password"
            error={passwordError}
            value={password}
            onChange={(e) => onPasswordChange(e.target.value)}
            onBlur={() => onPasswordChange(password)}
            disabled={loginStatus === "loading"}
            isPasswordField
          />
          <ThemedButton
            theme="primary"
            type="submit"
            disabled={loginStatus === "loading"}
          >
            Log in
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
            <OAuthButton>
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
              Don't have an account?{" "}
              <Link
                color="#0052CC"
                sx={{
                  textDecoration: "none",
                }}
                fontFamily="inherit"
                href="/register"
              >
                Register
              </Link>
            </>
          </Typography>
        </Stack>
      </Stack>
      <Footer />
    </Stack>
  );
};

export default LoginPage;
