import { Box, TextField, Stack, Select, MenuItem, CircularProgress } from "@mui/material";
import {
    useMutation,
    useQuery,
    useQueryClient
} from "@tanstack/react-query";
import { useState,useContext } from "react";
import { addTask, getCategories } from "../api/data";
import { AccountContext } from '../api/Account';

function AddTaskForm(props) {

    const {getSession, logOut}=useContext(AccountContext);

    // Add Task update to API file. Calls backend.
    const queryClient = useQueryClient();

    const [valueError, setValueError] = useState(false);

    const mutationAddTask = useMutation(addTask, {
        // Always run even if not success
        onSettled: () => {
          queryClient.invalidateQueries(['tasklist'])
        },
        onSuccess: () => {
          console.log("SUCCESS: ADDED TASK!");
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

    // Handle fetching data
      const { isLoading: categoriesQueryLoading, error: categoriesQueryError, data: categoriesQueryData, isFetching: categoriesQueryFetching } = useQuery({
        queryKey: ["categories", getSession],
        queryFn: async (queryArgs) => {
            const res = await getCategories(queryArgs.queryKey[1]); // query arguments start from 1
            return res;
        },
        retryDelay: 0,
        retry: true
    });

    // Handle mutating/changing data
    const [task, setTask] = useState({
      'id': Date.now(),
      'name': '',
      'category': '',
      'time': '',
      'date': '',
      'description': '',
      'finished': false
    });

    const setTaskProperty = (value) => {
      setTask(task => ({
        ...task,
        ...value
      }));
    };

    const [clickedAdd, setClickedAdd] = useState(false);

    // Button Click Handlers
    const handleAddTask = (category) => {
      mutationAddTask.mutate({"getSession": getSession, "task": task});
    };

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
          borderRadius: "1rem",
        }}
        >
          <Stack spacing={2}>
            <h1 style={{textAlign: "center"}}> Add a Task </h1>
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
            
            <button 
              style={{
                fontFamily:'Varela Round', 
                justifyContent: "center", 
                fontWeight: '600', 
                height: '3em', 
                textTransform: 'none', 
                backgroundColor: "#FEC887", 
                borderRadius: '1em'
              }} 
              onClick={() => { handleAddTask(task); setClickedAdd(true); }}
            >
              Add 
            </button>

            
          </Stack>
        </Box>
        
    );
}

export default AddTaskForm;