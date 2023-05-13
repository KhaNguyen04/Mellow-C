import { Box, TextField, Stack, Select, MenuItem, Button, CircularProgress } from "@mui/material";
import {
    useMutation,
    useQuery,
    useQueryClient
} from "@tanstack/react-query";
import { useState, useContext } from "react";
import { deleteCategory, getCategories } from "../api/data";

import { AccountContext } from '../api/Account';

import { redirect, useParams, useNavigate } from 'react-router-dom';


function DeleteCategoryForm(props) {

  const navigate = useNavigate();

  const {getSession, logOut} = useContext(AccountContext);

    // Add Task update to API file. Calls backend.
    const queryClient = useQueryClient();

    // Handle fetching data
    const { isLoading: categoriesQueryLoading, error: categoriesQueryError, data: categoriesQueryData, isFetching: categoriesQueryFetching } = useQuery({
      queryKey: ["categories", getSession],
      queryFn: async (queryArgs) => {
          const res = await getCategories(queryArgs.queryKey[1]); // query arguments start from 1
          return res;
      },
      staleTime: Infinity, // do not refetch data once loaded
      retryDelay: 0, // retry instantly if an error occurs,
      retry: true
  });

  const mutationDeleteCategory = useMutation(deleteCategory, {
      onSettled: async () => {
          return (
              await queryClient.invalidateQueries(['tasklist']),
              await queryClient.invalidateQueries(['categories']),
              (categoriesQueryData && categoriesQueryData.findIndex((item) => item.category_id == props.categoryID) != -1 && 
              categoriesQueryData[categoriesQueryData.findIndex((item) => item.category_id == props.categoryID) - 1]) ?
              navigate('/tasks/category/' + categoriesQueryData[categoriesQueryData.findIndex((item) => item.category_id == props.categoryID) - 1]["category_id"]) : 
              (categoriesQueryData[categoriesQueryData.findIndex((item) => item.category_id == props.categoryID) + 1]) ?
              navigate('/tasks/category/' + categoriesQueryData[categoriesQueryData.findIndex((item) => item.category_id == props.categoryID) + 1]["category_id"]) :
              navigate('/tasks/all')
              
          )
      },
      onSuccess: () => {
        props.activateClose();
      },
      retryDelay: 0,
      retry: true
  });

  // Button Click Handlers
  const handleDeleteCategory = () => {
    mutationDeleteCategory.mutate({"getSession": getSession, "category": props.categoryID}); // already have categoryID from the URL
  };

    // Handle mutating/changing data
    // Use default category id as first in categories data.
    const [category, setCategory] = useState(categoriesQueryData[0]["category_id"]);

    const [clickedDelete, setClickedDelete] = useState(false);

    return (
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'white',
          boxShadow: 5,
          padding: '3vw',
        }}>
          <h1> Delete a Category </h1>
          <Stack spacing={2}>
            <h3> Are you sure you want to delete this category? This cannot be undone. </h3>

            {clickedDelete &&
              <div style={{display: "flex", justifyContent: "center"}}>
                <CircularProgress style={{color: "blue"}}/>
              </div>
            }

            <Button onClick={() => { handleDeleteCategory(); setClickedDelete(true); }} color="error" variant="contained"> Delete </Button>
          </Stack>
        </Box>
    );
}

export default DeleteCategoryForm;