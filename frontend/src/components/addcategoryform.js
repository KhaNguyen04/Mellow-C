import { Box, TextField, Stack, Checkbox, CircularProgress } from "@mui/material";
import {
    useMutation,
    useQueryClient
} from "@tanstack/react-query";
import { useState, useContext } from "react";
import { addCategory } from "../api/data";

import { AccountContext } from '../api/Account';
import styled from "@emotion/styled";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CircleIcon from '@mui/icons-material/Circle';

import "./addcategoryform.css"


function AddCategoryForm(props) {

  const {getSession, logOut} = useContext(AccountContext);

    // Add Task update to API file. Calls backend.
    const queryClient = useQueryClient();

    const [valueError, setValueError] = useState(false);

    const mutationAddCategory = useMutation(addCategory, {
        onSettled: () => {
            queryClient.invalidateQueries(['categories'])
        },
        onSuccess: () => {
          setValueError(false);
          props.activateClose();
        },
        onError: (error) => {
          console.log("ERRRORRRR!");
          if(error.statusCode === 404) {
            setValueError(true);
          }
        },
        retryDelay: 0,
        retry: true
    });

    // Button Click Handlers
    const handleAddCategory = (category) => {
      mutationAddCategory.mutate({"getSession": getSession, "category": category});
    };

    // Handle mutating/changing data
    const [category, setCategory] = useState({
      category_name: "",
      category_color: "#808080"
    });

    const setCategoryProperty = (value) => {
      console.log("Color: ", value);
      setCategory(task => ({
        ...task,
        ...value
      }));
    };

    const ColorSelect = styled(Checkbox)(({ theme }) => ({
      color: "green",
      "&$checked": {
        backgroundColor: "green",
        color: "green"
      },
    }));

    const [clickedAdd, setClickedAdd] = useState(false);

    return (
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'white',
          boxShadow: 5,
          padding: '1vw',
          borderRadius: "1rem"
        }}>
          <Stack spacing={2}>
            <h1 style={{textAlign: "center"}}> Add a Category </h1>

            <Stack spacing={2} direction={"row"} style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
              <TextField
                id="name"
                label="Name"
                maxRows={4}
                value={category.category_name}
                onChange={(event) => {setCategoryProperty({'category_name': event.target.value});}}
              />
              
              {/* <div class="color-pick" style={{
                width:"2em",
                height: "2em",
                overflow: "hidden",
                borderRadius: "100%"
              }}> */}
                <input
                  className="addcategoryform-color-picker"
                  id="addcategoryform-color-picker" 
                  type="color" 
                   list=""
                  value={category.category_color} 
                  onChange={(event) => {setCategoryProperty({'category_color': event.target.value});}}
                  style={{
                    borderRadius: '0%',
                    width: "3em",
                    height: "3em",
                    padding: 0,
                    border: 'none',
                    backgroundColor: category.category_color,
                    boxShadow: '0 0 0 1px #ccc',
                    appearance: 'none',
                    WebkitAppearance: 'none',
                    MozAppearance: 'none',
                    marginLeft: "2em"
                  }}
                />
              {/* </div> */}

            </Stack>

            {clickedAdd &&
              <div style={{display: "flex", justifyContent: "center"}}>
                <CircularProgress style={{color: "blue"}}/>
              </div>
            }

            {valueError &&
              <div style={{display: "flex", justifyContent: "center"}}>
                <h2> Error with request! Please make sure everything is filled out! </h2>
              </div>
            }
      
            <button style={{fontFamily:'Varela Round', justifyContent: "center", fontWeight: '600', height: '3em', textTransform: 'none', backgroundColor: "#FEC887", borderRadius: '1em', marginLeft: "3em", marginRight: "3em", marginTop: "3em"}} onClick={() => {handleAddCategory(category); setClickedAdd(true); }}> Add </button>
          </Stack>
        </Box>
    );
}

export default AddCategoryForm;