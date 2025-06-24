import {
  Box,
  Button,
  Card,
  FormControl,
  Grid,
  Link,
  TextField,
  Typography,
} from "@mui/material";

function RegisterForm() {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        margin: "auto",
        mt: 5,
      }}
    >
      <Card
        sx={{
          p: 4,
          width: 400,
        }}
      >
        <Typography variant="h4" gutterBottom sx={{ textAlign: "center" }}>
          Sign up
        </Typography>
        <form>
          <Grid container spacing={2}>
            <FormControl sx={{ mt: 2 }} fullWidth>
              <Typography variant="body1" gutterBottom>
                Username
              </Typography>
              <TextField
                name="username"
                placeholder="Your username"
                required
                fullWidth
              />
            </FormControl>

            <FormControl sx={{ mt: 2 }} fullWidth>
              <Typography variant="body1" gutterBottom>
                First Name
              </Typography>
              <TextField
                name="firstname"
                placeholder="Your first name"
                required
                fullWidth
              />
            </FormControl>

            <FormControl sx={{ mt: 2 }} fullWidth>
              <Typography variant="body1" gutterBottom>
                Last Name
              </Typography>
              <TextField
                name="lastname"
                placeholder="Your last name"
                required
                fullWidth
              />
              <FormControl />

              <FormControl sx={{ mt: 2 }} fullWidth>
                <Typography variant="body1" gutterBottom>
                  Email
                </Typography>
                <TextField
                  name="mailaddress"
                  placeholder="Your email address"
                  required
                  fullWidth
                />
              </FormControl>

              <FormControl sx={{ mt: 2 }} fullWidth>
                <Typography variant="body1" gutterBottom>
                  Password
                </Typography>
                <TextField
                  name="password1"
                  type="password"
                  placeholder="Your password"
                  required
                  fullWidth
                />
              </FormControl>

              <FormControl sx={{ mt: 2 }} fullWidth>
                <Typography variant="body1" gutterBottom>
                  Repeat Password
                </Typography>
                <TextField
                  name="password2"
                  type="password"
                  placeholder="Repeat your password"
                  required
                  fullWidth
                />
              </FormControl>

              <Button sx={{ mt: 2 }} variant="contained" color="primary">
                Create Account
              </Button>

              <Box sx={{ mt: 1, textAlign: "center" }}>
                <Typography variant="body1">
                  Already have an account? &nbsp;
                  <Link href="/signin" underline="hover">
                    Sign in
                  </Link>
                </Typography>
              </Box>
            </FormControl>
          </Grid>
        </form>
      </Card>
    </Box>
  );
}

export default RegisterForm;
