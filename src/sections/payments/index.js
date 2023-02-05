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

import { useState } from "react";
import subscriptionInstance from "src/axios/subscriptionInstance";
import CircularProgress from "@mui/material/CircularProgress";
import AppWidgetSummary from "../../components/AppWidgetSummary";

import useSWR, { mutate } from "swr";
import Loader from "src/components/Loader";

const PaymentsSection = () => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const [newPrice, setNewPrice] = useState();

  const fetchEarnings = async () => {
    const response = await subscriptionInstance.get("/earnings");
    return {
      totalEarnings: response.data.totalEarnings,
      expectedEarnings: response.data.expectedEarnings,
      subscriptionPrice: response.data.subscriptionPrice,
    };
  };

  const { data, isLoading } = useSWR(
    "admin/fetchPaymentDetails",
    fetchEarnings
  );

  if (isLoading) return <Loader />;

  const { totalEarnings, expectedEarnings, subscriptionPrice } = data;

  const handleUpdateSubscriptionPrice = async () => {
    setLoading(true);
    try {
      await subscriptionInstance.post("/update-subscription-price", {
        price: newPrice,
      });
      setLoading(false);
      setOpen(false);
      setNewPrice("");

      mutate("admin/fetchPaymentDetails");
    } catch (error) {
      console.log(error);
    }
  };

  return (
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
                total={totalEarnings}
                icon="eva:credit-card-fill"
                color="success"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <AppWidgetSummary
                title="Expected earnings (USD)"
                total={expectedEarnings}
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
            $ {subscriptionPrice}
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
            {loading ? <CircularProgress size={20} /> : "Update"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default PaymentsSection;
