import { Box, IconButton, Tooltip } from "@mui/material";
import React from "react";
import { DataGrid, GridCellEditStopReasons } from "@mui/x-data-grid";

import DeleteIcon from "@mui/icons-material/Delete";

const Table = (props) => {
  const handleDeleteClick = (id) => {
    const removeItem = props.products.filter((todo) => {
      return todo.id !== id;
    });
    return props.setProducts(removeItem);
  };

  const columns = [
    {
      field: "name",
      headerName: "Tên",
      flex: 1,
      editable: true,
    },
    {
      field: "quantity",
      headerName: "Số lượng",
      width: 80,
      editable: true,
    },
    {
      field: "importPrice",
      headerName: "Giá nhập",
      width: 80,
      editable: true,
    },
    {
      field: "actions",
      headerName: "Xóa",
      type: "actions",
      flex: 0.5,
      getActions: (params) => {
        let actions = [
          <>
            <Tooltip title="Xóa" placement="left">
              <IconButton onClick={() => handleDeleteClick(params.id)}>
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </>,
        ];

        return actions;
      },
    },
  ];

  const processRowUpdate = (newRow) => {
    const updatedRow = { ...newRow };
    props.setProducts(
      props.products.map((row) => (row.id === newRow.id ? updatedRow : row))
    );
    return updatedRow;
  };

  return (
    <Box
      sx={{
        marginTop: 2,
        height: 400,
        width: "100%",
        backgroundColor: "white",
        borderRadius: 5,
      }}
    >
      <DataGrid
        rowHeight={50}
        localeText={{
          toolbarColumns: "Cột",
          toolbarDensity: "Khoảng cách",
          toolbarFilters: "Lọc",
          toolbarExport: "Xuất ",
        }}
        rows={props.products || []}
        columns={columns}
        editMode="row"
        pageSizeOptions={[5, 10, 20]}
        initialState={{
          ...props.products.initialState,
          pagination: { paginationModel: { pageSize: 5 } },
        }}
        getRowHeight={() => "auto"}
        sx={{
          borderRadius: 5,
          "&.MuiDataGrid-root--densityCompact .MuiDataGrid-cell": {
            py: 1,
          },
          "&.MuiDataGrid-root--densityStandard .MuiDataGrid-cell": {
            py: "8px",
          },
          "&.MuiDataGrid-root--densityComfortable .MuiDataGrid-cell": {
            py: "10px",
          },
        }}
        // hideFooter
        processRowUpdate={processRowUpdate}
        onCellEditStop={(params, event) => {
          if (params.reason === GridCellEditStopReasons.cellFocusOut) {
            event.defaultMuiPrevented = false;
          }
        }}
      />
    </Box>
  );
};

export default Table;
