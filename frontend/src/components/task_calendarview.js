import React, { useState, useEffect, useMemo } from 'react'
import { Box, Grid, Stack, Typography, IconButton, Accordion, AccordionSummary, AccordionDetails, Tab, Tabs, Divider } from "@mui/material";

import ThreeDotButtonTask from "./task_threedotbutton";
import DeleteIcon from "@mui/icons-material/Delete";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';

function TaskCalendarView(props) {
    const data = props.data;
    const categories = props.categories;
    const handleFinishTask = props.handleFinishTask;
    const handleDeleteTask = props.handleDeleteTask;

    const renderCategoryBar = props.renderCategoryBar

    const date = props.date
    const goToPreviousDate = props.goToPreviousDate
    const goToNextDate = props.goToNextDate
    const renderCalendarPicker = props.renderCalendarPicker

    const filterTaskByDate = () => {
        const filteredData = data.filter(task => 
        parseTaskDate(task.date).getDate() === date.getDate() &&
        parseTaskDate(task.date).getMonth() === date.getMonth() &&
        parseTaskDate(task.date).getFullYear() === date.getFullYear())

        return filteredData
    }

    function parseTaskDate(dateString) {
        return new Date(Date.parse(dateString))
    }

    console.log("Original data", data)
    console.log("Filtered data", filterTaskByDate)

    return (
        <>
            <div className="calendar-header">
                <IconButton onClick={goToPreviousDate}>
                    <NavigateBeforeIcon />
                </IconButton>
                <div className='date-and-calendar-button'>
                    <h3> {date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} </h3>
                    {renderCalendarPicker()}
                </div>
                {/* add a calendar option for user to select their own dates when they click the h3 tag */}
                <IconButton>
                    <NavigateNextIcon onClick={goToNextDate}/>
                </IconButton>
            </div>
            {renderCategoryBar()}
            { 
                data && data.length <= 0 ?
                <Box textAlign={"center"}>
                    <h1> Congratulations, No Tasks! </h1>
                </Box>
                :
                <Box>
                <Divider/>
                <Stack spacing={0.5}>
                    {/* Display each task. */}
                    {categories && filterTaskByDate() && filterTaskByDate().map((item, index) => {
                        const {id, name, category, time, date, description, finished} = item;
                        var category_name;
                        var category_color;
                        if(categories.findIndex((item) => item.category_id == category) != -1)
                        {
                            category_name = categories[categories.findIndex((item) => item.category_id == category)]["category_name"];
                            category_color = categories[categories.findIndex((item) => item.category_id == category)]["color_code"];
                            return (
                                <Box key={id} sx={{boxShadow: "0px 0px 5px 7px #f0f0f0" }}>
                                    {/* NOTE: The width of cards will be up to the largest width element on the page. */}
                                    <Accordion sx={{ boxShadow: "0", borderLeft: `5px solid ${category_color}`, margin: 0 }}  disableGutters>
                                        <AccordionSummary>
                                            {/* 31 columns because it gives 31 columns that each grid item can take a piece from. Must add up to 31 this way. */}
                                            <Grid container direction={'row'}>
                                                <Grid item sx={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                                                    {finished ? 
                                                    <IconButton onClick={(event) => handleFinishTask(event, id, finished)}>
                                                        <TaskAltIcon sx={{color: "green"}}/>
                                                    </IconButton>
                                                    :
                                                    <IconButton onClick={(event) => handleFinishTask(event, id, finished)}>
                                                        <RadioButtonUncheckedIcon/>
                                                    </IconButton>
                                                    }
                                                </Grid>

                                                <Grid item xs>
                                                    <Box>
                                                        <Grid item zeroMinWidth>
                                                            <Typography sx={{ fontSize: 16, lineHeight: "25px" }} color="text.primary" gutterBottom>
                                                                {name}
                                                            </Typography>
                                                        </Grid>
                                                        <Grid item>
                                                            <Typography sx={{ fontSize: 12, lineHeight: "1px" }} color="text.primary" gutterBottom>
                                                                {category_name}
                                                            </Typography>
                                                        </Grid>
                                                    </Box>
                                                </Grid>

                                                <Grid item direction={'row'} sx={{display: "flex", justifyContent: "center", alignItems: "center"}}>                                 
                                                    <Grid container direction="row-reverse">
                                                        {/* Row-reverse: so elements will display at end in reverse ordering in this part. */}
                                                        <Grid item paddingLeft={"1em"}>
                                                            <ThreeDotButtonTask task={item} handleDeleteTask={(event) => handleDeleteTask(event, id)}/>
                                                        </Grid>

                                                        <Grid item paddingLeft={"1em"}>
                                                            <Box>
                                                                <Grid item>
                                                                    <Typography sx={{ fontSize: 12 }} color="text.primary" gutterBottom>
                                                                        {time}
                                                                    </Typography>
                                                                </Grid>
                                                                <Grid item>
                                                                    <Typography sx={{ fontSize: 12 }} color="text.primary" gutterBottom>
                                                                        {date}
                                                                    </Typography>
                                                                </Grid>
                                                            </Box>
                                                        </Grid>

                                                    </Grid>
                                                </Grid>

                                            </Grid>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <Typography sx={{ fontSize: 14, overflowWrap: "break-word" }} color="text.primary" gutterBottom>
                                                {description}
                                            </Typography>
                                        </AccordionDetails>
                                    </Accordion>
                                    <Divider/>
                                </Box>
                            );
                        }
                    })}
                </Stack>
            </Box>
            }
        </>
    )    
}


export default TaskCalendarView;