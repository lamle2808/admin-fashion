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
      headerClassName: 'super-app-theme--header',
      cellClassName: 'super-app-theme--cell',
    },
    {
      field: "quantity",
      headerName: "Số lượng",
      width: 90,
      editable: true,
      headerClassName: 'super-app-theme--header',
      cellClassName: 'super-app-theme--cell',
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: "importPrice",
      headerName: "Giá nhập",
      width: 110,
      editable: true,
      headerClassName: 'super-app-theme--header',
      cellClassName: 'super-app-theme--cell',
      headerAlign: 'right',
      align: 'right',
      valueFormatter: (params) => `${Number(params.value).toLocaleString()} VNĐ`,
    },
    {
      field: "actions",
      headerName: "Xóa",
      type: "actions",
      flex: 0.5,
      headerClassName: 'super-app-theme--header',
      getActions: (params) => {
        let actions = [
          <>
            <Tooltip title="Xóa" placement="left">
              <IconButton 
                onClick={() => handleDeleteClick(params.id)}
                sx={{
                  color: '#f44336',
                  '&:hover': {
                    backgroundColor: '#ffebee',
                  }
                }}
              >
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
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        overflow: "hidden",
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
          border: 'none',
          '& .super-app-theme--header': {
            backgroundColor: '#e3f2fd',
            color: '#1976d2',
            fontWeight: 'bold',
          },
          '& .super-app-theme--cell': {
            '&:hover': {
              backgroundColor: '#f5f5f5',
            },
          },
          '& .MuiDataGrid-row:hover': {
            backgroundColor: '#f5f5f5',
          },
          '& .MuiDataGrid-row:nth-of-type(odd)': {
            backgroundColor: '#fafafa',
          },
          '& .MuiDataGrid-cell': {
            borderBottom: '1px solid #e0e0e0',
          },
          '& .MuiDataGrid-columnHeaders': {
            borderBottom: '2px solid #bbdefb',
          },
          '& .MuiDataGrid-footerContainer': {
            borderTop: '2px solid #bbdefb',
          },
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
