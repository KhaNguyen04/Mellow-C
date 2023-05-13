import * as React from 'react';

import AddTaskPopup from '../components/addtaskpopup';
import TaskView from '../components/taskview';

import { redirect, useParams, useNavigate } from 'react-router-dom';
import { Box, Button, Stack } from '@mui/material';
import AddCategoryPopup from '../components/addcategorypopup';
import DeleteCategoryPopup from '../components/deletecategorypopup';

import { AccountContext } from '../api/Account';
import { deleteCategory, getCategories } from '../api/data';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Folder, FolderOpen } from '@mui/icons-material';



const TasksByCategory = (props) => {

    const navigate = useNavigate();

    const {getSession, logOut} = React.useContext(AccountContext);

    // Add Task update to API file. Calls backend.
    const queryClient = useQueryClient();

    const params = useParams();
    const categoryID = params.id;

    // Handle fetching data
    const { isLoading: categoriesQueryLoading, error: categoriesQueryError, data: categoriesQueryData, isFetching: categoriesQueryFetching } = useQuery({
        queryKey: ["categories", getSession],
        queryFn: async (queryArgs) => {
            const res = await getCategories(queryArgs.queryKey[1]); // query arguments start from 1
            return res;
        },
        staleTime: Infinity, // do not refetch data once loaded
        retryDelay: 0, // retry instantly if an error occurs
    });

    const mutationDeleteCategory = useMutation(deleteCategory, {
        onSettled: async () => {
            return (
                await queryClient.invalidateQueries(['tasklist']),
                await queryClient.invalidateQueries(['categories']),
                (categoriesQueryData && categoriesQueryData.findIndex((item) => item.category_id == categoryID) != -1 && 
                categoriesQueryData[categoriesQueryData.findIndex((item) => item.category_id == categoryID) - 1]) ?
                navigate('/tasks/category/' + categoriesQueryData[categoriesQueryData.findIndex((item) => item.category_id == categoryID) - 1]["category_id"]) : navigate('/tasks/all')
                
            )
        },
        retryDelay: 0
    });

    // Button Click Handlers
    const handleDeleteCategory = () => {
      mutationDeleteCategory.mutate({"getSession": getSession, "category": categoryID}); // already have categoryID from the URL
    };

    // Check if category actually exists, otherwise display not found
    if(categoriesQueryData && categoriesQueryData.findIndex((item) => item.category_id == categoryID) != -1)
    {
        return (
            <Box
                sx={{ 
                    ml: "5vw",
                    mr: "5vw",
                    width: {xs: "calc(100vw - 5vw - 5vw)", sm: "calc(100vw - 5vw - 5vw)", md: "calc(100vw - 240px - 5vw - 5vw - 5vw)"},
                }}
            >
                <Stack direction={"row"} justifyContent={"center"} alignItems={"center"}>
                    <FolderOpen sx={{"color": categoriesQueryData && categoriesQueryData.findIndex((item) => item.category_id == categoryID) != -1 ? 
                        categoriesQueryData[categoriesQueryData.findIndex((item) => item.category_id == categoryID)]["color_code"]
                        : "black"}}/>
                    <h2 style={{ textAlign: "center", marginLeft: "0.5em" }}> 
                    {categoriesQueryData && categoriesQueryData.findIndex((item) => item.category_id == categoryID) != -1 ? 
                        categoriesQueryData[categoriesQueryData.findIndex((item) => item.category_id == categoryID)]["category_name"]
                        : ""} 
                    </h2>
                </Stack>
            
                

                <Stack direction={"row"} padding={"1em"} spacing={"1em"} style={{justifyContent: "right"}}>
                    <DeleteCategoryPopup categoryID={categoryID}/>
                </Stack>
                <TaskView
                    id={"category-" + categoryID}
                    viewType={props.viewType} 
                    type={"all"} 
                    categoryID={categoryID} 
                    disableCategoryBar
                />
            </Box>
        );
    } else {
        return (
            <Box
                sx={{ 
                    ml: "5vw",
                    mr: "5vw",
                    width: {xs: "calc(100vw - 5vw - 5vw)", sm: "calc(100vw - 5vw - 5vw)", md: "calc(100vw - 240px - 5vw - 5vw - 5vw)"},
                }}
            >
                <h2 style={{ textAlign: "center" }}> 
                    404 Not Found
                </h2>
            </Box>
        );
    }
}

export default TasksByCategory;