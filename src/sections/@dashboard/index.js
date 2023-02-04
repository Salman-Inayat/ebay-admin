import React, { useState } from "react";
import {
  Grid,
  Container,
  Typography,
  LinearProgress,
  Stack,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Autocomplete,
  Chip,
} from "@mui/material";
import botInstance from "src/axios/botInstance";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { toast } from "react-toastify";

function DashboardSection() {
  const [keyword, setKeyword] = useState("");
  const [enteredSellers, setEnteredSellers] = useState({
    sellers: [],
    error: "",
  });
  const [loading, setLoading] = useState(false);
  const [sellers, setSellers] = useState([]);

  const handleKeywordSearch = async () => {
    setLoading(true);
    try {
      const response = await botInstance.get(
        `/scrap-keyword-products/${keyword}`
      );

      console.log(response.data);

      setSellers(response.data.sellers);

      toast.success(response.data.message, {
        position: "bottom-center",
        autoClose: 3000,
        closeOnClick: true,
        pauseOnHover: true,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleProductsSearchBySellers = async () => {
    try {
      const response = await botInstance.post(`/scrap-products-from-sellers`, {
        sellers: enteredSellers.sellers,
      });

      toast.success(response.data.message, {
        position: "bottom-center",
        autoClose: 3000,
        closeOnClick: true,
        pauseOnHover: true,
      });
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <Container>
      <Grid container spacing={5}>
        <Grid item xs={12}>
          <Typography variant="h4">Bot</Typography>
        </Grid>
        <Grid item xs={12}>
          <Stack direction="column" spacing={2}>
            <Typography variant="body1">Run the scanner</Typography>
            <Stack direction={"row"} spacing={3}>
              <TextField
                id="outlined-basic"
                label="Enter the product keyword"
                variant="outlined"
                size="small"
                fullWidth
                onChange={(e) => {
                  setKeyword(e.target.value);
                }}
              />
              <Button
                variant="contained"
                color="primary"
                sx={{ width: "100px" }}
                size="small"
                onClick={() => {
                  handleKeywordSearch();
                }}
                disabled={keyword.length === 0}
              >
                Scan
              </Button>
            </Stack>
          </Stack>
        </Grid>

        {loading ? (
          <Grid item xs={12} mt={5}>
            <LinearProgress />
          </Grid>
        ) : (
          sellers.length > 0 && (
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Scanned Sellers
              </Typography>

              <List>
                {sellers?.map((seller) => (
                  <ListItem disableGutters key={seller}>
                    <ListItemIcon>
                      <ArrowRightIcon />
                    </ListItemIcon>
                    <ListItemText primary={seller} />
                  </ListItem>
                ))}
              </List>
            </Grid>
          )
        )}

        <Grid item xs={12}>
          <Stack direction="column" spacing={2}>
            <Typography variant="h6" gutterBottom>
              Search by sellers
            </Typography>
            <Stack direction={"row"} spacing={3}>
              <Autocomplete
                multiple
                fullWidth
                id="tags-filled"
                options={[]}
                freeSolo
                onChange={(event, newValue) => {
                  if (newValue.length > 5) {
                    setEnteredSellers((prev) => {
                      return {
                        ...prev,
                        error: "You can only enter 5 sellers",
                      };
                    });
                  } else {
                    setEnteredSellers({
                      sellers: newValue,
                      error: "",
                    });
                  }
                }}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      variant="outlined"
                      label={option}
                      {...getTagProps({ index })}
                    />
                  ))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    label="Enter seller names"
                    size="small"
                  />
                )}
              />
              <Button
                variant="contained"
                color="primary"
                sx={{ width: "100px" }}
                size="small"
                onClick={() => {
                  handleProductsSearchBySellers();
                }}
                disabled={
                  enteredSellers.length === 0 || enteredSellers.error !== ""
                }
              >
                Search
              </Button>
            </Stack>
            {enteredSellers.error && (
              <Typography variant="body2" color="error">
                {enteredSellers.error}
              </Typography>
            )}
          </Stack>
        </Grid>
      </Grid>
    </Container>
  );
}

export default DashboardSection;
