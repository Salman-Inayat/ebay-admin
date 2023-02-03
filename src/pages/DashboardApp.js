import { Grid, Container, Typography, CircularProgress } from "@mui/material";

// components
import Page from "../components/Page";
// sections
import DashboardSection from "../sections/@dashboard";

export default function DashboardApp() {
  return (
    <Page title="Dashboard">
      <Container maxWidth="xl">
        <DashboardSection />
      </Container>
    </Page>
  );
}
