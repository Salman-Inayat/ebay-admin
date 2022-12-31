import React, { useState } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Menu,
  MenuItem,
  IconButton,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";

import userInstance from "src/axios/userInstance";

export default function UsersTable({ users, fetchUsers }) {
  console.log({ users });
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (event) => {
    event.stopPropagation();
    setAnchorEl(null);
  };

  const renderMenuOptions = (user) => {
    const options = [
      {
        name: user?.status === "Suspended" ? "Unsuspend" : "Suspend",
        handler: () =>
          user?.status !== "Suspended"
            ? suspendUser(selectedUser._id)
            : unsuspendUser(selectedUser._id),
      },

      {
        name: user?.status === "Blocked" ? "Unblock" : "Block",
        handler: () =>
          user?.status !== "Blocked"
            ? blockUser(selectedUser._id)
            : unBlockUser(selectedUser._id),
      },
      {
        name: "Delete",
        handler: () => deleteUser(selectedUser._id),
      },
    ];

    return options.map((option) => (
      <MenuItem
        key={option.name}
        onClick={(event) => {
          option.handler(selectedUser._id);
          handleClose(event);
        }}
      >
        {option.name}
      </MenuItem>
    ));
  };

  const suspendUser = async (userId) => {
    await userInstance.patch(`/suspend/${userId}`);
    fetchUsers();
  };

  const unsuspendUser = async (userId) => {
    await userInstance.patch(`/unsuspend/${userId}`);
    fetchUsers();
  };

  const blockUser = async (userId) => {
    await userInstance.patch(`/block/${userId}`);
    fetchUsers();
  };

  const unBlockUser = async (userId) => {
    await userInstance.patch(`/unblock/${userId}`);
    fetchUsers();
  };

  const deleteUser = async (userId) => {
    await userInstance.delete(`/${userId}`);
    fetchUsers();
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell> Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Subscribed </TableCell>
            <TableCell>Email Verified </TableCell>
            {/* <TableCell>Status </TableCell> */}
            {/* <TableCell>Actions </TableCell> */}
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <TableRow
              key={user._id}
              sx={{
                "&:last-child td, &:last-child th": { border: 0 },
              }}
            >
              <TableCell component="th" scope="user">
                {user.firstName} {user.lastName}
              </TableCell>
              <TableCell component="th" scope="user">
                {user.email}
              </TableCell>

              <TableCell component="th" scope="user">
                {user.isSubscribed ? "Yes" : "No"}
              </TableCell>
              <TableCell component="th" scope="user">
                {Boolean(user.emailVerified) ? "Yes" : "No"}
              </TableCell>
              {/* <TableCell component="th" scope="user">
                {user.status}
              </TableCell> */}
              {/* <TableCell component="th" scope="user">
                <IconButton
                  aria-label=""
                  onClick={(event) => {
                    event.stopPropagation();
                    setSelectedUser(user);
                    handleClick(event);
                  }}
                >
                  <MoreVertIcon />
                </IconButton>
                <Menu
                  id="basic-menu"
                  anchorEl={anchorEl}
                  open={open}
                  onClose={(event) => {
                    handleClose(event);
                  }}
                >
                  {renderMenuOptions(selectedUser)}
                </Menu>
              </TableCell> */}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
