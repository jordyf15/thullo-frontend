import { Box, Stack, Typography } from "@mui/material";
import appLogo from "../assets/images/logo.png";
import { useAppSelector } from "../hooks";
import { getImage } from "../models/image";

const Header = () => {
  const user = useAppSelector((state) => state.user.currentUser);

  console.log(user);
  return (
    user && (
      <Stack
        bgcolor="#fff"
        py="20px"
        px="25px"
        boxShadow="0px 2px 2px rgba(0, 0, 0, 0.05)"
        direction="row"
        justifyContent="space-between"
      >
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Box component="img" width="30px" src={appLogo} />
          <Typography fontSize="18px" fontWeight={600}>
            Thullo
          </Typography>
        </Stack>
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Box
            component="img"
            width="30px"
            src={getImage(user.images, "small")?.url}
            borderRadius="8px"
          />
          <Typography
            fontFamily={["Noto Sans", "sans-serif"].join(",")}
            fontWeight={700}
          >
            {user.username}
          </Typography>
        </Stack>
      </Stack>
    )
  );
};

export default Header;
