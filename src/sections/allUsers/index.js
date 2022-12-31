import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Container,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import userInstance from "src/axios/userInstance";
import UsersTable from "src/components/tables/usersTable";

const UsersViewSection = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const response = await userInstance.get("/all");
    console.log("Users: ", response.data);
    setUsers(response.data.users);
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        backgroundColor: "#ededed",
        flex: 1,
        borderRadius: "1rem",
      }}
    >
      <Grid container py={7} px={4} spacing={3}>
        <Grid item md={12} display="flex" justifyContent="center">
          <Typography variant="h4" fontWeight="bold">
            All Users
          </Typography>
        </Grid>
        <Grid item md={12} display="flex" justifyContent="center">
          <UsersTable users={users} fetchUsers={fetchUsers} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default UsersViewSection;
