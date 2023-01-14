import {
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Container,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  DialogContentText,
} from "@mui/material";

import { useSelector, useDispatch } from "react-redux";

import { signOut } from "src/store/actions/authActions";

import { useNavigate } from "react-router-dom";

import { useEffect, useState } from "react";
import subscriptionInstance from "src/axios/subscriptionInstance";
import CircularProgress from "@mui/material/CircularProgress";
import { AppWidgetSummary } from "../@dashboard/app";

// ----------------------------------------------------------------------

const PaymentsSection = () => {
  const [details, setDetails] = useState({
    totalEarnings: 0,
    expectedEarnings: 0,
    subscriptionPrice: 0,
  });
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const [newPrice, setNewPrice] = useState();

  useEffect(() => {
    fetchEarnings();
  }, []);

  const fetchEarnings = async () => {
    try {
      setLoading(true);
      const response = await subscriptionInstance.get("/earnings");
      setDetails({
        totalEarnings: response.data.totalEarnings,
        expectedEarnings: response.data.expectedEarnings,
        subscriptionPrice: response.data.subscriptionPrice,
      });
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdateSubscriptionPrice = async () => {
    try {
      await subscriptionInstance.post("/update-subscription-price", {
        price: newPrice,
      });
      setOpen(false);
      setNewPrice("");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "80%",
            height: "80%",
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <Container maxWidth="xl">
          <Grid container spacing={3}>
            <Grid item xs={12} md={12}>
              <Typography variant="h4" gutterBottom>
                Payments
              </Typography>
            </Grid>
            <Grid item xs={12} md={12}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <AppWidgetSummary
                    title="Total earnings (USD)"
                    total={details.totalEarnings}
                    icon="eva:credit-card-fill"
                    color="success"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <AppWidgetSummary
                    title="Expected earnings (USD)"
                    total={details.expectedEarnings}
                    icon="eva:credit-card-fill"
                    color="info"
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid container spacing={3} mt={5}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Subscription price
              </Typography>

              <Typography variant="body1" gutterBottom>
                $10
              </Typography>
            </Grid>

            <Grid item xs={12} md={12}>
              <Button variant="contained" onClick={() => setOpen(true)}>
                Change subscription price
              </Button>
            </Grid>
          </Grid>

          <Dialog open={open} onClose={() => setOpen(false)}>
            <DialogTitle>Change subscription price</DialogTitle>
            <DialogContent>
              <DialogContentText sx={{ mb: 3 }}>
                Enter new price for subscription
              </DialogContentText>

              <TextField
                label="New price"
                type="number"
                variant="outlined"
                fullWidth
                sx={{ mb: 3 }}
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value)}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpen(false)}>Cancel</Button>
              <Button
                onClick={handleUpdateSubscriptionPrice}
                disabled={newPrice === undefined || newPrice === ""}
              >
                Confirm
              </Button>
            </DialogActions>
          </Dialog>
        </Container>
      )}
    </>
  );
};

export default PaymentsSection;
