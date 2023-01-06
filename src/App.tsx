import { Box, createTheme, ThemeProvider } from "@mui/material";
import { Route } from "react-router";
import { Navigate, Routes, useLocation } from "react-router-dom";
import "./App.css";
import { NotLoggedInError, TokenSetNotFoundError } from "./error";
import { useAppSelector } from "./hooks";
import HomePage from "./pages/home_page/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

const theme = createTheme({
  typography: {
    fontFamily: ["Poppins", "sans-serif"].join(","),
  },
  components: {
    MuiButton: {
      defaultProps: {
        sx: { textTransform: "none" },
      },
    },
  },
});

const App = () => {
  const isInitializingTokenSet = useAppSelector(
    (state) => state.user.tokenSet === null && state.user.error === undefined
  );

  const location = useLocation();

  const isLoggedOut = useAppSelector(
    (state) =>
      state.user.tokenSet === null &&
      (state.user.error?.message === TokenSetNotFoundError ||
        state.user.error?.message === NotLoggedInError)
  );

  if (isInitializingTokenSet) {
    return <></>;
  }

  const whitelistedPaths = ["/register", "/login"];

  if (isLoggedOut && !whitelistedPaths.includes(location.pathname)) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Box>
      <ThemeProvider theme={theme}>
        <Routes>
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<HomePage />} />
        </Routes>
      </ThemeProvider>
    </Box>
  );
};
export default App;
