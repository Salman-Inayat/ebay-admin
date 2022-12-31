// @mui
import { styled } from "@mui/material/styles";
import { Container, Stack, Button } from "@mui/material";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import authInstance from "../../src/axios/authInstance";
import { useNavigate } from "react-router-dom";

// components
import Page from "../components/Page";
// sections
// ----------------------------------------------------------------------

const RootStyle = styled("div")(({ theme }) => ({
  [theme.breakpoints.up("md")]: {
    display: "flex",
  },
}));

const ContentStyle = styled("div")(({ theme }) => ({
  maxWidth: 480,
  margin: "auto",
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  flexDirection: "column",
  padding: theme.spacing(12, 0),
}));

// ----------------------------------------------------------------------

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const verifyEmail = async () => {
    const verifySignUpResponse = await authInstance.get(
      `/email-verification/${token}`
    );

    const toastid = toast.loading("processing");

    toast.update(toastid, {
      render: `${verifySignUpResponse.data.message}.
      Redirecting to login page...`,
      type: "success",
      isLoading: false,
      autoClose: 2000,
    });

    setTimeout(() => {
      navigate("/login", { replace: true });
    }, 2000);
  };

  return (
    <Page title="Verify Email">
      <RootStyle>
        <Container maxWidth="sm">
          <ContentStyle>
            <Stack>
              <Button
                variant="contained"
                color="primary"
                size="large"
                fullWidth
                onClick={() => verifyEmail()}
              >
                Verify Email
              </Button>
            </Stack>
          </ContentStyle>
        </Container>
      </RootStyle>
    </Page>
  );
}
