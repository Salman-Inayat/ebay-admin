import * as Yup from "yup";
import { useFormik, Form, FormikProvider } from "formik";
import { Link as RouterLink } from "react-router-dom";
// material
import { Link, Box, Stack, TextField, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
// component
import userInstance from "src/axios/userInstance";
import { toast } from "react-toastify";
import authInstance from "src/axios/authInstance";

// ----------------------------------------------------------------------

export default function ForgotPasswordForm() {
  const LoginSchema = Yup.object().shape({
    email: Yup.string()
      .email("Email must be a valid email address")
      .required("Email is required"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: LoginSchema,
    onSubmit: async (
      values,
      { setErrors, resetForm, setStatus, setSubmitting }
    ) => {
      const toastid = toast.loading("processing");
      try {
        const userResponse = await authInstance.post("/forgot-password", {
          email: values.email,
        });
        toast.update(toastid, {
          render: `email has been sent`,
          type: "success",
          isLoading: false,
          autoClose: 2000,
        });
        console.log(userResponse);
        resetForm();
      } catch (err) {
        toast.update(toastid, {
          render: err.response.data.message,
          type: "error",
          isLoading: false,
          autoClose: 2000,
        });
        setErrors({ error: err.response.data.message });
      }
    },
  });

  const { errors, touched, isSubmitting, handleSubmit, getFieldProps } = formik;

  return (
    <Box>
      <Typography variant="h4" marginBottom="3rem" color="#8C30F5">
        Forgot Password
      </Typography>
      <FormikProvider value={formik}>
        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
          <Stack spacing={3} marginBottom="2rem">
            <TextField
              fullWidth
              autoComplete="username"
              type="email"
              label="Email address"
              {...getFieldProps("email")}
              error={Boolean(touched.email && errors.email)}
              helperText={touched.email && errors.email}
            />
          </Stack>
          <Stack direction="row" justifyContent="flex-end" sx={{ my: 2 }}>
            <Link
              component={RouterLink}
              variant="subtitle2"
              to="/"
              underline="hover"
            >
              Login
            </Link>
          </Stack>
          <LoadingButton
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            loading={isSubmitting}
          >
            Confirm
          </LoadingButton>
        </Form>
      </FormikProvider>
    </Box>
  );
}
