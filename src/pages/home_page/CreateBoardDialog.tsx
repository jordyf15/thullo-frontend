import { Add, Image, InfoRounded, Lock, Public } from "@mui/icons-material";
import {
  Box,
  Button,
  Fade,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import SimpleBar from "simplebar-react";
import "simplebar/dist/simplebar.min.css";
import CoverPopover from "../../components/CoverPopover";
import InputField from "../../components/InputField";
import ThemedButton from "../../components/ThemedButton";
import ThemedDialog from "../../components/ThemedDialog";
import VisibilityPopover from "../../components/VisibilityPopover";
import dependencies from "../../dependencies";
import { BoardVisibility } from "../../models/board";
import ErrorResponse from "../../models/error";
import RequestStatus from "../../models/requestStatus";
import { UnsplashPhoto } from "../../models/unsplash";
import { BoardError } from "../../usecases/board";

interface CreateBoardDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateBoardDialog = ({ isOpen, onClose }: CreateBoardDialogProps) => {
  const [title, setTitle] = useState("");
  const [cover, setCover] = useState("");
  const [coverPhoto, setCoverPhoto] = useState<UnsplashPhoto>();
  const [showCoverTip, setShowCoverTip] = useState(true);
  const [visibility, setVisibility] = useState<BoardVisibility>(
    BoardVisibility.Public
  );

  const [titleError, setTitleError] = useState("");
  const [coverError, setCoverError] = useState("");

  const [visibilityPopoverAnchorElement, setVisibilityPopoverAnchorElement] =
    useState<HTMLButtonElement | null>(null);
  const [coverPopoverAnchorElement, setCoverPopoverAnchorElement] =
    useState<HTMLButtonElement | null>(null);

  const [requestStatus, setRequestStatus] =
    useState<RequestStatus>("not_requested");

  const isSmallMobileScreen = useMediaQuery("(max-width:375px)");

  const coverContainerRef = useRef<HTMLDivElement>();
  const coverRef = useRef<HTMLImageElement>();
  const coverScrollIgnored = useRef<boolean>();
  const coverScrollTimeout = useRef<NodeJS.Timeout>();

  const showVisibilityPopover = Boolean(visibilityPopoverAnchorElement);
  const showCoverPopover = Boolean(coverPopoverAnchorElement);

  useEffect(() => {
    if (isOpen) {
      dependencies.usecases.unsplash.getRandomPhoto().then((photo) => {
        setCoverPhoto(photo);
        setCover(`unsplash:${photo.id}:0.5`);
      });
    }
  }, [isOpen]);

  const openVisibilityPopover = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    setVisibilityPopoverAnchorElement(event.currentTarget);
  };

  const closeVisibilityPopover = () => {
    setVisibilityPopoverAnchorElement(null);
  };

  const openCoverPopover = (event: React.MouseEvent<HTMLButtonElement>) => {
    setCoverPopoverAnchorElement(event.currentTarget);
  };

  const closeCoverPopover = () => {
    setCoverPopoverAnchorElement(null);
  };

  const handleFieldError = (error: BoardError) => {
    switch (error) {
      case BoardError.CoverEmpty:
        setCoverError("Cover must be chosen");
        break;
      case BoardError.TitleEmpty:
        setTitleError("Title must not be empty");
        break;
    }
  };

  const onTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    dependencies.usecases.board
      .checkEmptyTitle(newTitle)
      .then(() => {
        setTitleError("");
      })
      .catch((err) => {
        handleFieldError(err as BoardError);
      });
  };

  const onVisibilityChange = (visibility: BoardVisibility) => {
    setVisibility(visibility);
  };

  const onCoverChange = (coverPhoto: UnsplashPhoto) => {
    setCoverError("");
    setCoverPhoto(coverPhoto);
    setCover(`unsplash:${coverPhoto.id}:0.5`);
  };

  const onCoverLoaded = () => {
    const coverContainer = coverContainerRef.current;
    const cover = coverRef.current;

    if (cover && coverContainer) {
      coverScrollIgnored.current = true;
      coverContainer.scrollTop =
        (cover.clientHeight - coverContainer.clientHeight) / 2;
    }
  };

  const onCoverScroll = () => {
    if (coverScrollIgnored.current) {
      coverScrollIgnored.current = false;
      return;
    }

    if (showCoverTip) {
      setShowCoverTip(false);
    }

    clearTimeout(coverScrollTimeout.current);

    coverScrollTimeout.current = setTimeout(() => {
      setShowCoverTip(true);

      const coverContainer = coverContainerRef.current;
      const cover = coverRef.current;

      if (cover && coverContainer) {
        const maxScrollOffset =
          cover.clientHeight - coverContainer.clientHeight;

        let focalPoint = +(coverContainer.scrollTop / maxScrollOffset).toFixed(
          3
        );

        focalPoint = focalPoint < 0 ? 0 : focalPoint;
        focalPoint = focalPoint > 1 ? 1 : focalPoint;

        setCover(`unsplash:${coverPhoto?.id}:${focalPoint}`);
      }
    }, 1000);
  };

  const onSubmitForm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setRequestStatus("loading");
    dependencies.usecases.board
      .createBoard(title, visibility, cover)
      .then(() => {
        handleClose();
      })
      .catch((err) => {
        setRequestStatus("not_requested");

        try {
          const fieldErrors = err as BoardError[];
          for (const error of fieldErrors) {
            handleFieldError(error);
          }
        } catch (error) {
          // ignore
        }

        try {
          const errorResponse = err as ErrorResponse;

          errorResponse.errors.forEach((err) => {
            console.log(err.code);
            console.log(err.message);
          });

          return null;
        } catch (error) {
          console.log(err);
          console.log(error);
        }
      });
  };

  const handleClose = () => {
    setTitle("");
    setCover("");
    setCoverPhoto(undefined);
    setShowCoverTip(true);
    setVisibility(BoardVisibility.Public);
    setTitleError("");
    setCoverError("");
    setRequestStatus("not_requested");
    setVisibilityPopoverAnchorElement(null);
    setCoverPopoverAnchorElement(null);

    onClose();
  };

  return (
    <ThemedDialog
      open={isOpen}
      onClose={handleClose}
      maxWidth={"xs"}
      fullWidth
      content={
        <Stack spacing={1.5} component="form" onSubmit={onSubmitForm}>
          <Box
            width={1}
            position="relative"
            border={coverError ? "1px solid #d32f2f" : "unset"}
            borderRadius="8px"
          >
            <Box
              component={SimpleBar}
              scrollableNodeProps={{
                ref: coverContainerRef,
                onScroll: onCoverScroll,
              }}
              width={1}
              height="110px"
              borderRadius="8px"
              sx={{
                cursor: "all-scroll",
                overflowX: "hidden",
              }}
            >
              {coverPhoto && (
                <>
                  <Box
                    component="img"
                    width={1}
                    ref={coverRef}
                    src={coverPhoto?.urls.regular}
                    draggable={false}
                    onLoad={onCoverLoaded}
                  />
                </>
              )}
            </Box>
            <Fade in={showCoverTip} timeout={300}>
              <Stack
                position="absolute"
                bottom="8px"
                left="8px"
                bgcolor="rgba(0,0,0,0.6)"
                color={coverError ? "#f44336" : "#FFF"}
                direction="row"
                alignItems="center"
                spacing={0.75}
                p={0.75}
                borderRadius="8px"
              >
                <InfoRounded sx={{ fontSize: "12px" }} />
                <Typography fontSize="10px" fontWeight={coverError ? 700 : 400}>
                  {coverError
                    ? "Cover must be chosen"
                    : "Tip: scroll to adjust cover image"}
                </Typography>
              </Stack>
            </Fade>
          </Box>

          <Stack spacing={3}>
            <InputField
              placeholder="Add board title"
              error={titleError}
              value={title}
              onChange={(e) => onTitleChange(e.target.value)}
              onBlur={() => onTitleChange(title)}
              disabled={requestStatus === "loading"}
            />
            <Stack direction="row" spacing={3}>
              <ThemedButton
                theme="secondary"
                disabled={requestStatus === "loading"}
                startIcon={<Image />}
                sx={{
                  flexGrow: 1,
                  justifyContent: "start",
                  pl: isSmallMobileScreen ? 1.5 : 3,
                }}
                onClick={openCoverPopover}
              >
                Cover
              </ThemedButton>
              <ThemedButton
                theme="secondary"
                disabled={requestStatus === "loading"}
                sx={{
                  flexGrow: 1,
                  justifyContent: "start",
                  pl: isSmallMobileScreen ? 1.5 : 3,
                }}
                startIcon={
                  visibility === BoardVisibility.Public ? <Public /> : <Lock />
                }
                onClick={openVisibilityPopover}
              >
                <>
                  {visibility === BoardVisibility.Public ? "Public" : "Private"}
                </>
              </ThemedButton>
              <VisibilityPopover
                open={showVisibilityPopover}
                onClose={closeVisibilityPopover}
                onPickVisibility={onVisibilityChange}
                anchorEl={visibilityPopoverAnchorElement}
              />
              <CoverPopover
                open={showCoverPopover}
                onClose={closeCoverPopover}
                onPickCover={onCoverChange}
                anchorEl={coverPopoverAnchorElement}
              />
            </Stack>
            <Stack direction="row" spacing={3} justifyContent="flex-end">
              <Button
                sx={{
                  fontFamily: ["Poppins", "sans-serif"].join(","),
                  fontWeight: 500,
                  fontSize: "14px",
                  textTransform: "none",
                  color: "#E0E0E0",
                  p: 0,
                }}
                disabled={requestStatus === "loading"}
                onClick={handleClose}
              >
                Cancel
              </Button>
              <ThemedButton
                startIcon={<Add />}
                disabled={requestStatus === "loading"}
                theme="primary"
                type="submit"
              >
                Create
              </ThemedButton>
            </Stack>
          </Stack>
        </Stack>
      }
    />
  );
};

export default CreateBoardDialog;
