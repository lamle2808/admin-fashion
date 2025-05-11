import { Box, Divider, Stack, TextField, Typography } from "@mui/material";

import { useEffect } from "react";

import { dataLaptop, dataPhone } from "./data";
import React from "react";

function TsoKyThuat(props) {
  console.log("data", props.data);
  useEffect(() => {
    if (props.data === "") {
      if (props.categoryName === 1) {
        props.setData(dataLaptop);
      } else if (props.categoryName === 2) {
        props.setData(dataPhone);
      }
    }
  }, [props.categoryName, props]);

  function handleInputChange(event, index, key) {
    const updatedUsers = [...props.data];
    updatedUsers[index][key] = event;
    props.setData(updatedUsers);
  }
  if (props.data !== "") {
    return (
      <Box
        sx={{
          height: "80vh",
          overflow: "auto",
          paddingRight: 2,
        }}
      >
        <Divider />
        {props.data.map((item, i) => (
          <Stack
            direction={"row"}
            key={item.id}
            sx={{
              paddingRight: 5,
              backgroundColor: i % 2 === 0 ? "#f0f0f0" : "white",
              height: 100,
              display: "flex",
              alignItems: "center",
              borderRadius: 5,
              paddingLeft: 2,
            }}
          >
            <Box
              sx={{
                height: 80,
                width: 150,
                display: "flex",
                alignItems: "center",
              }}
            >
              <Typography variant="subtitle1">
                {item.specificationName}
              </Typography>
            </Box>

            <Box sx={{ flex: 1 }}>
              <TextField
                sx={{ minWidth: 200 }}
                label={item.name}
                variant="outlined"
                fullWidth
                multiline
                rows={2}
                value={item.specificationValue || ""}
                onChange={(e) =>
                  handleInputChange(e.target.value, i, "specificationValue")
                }
              />
            </Box>
          </Stack>
        ))}
      </Box>
    );
  }
}

export default TsoKyThuat;
