import { Tab, Tabs, ToggleButtonGroup, ToggleButton, Box, CircularProgress, Divider, LinearProgress, FormControl, InputLabel, Select, MenuItem } from "@mui/material";

import ListIcon from '@mui/icons-material/List';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

import {
    useQuery,
    useMutation,
    useQueryClient
} from "@tanstack/react-query";
import * as React from 'react';

import { getTasks, finishTask, deleteTask, getCategories, useGetTasks, editTask } from "../api/data";
import TaskListView from "./task_listview";
import TaskCalendarView from "./task_calendarview";
import { DataObjectRounded } from "@mui/icons-material";

import { AccountContext } from '../api/Account';

import invert from 'invert-color';

// Calendar Imports
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import dayjs from 'dayjs';

function TaskView(props) {

    const viewType = props.viewType

    const {getSession, logOut} = React.useContext(AccountContext);

    const categoryIDDefault = props.categoryID;
    const disableCategoryBar = props.disableCategoryBar;

    // Date for calendar view
    const [date, setDate] = React.useState(new Date())

    // Handle deleting data, must be above the other return statements
    const queryClient = useQueryClient();
    
    const mutationDelete = useMutation(deleteTask, {
        onSettled: () => {
            queryClient.invalidateQueries(['tasklist'])
        },
        onError: () => {
            console.log("ERROR - DELETE TASK!");
        },
        retryDelay: 0,
        retry: true
    });

    const mutationFinish = useMutation(finishTask, {
        onSettled: () => {
            queryClient.invalidateQueries(['tasklist'])
        },
        retryDelay: 0,
        retry: true
    });

    const mutationEdit = useMutation(editTask, {
        onSettled: () => {
            queryClient.invalidateQueries(['tasklist'])
        },
        retryDelay: 0,
        retry: true
    });

    // Button Click Handlers
    const handleDeleteTask = (e, taskID) => {
        e.stopPropagation();
        mutationDelete.mutate({"getSession": getSession, "taskID": taskID});
    };

    const handleEditTask = (e, task, taskID) => {
        e.stopPropagation();
        mutationEdit.mutate({"getSession": getSession, "task": task, "taskID": taskID});
    };

    const handleFinishTask = (e, taskID, current_status) => {
        e.stopPropagation();
        console.log("toggled to finish a task");
        mutationFinish.mutate({"getSession": getSession, "taskID": taskID, "current_status": current_status});
    };

    // For some reason, if using one vaariable to useQuery and try to do "query.data", invalidateQueries does not work, no immediate updates!
    // So split it out like this, messy so maybe an alternative can be found later:

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
    
    const [categoryFilter, setCategoryFilter] = React.useState(-1); // Default = -1 = "All"

    // Handle fetching data
    const { isLoading: tasksQueryLoading, error: tasksQueryError, data: tasksQueryData, isFetching: tasksQueryFetching } = useQuery({
        queryKey: ["tasklist", getSession, props.type, categoryFilter],
        queryFn: async (queryArgs) => {
            const res = await getTasks(queryArgs.queryKey[1], queryArgs.queryKey[2], queryArgs.queryKey[3]); // query arguments start from 1
            return res;
        },
        staleTime: Infinity, // do not refetch data once loaded
        retryDelay: 0, // retry instantly if an error occurs,
        retry: true
    });

    /* RUN WHEN COMPONENT IS LOADED */
    React.useEffect(() => {
        // Very important to make sure correct category ID is loaded.
        if(categoryIDDefault) 
        {
            setCategoryFilter(categoryIDDefault);
        }
     });

    const handleToggleChange = (event, newFilter) => {
        if(newFilter !== null) {
            setCategoryFilter(newFilter);
        }
      };

    // const [viewType, setViewType] = React.useState("list");

    const TAB_HEIGHT = '36px';

    const tabsStyle = {
        minHeight: TAB_HEIGHT, 
        height: TAB_HEIGHT
    };

    const tabStyle = {
        marginLeft: '6px',
        marginRight: '6px',
        minHeight: TAB_HEIGHT, 
        height: TAB_HEIGHT,
        borderRadius: '0.5em',
        textTransform: 'none', // By default tabs are in all uppercase
    };

    if(tasksQueryLoading || tasksQueryError || categoriesQueryLoading || categoriesQueryError) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
               <CircularProgress style={{color: "blue"}}/>
            </Box>
        )
    }

    const renderCategoryBar = () => {
        if (!disableCategoryBar) {
            return (
            <Box sx={{paddingTop: '1em', paddingBottom: '2em'}} >
                {/* FILTER OPTIONS */}
                <Tabs
                    color="primary"
                    orientation="horizontal"
                    value={categoryFilter}
                    variant="scrollable"
                    scrollButtons="auto"
                    onChange={handleToggleChange}
                    sx={tabsStyle}
                    TabIndicatorProps={{style: {display: 'none'}}} // Do not show the underline for the active tab
                    >
                        <Tab 
                            key={-1} 
                            value={-1} 
                            sx={{
                                ...tabStyle, 
                                border: "1.5px solid",
                                "borderColor": "black",
                                "&.Mui-selected": {
                                    backgroundColor: "#000000",
                                          
                                                color: "#ffffff",
                                                border: "5px solid",
                                                borderColor: "#000000",
                                }
                            }} 
                            label={"All"}
                        />
                        {categoriesQueryData && categoriesQueryData.map((item, index) => {
                            if(item) {
                                const {category_id, user_id, category_name, color_code} = item;
                                var inverted_color = invert(color_code, true);
                                return (
                                    <Tab 
                                        key={category_id} 
                                        value={category_id} 
                                        sx={{
                                            ...tabStyle, 
                                            // "backgroundColor": color_code,
                                            // "color": inverted_color,
                                            // "&.Mui-selected": {
                                            //     backgroundColor: color_code,
                                            //     color: inverted_color,
                                            //     border: "3px solid black"
                                            // }
                                            border: "1.5px solid",
                                            "borderColor": color_code,
                                            "&.Mui-selected": {
                                                backgroundColor: color_code,
                                          
                                                color: inverted_color,
                                                border: "5px solid",
                                                borderColor: color_code,
                                            }
                                         
                                          
                                        }}
                                        label={category_name}
                                    />
                                )
                            }
                        })}
                </Tabs>
            </Box>
            );
        }
    }

    // Functions for the calendar view

    const goToPreviousDate = () => {
        setDate(new Date(date.setDate(date.getDate() - 1)))
    }

    const goToNextDate = () => {
        setDate(new Date(date.setDate(date.getDate() + 1)))
    }

    const renderCalendarPicker = () => {
        return (
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DesktopDatePicker
                className="renderCalendarPicker"
                value={date}
                minDate={new Date('2017-01-01')}
                onChange={(newValue) => {
                    setDate(newValue);
                }}
                sx={{justifyContent: "center"}}
                renderInput={(params) => <TextField className="renderCalendarPickerTextField" {...params} />}
              />
          </LocalizationProvider>
        )
      }

    // Return component HTML/CSS rendering, if no error.
    return (
        <Box>

            {/* {renderCategoryBar()} */}

          
            
            {/* LIST VIEW */}
            <div style={{"display": (viewType == "list") ? "block": "none"}}>
                <TaskListView key={props.id} disableCategoryBar={disableCategoryBar} renderCategoryBar={renderCategoryBar} data={tasksQueryData} categories={categoriesQueryData} handleFinishTask={handleFinishTask} handleDeleteTask={handleDeleteTask}/>
            </div>

            {/* CALENDAR VIEW */}
            <div style={{"display": (viewType == "calendar") ? "block": "none"}}>
                <TaskCalendarView
                    renderCategoryBar={renderCategoryBar}
                    data={tasksQueryData}
                    categories={categoriesQueryData}
                    handleFinishTask={handleFinishTask}
                    handleDeleteTask={handleDeleteTask}
                    date={date}
                    goToPreviousDate={goToPreviousDate}
                    goToNextDate={goToNextDate}
                    renderCalendarPicker={renderCalendarPicker}
                />
            </div>

        </Box>
    );
}

export default TaskView;