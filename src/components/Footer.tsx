import { Typography } from "@mui/material";

const Footer = () => {
  return (
    <Typography
      fontWeight={600}
      fontSize="14px"
      lineHeight="17px"
      color="#BDBDBD"
      textAlign="center"
      py={3}
    >
      <>&#169; {new Date().getFullYear()} Jordy Ferdian, devchallenges.io</>
    </Typography>
  );
};

export default Footer;
