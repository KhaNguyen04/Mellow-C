import { Box, TextField, Stack, Select, MenuItem, CircularProgress } from "@mui/material";
import {
    useMutation,
    useQuery,
    useQueryClient
} from "@tanstack/react-query";
import { useState,useContext } from "react";
import { addTask, editTask, getCategories } from "../api/data";
import { AccountContext } from '../api/Account';
import { click } from "@testing-library/user-event/dist/click";

function EditTaskForm(props) {
    const {getSession,logOut}=useContext(AccountContext);

    const {id, name, category, time, date, description, finished} = props.task;

    // Add Task update to API file. Calls backend.
    const queryClient = useQueryClient();

    const mutationEditTask = useMutation(editTask, {
        // Always run even if not success
        onSettled: () => {
          queryClient.invalidateQueries(['tasklist'])
        },
        onSuccess: () => {
          props.activateClose();
        },
        onError: () => {
          console.log("ERROR: EDIT TASK!");
        },
        retryDelay: 0
    });

    // Handle fetching data
      const { isLoading: categoriesQueryLoading, error: categoriesQueryError, data: categoriesQueryData, isFetching: categoriesQueryFetching } = useQuery({
        queryKey: ["categories", getSession],
        queryFn: async (queryArgs) => {
            const res = await getCategories(queryArgs.queryKey[1]); // query arguments start from 1
            return res;
        },
        retryDelay: 0
    });

    // Handle mutating/changing data
    const [task, setTask] = useState({
      'id': id,
      'name': name,
      'category': category,
      'time': new Date(date + ", " + time).toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit', hour12: false}).replace('24:00', '00:00'),
      'date': new Date(date + ", " + time).toLocaleDateString('fr-CA'), // need "fr-CA" to get the format "yyyy-mm-dd", which the date input needs
      'description': description,
      'finished': finished
    });

    const setTaskProperty = (value) => {
      setTask(task => ({
        ...task,
        ...value
      }));
    };
  
    // Button Click Handlers
    const handleEditTask = (category) => {
      mutationEditTask.mutate({"getSession": getSession, "task": task, "taskID": id});
    };

    const [clickedEdit, setClickedEdit] = useState(false);

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
        }}
        >
          <Stack spacing={2}>
            <h1 style={{textAlign: "center"}}> Edit a Task </h1>
            <TextField
              id="name"
              label="Name"
              maxRows={4}
              value={task.name}
              onChange={(event) => {setTaskProperty({'name': event.target.value});}}
            />
            <TextField
              id="description"
              label="Description"
              value={task.description}
              onChange={(event) => {setTaskProperty({'description': event.target.value});}}
              multiline
              rows={4}
            />

            <Select
                id="category"
                value={task.category}
                label="Category"
                onChange={(event) => {setTaskProperty({'category': event.target.value});}}
              >
                {categoriesQueryData && categoriesQueryData.map((item, index) => {
                  const {category_id, user_id, category_name, color_code} = item;
                  return (
                    <MenuItem key={category_id} value={category_id}> {category_name} </MenuItem>
                  )
                })}
            </Select>

            <Stack direction={"row"} sx={{width: "100%"}}>
              <input
                type="time"
                onChange={(event) => {setTaskProperty({'time': event.target.value});}}
                min="00:00"
                max="23:59"
                step="60"
                value={task.time}
                style={{width: "100%", marginRight: "1em", height: "3em", paddingLeft: "0.9em"}}
              />
              <input
                type="date"
                onChange={(event) => {setTaskProperty({'date': event.target.value});}}
                value={task.date}
                style={{width: "100%", height: "3em", paddingLeft: "0.9em"}}
              />
            </Stack>

            {clickedEdit &&
              <div style={{display: "flex", justifyContent: "center"}}>
                <CircularProgress style={{color: "blue"}}/>
              </div>
            }

            <button style={{fontFamily:'Varela Round', justifyContent: "center", fontWeight: '600', height: '3em', textTransform: 'none', backgroundColor: "#FEC887", borderRadius: '1em'}} onClick={() => { handleEditTask(task); setClickedEdit(true); }}> Edit </button>

            
          </Stack>
        </Box>
        
    );
}

export default EditTaskForm;