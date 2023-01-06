import { Add } from "@mui/icons-material";
import { Stack, Typography } from "@mui/material";
import { useState } from "react";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import ThemedButton from "../../components/ThemedButton";
import CreateBoardDialog from "./CreateBoardDialog";

const HomePage = () => {
  const [showCreateBoardDialog, setShowCreateBoardDialog] = useState(false);

  const closeCreateBoardDialog = () => {
    setShowCreateBoardDialog(false);
  };

  return (
    <Stack minHeight="100vh" bgcolor="#F8F9FD">
      <Header />
      <Stack flexGrow={1} maxWidth="1090px" mx="auto" width="100vw" py={7.5}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography fontWeight={500} color="#333333">
            All Boards
          </Typography>
          <ThemedButton
            theme="primary"
            startIcon={<Add sx={{ width: "16px", height: "16px" }} />}
            sx={{
              fontSize: "12px",
            }}
            onClick={() => setShowCreateBoardDialog(true)}
          >
            Add
          </ThemedButton>
        </Stack>
      </Stack>
      <Footer />
      <CreateBoardDialog
        isOpen={showCreateBoardDialog}
        onClose={closeCreateBoardDialog}
      />
    </Stack>
  );
};

export default HomePage;
