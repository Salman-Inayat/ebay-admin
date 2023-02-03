import React, { useState } from "react";
import {
  Grid,
  Container,
  Typography,
  CircularProgress,
  Stack,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from "@mui/material";
import botInstance from "src/axios/botInstance";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { toast } from "react-toastify";

function DashboardSection() {
  const [keyword, setKeyword] = useState("");

  const [sellers, setSellers] = useState([]);

  const handleKeywordSearch = async () => {
    try {
      const response = await botInstance.get(
        `/scrap-keyword-products/${keyword}`
      );

      console.log(response.data);

      setSellers(response.data.sellers);

      toast.success(
        "Products are being scanned in the background. You will be notified via email when the process is done",
        {
          position: "bottom-center",
          autoClose: 3000,
          closeOnClick: true,
          pauseOnHover: true,
        }
      );
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <Container>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h4">Bot</Typography>
        </Grid>
        <Grid item xs={12}>
          <Stack direction="column" spacing={2}>
            <Typography variant="body1">Run the scanner</Typography>
            <Stack direction={"row"} spacing={3}>
              <TextField
                id="outlined-basic"
                label="Enter the keyword"
                variant="outlined"
                size="small"
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
        {sellers.length > 0 && (
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
        )}
      </Grid>
    </Container>
  );
}

export default DashboardSection;
