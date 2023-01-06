import { SearchRounded } from "@mui/icons-material";
import {
  IconButton,
  InputAdornment,
  Link,
  PopoverProps,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { useEffect, useRef, useState } from "react";
import unsplashLogo from "../assets/images/unsplash-logo.png";
import dependencies from "../dependencies";
import { UnsplashPhoto } from "../models/unsplash";
import { combinedWithQueries } from "../repositories/base";
import ThemedPopover from "./ThemedPopover";

interface CoverPopoverProps extends PopoverProps {
  onClose: () => void;
  onPickCover: (photo: UnsplashPhoto) => void;
}

type RequestStatus = "not_requested" | "loading" | "successful" | "failed";

interface PickerPhotoRow {
  photos: UnsplashPhoto[];
}

const CoverPopover = ({
  onClose,
  onPickCover,
  ...otherProps
}: CoverPopoverProps) => {
  const [query, setQuery] = useState("");
  const [requestStatus, setRequestStatus] =
    useState<RequestStatus>("not_requested");
  const [currentPage, setCurrentPage] = useState(1);
  const [photoRows, setPhotoRows] = useState<PickerPhotoRow[]>([]);
  const [isFinalPage, setIsFinalPage] = useState(false);

  const photoListRef = useRef<HTMLDivElement>();

  useEffect(() => {
    setRequestStatus("loading");
    dependencies.usecases.unsplash
      .listPhotos(1, 28)
      .then((photos) => {
        setRequestStatus("successful");

        if (photos.length < 28) setIsFinalPage(true);

        const newPhotoRows = appendPhotosToRows(photos, photoRows, true);

        setPhotoRows(newPhotoRows);
        setCurrentPage(1);
      })
      .catch(() => {
        setRequestStatus("failed");
      });

    // we want this to run only once in initial render so we will disable the eslint rule
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onListScroll = () => {
    if (query.startsWith("id:") || !photoListRef.current || isFinalPage) {
      return;
    }

    // request for next page of photos if scroll height is within 300 px
    const { scrollTop, scrollHeight, clientHeight } = photoListRef.current;
    if (
      (requestStatus !== "not_requested" &&
        requestStatus !== "successful" &&
        requestStatus !== "failed") ||
      scrollTop + clientHeight < scrollHeight - 300
    )
      return;

    setRequestStatus("loading");

    if (query) {
      const currentQuery = query;

      dependencies.usecases.unsplash
        .searchForPhotos(query, currentPage + 1, 28)
        .then((response) => {
          setRequestStatus("successful");
          if (query !== currentQuery) {
            return;
          }

          if (response.results.length < 28) setIsFinalPage(true);

          const newPhotoRows = appendPhotosToRows(response.results, photoRows);
          setPhotoRows(newPhotoRows);
          setCurrentPage(currentPage + 1);
        })
        .catch(() => {
          setRequestStatus("failed");
        });
    } else {
      dependencies.usecases.unsplash
        .listPhotos(currentPage + 1, 28)
        .then((photos) => {
          setRequestStatus("successful");
          if (query) {
            return;
          }

          if (photos.length < 28) setIsFinalPage(true);

          const newPhotoRows = appendPhotosToRows(photos, photoRows);
          setPhotoRows(newPhotoRows);
          setCurrentPage(currentPage + 1);
        })
        .catch(() => {
          setRequestStatus("failed");
        });
    }
  };

  const onSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setRequestStatus("loading");
    setIsFinalPage(false);

    dependencies.usecases.unsplash
      .searchForPhotos(query, 1, 28)
      .then((response) => {
        setRequestStatus("successful");

        const newPhotoRows = appendPhotosToRows(
          response.results,
          photoRows,
          true
        );

        setPhotoRows(newPhotoRows);
        setCurrentPage(1);
      })
      .catch(() => {
        setRequestStatus("failed");
      });
  };

  const onSelectCover = (photo: UnsplashPhoto) => {
    onPickCover(photo);
    onClose();
  };

  return (
    <ThemedPopover onClose={onClose} {...otherProps}>
      <Stack spacing={2}>
        <Stack>
          <Typography fontWeight={600} color="#4F4F4F" fontSize="14px">
            Photo Search
          </Typography>
          <Typography
            fontFamily={["Noto Sans", "sans-serif"].join(",")}
            color="#828282"
            fontSize="14px"
          >
            Search Unsplash for photos
          </Typography>
        </Stack>

        <Box component="form" onSubmit={onSearch}>
          <TextField
            value={query}
            fullWidth
            placeholder="Keywords...."
            size="small"
            disabled={requestStatus === "loading"}
            onChange={(e) => setQuery(e.target.value)}
            sx={{
              fieldset: {
                borderRadius: "8px",
                border: "1px solid #E0E0E0",
                boxShadow: "0px 4px 12px rgba(0,0,0,0.1)",
              },
              input: {
                py: "10px",
                px: "15px",
                fontFamily: ["Poppins", "sans-serif"].join(","),
                fontWeight: 500,
                fontSize: "14px",
              },
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment
                  position="end"
                  sx={{ p: 0.25, boxSizing: "border-box" }}
                >
                  <IconButton
                    edge="end"
                    sx={{
                      bgcolor: "#2F80ED",
                      borderRadius: "8px",
                      "&:hover": {
                        bgcolor: "#1565c0",
                      },
                      "&:disabled": {
                        bgcolor: "#e0e0e0",
                      },
                      color: "#FFF",
                      p: 0.625,
                    }}
                    disabled={requestStatus === "loading"}
                    type="submit"
                  >
                    <SearchRounded
                      sx={{
                        color: "inherit",
                        fontSize: "22px",
                      }}
                    />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <Stack spacing={0.5} alignItems="center">
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="center"
            spacing={1}
          >
            <Typography fontSize="12px" fontWeight={600} color="#4F4F4F">
              Powered by
            </Typography>
            <Link
              href={combinedWithQueries("https://unsplash.com", {
                utm_source: "thullo-jordy",
                utm_medium: "referral",
              })}
              target="_blank"
            >
              <Box component="img" width="65px" src={unsplashLogo} />
            </Link>
          </Stack>
          <Stack
            onScroll={onListScroll}
            ref={photoListRef}
            sx={{
              overflowY: "scroll",
              overflowX: "hidden",
              "::-webkit-scrollbar": { width: "4px" },
              "::-webkit-scrollbar-thumb ": {
                bgcolor: "#828282",
                borderRadius: "8px",
              },
            }}
            spacing={1.5}
            maxHeight="175px"
            px={0.5}
            alignItems="center"
          >
            {photoRows.map((row, idx) => (
              <Stack
                spacing={1}
                direction="row"
                key={`row-${idx}`}
                justifyContent="flex-start"
                width={1}
              >
                {row.photos.map((photo) => (
                  <Box
                    key={photo.id}
                    position="relative"
                    sx={{
                      cursor: "pointer",
                      "&:hover": {
                        "& a": {
                          display: "unset",
                        },
                      },
                    }}
                  >
                    <Box
                      component="img"
                      src={photo.urls.small}
                      onClick={() => onSelectCover(photo)}
                      alt=""
                      width="50px"
                      height="50px"
                      borderRadius="4px"
                    />
                    <Link
                      href={combinedWithQueries(photo.user.links.html, {
                        utm_source: "thullo-jordy",
                        utm_medium: "referral",
                      })}
                      position="absolute"
                      bottom="4px"
                      left={0}
                      fontSize="10px"
                      target="_blank"
                      textOverflow="ellipsis"
                      py={0.25}
                      px={0.5}
                      overflow="hidden"
                      color="#FFF"
                      bgcolor="rgba(0,0,0,0.6)"
                      width="50px"
                      boxSizing="border-box"
                      whiteSpace="nowrap"
                      display="none"
                      sx={{
                        borderBottomLeftRadius: "4px",
                        borderBottomRightRadius: "4px",
                      }}
                    >
                      {photo.user.name}
                    </Link>
                  </Box>
                ))}
              </Stack>
            ))}
          </Stack>
        </Stack>
      </Stack>
    </ThemedPopover>
  );
};

const appendPhotosToRows = (
  photos: UnsplashPhoto[],
  rows: PickerPhotoRow[],
  clearRows = false
) => {
  const newRows: PickerPhotoRow[] = clearRows ? [] : [...rows];
  let newRow: PickerPhotoRow = {
    photos: [],
  };

  photos.forEach((photo, idx) => {
    if (idx % 4 === 0) {
      if (newRow.photos.length) {
        newRows.push(newRow);
      }
      newRow = {
        photos: [],
      };
      newRow.photos.push(photo);
    } else {
      newRow.photos.push(photo);
    }
  });

  newRows.push(newRow);

  return newRows;
};

export default CoverPopover;
