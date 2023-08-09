import FormControl from "@mui/material/FormControl";
import OutlinedInput from "@mui/material/OutlinedInput";
import React from "react";
import Typography from "@mui/material/Typography";
import styles from "./FilterField.module.css";

const FilterField = ({filterValue, setFilterValue, label="Filter", children}) => {
  return (
    <div className={styles.filterBar}>
      <FormControl fullWidth focused={filterValue ? true : false}>
        <OutlinedInput
          id="outlined-basic"
          size="small"
          fullWidth
          placeholder={label}
          value={filterValue}
          onChange={e => setFilterValue(e.target.value || "")}
          color={filterValue ? "error" : ""}
        />
        {!filterValue ? null :
          <Typography
            variant="subtitle1"
            align="center"
            className={styles.clearButton}
            onClick={() => setFilterValue("")}
          >
            Clear
          </Typography>
        }
      </FormControl>
      {children}
    </div>
  );
};

export default FilterField;
