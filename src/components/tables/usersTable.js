import { useState } from "react";
import { Box } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

const columns = [
  {
    field: "id",
    headerName: "ID",
    flex: 0.1,
  },
  {
    field: "name",
    headerName: "Name",
    flex: 0.3,
  },
  {
    field: "email",
    headerName: "Email",
    sortable: false,
    flex: 0.3,
  },
  {
    field: "subscribed",
    headerName: "Subscribed",
    flex: 0.1,
  },
  {
    field: "emailVerified",
    headerName: "Email Verified",
    flex: 0.1,
  },
];

export default function UsersTable({ users }) {
  const [pageSize, setPageSize] = useState(25);
  let updatedUsers = users?.map((user, index) => {
    return {
      id: index + 1,
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      subscribed: user.isSubscribed ? "Yes" : "No",
      emailVerified: user.emailVerified ? "Yes" : "No",
    };
  });

  return (
    <Box sx={{ height: "100%", width: "100%", flexGrow: 1 }}>
      <DataGrid
        rows={updatedUsers}
        columns={columns}
        pageSize={pageSize}
        rowsPerPageOptions={[25, 50, 100]}
        disableSelectionOnClick
        experimentalFeatures={{ newEditingApi: true }}
        autoHeight
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        pagination
      />
    </Box>
  );
}
