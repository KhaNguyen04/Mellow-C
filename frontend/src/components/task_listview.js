import { Box, Grid, Stack, Typography, IconButton, Accordion, AccordionSummary, AccordionDetails, Tab, Tabs, Divider, Button, FormControl, InputLabel, Select, MenuItem } from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import ThreeDotButtonTask from "./task_threedotbutton";
import { CheckCircleOutline } from "@mui/icons-material";
import * as React from 'react';

function TaskListView(props) {

  //  const data = props.data;

    const [data, setData] = React.useState(() =>{
        return props.data.sort((a, b) => new Date(a.date + ", " + a.time).getTime() - new Date(b.date + ", " + b.time).getTime());
    });

    const categories = props.categories;

    const handleFinishTask = props.handleFinishTask;
    const handleDeleteTask = props.handleDeleteTask;
    const handleEditTask = props.handleEditTask;

    const renderCategoryBar = props.renderCategoryBar

    const [sortType, setSortType] = React.useState(0);

    React.useEffect(() => {
        if(sortType == 0) {
            setData(props.data.sort((a, b) => new Date(a.date + ", " + a.time).getTime() - new Date(b.date + ", " + b.time).getTime()));
        } else {
            setData(props.data.sort((a, b) => parseInt(a.category) - parseInt(b.category)));
        }
     });

    const handleSortChange = (event) => {
        var sortValue = event.target.value;

        setSortType(sortValue);
        
        // Sort data here on frontend
        console.log(data);

        if(sortValue == 0) {
            setData(data.sort((a, b) => new Date(a.date + ", " + a.time).getTime() - new Date(b.date + ", " + b.time).getTime()));
        } else {
            setData(data.sort((a, b) => parseInt(a.category) - parseInt(b.category)));
        }

    };

    const renderSortBar = () => {
        return (
        <Box sx={{paddingTop: '1em', paddingBottom: '2em' }} >
            {/* FILTER OPTIONS */}
            <FormControl fullWidth>
                <InputLabel id="select-sort">Sort Type</InputLabel>
                <Select
                    labelId="select-sort"
                    id="select-sort"
                    value={sortType}
                    label="Sort Type"
                    onChange={handleSortChange}
                >
                    <MenuItem value={0}>Time</MenuItem>
                    <MenuItem value={1}>Category</MenuItem>
                </Select>
            </FormControl>
        </Box>
        );
    }

    const renderMainBar = () => {
        if(!props.disableCategoryBar) {
            return (
                <Stack sx={{ flexDirection: { xs: "column", md: "row"} }} justifyContent={"space-between"}>
                    {renderCategoryBar()}
                    {renderSortBar()}
                </Stack>
            );
        } else {
            return (
                <Stack sx={{ flexDirection: { xs: "column", md: "row"} }} justifyContent={"end"}>
                    {renderSortBar()}
                </Stack>
            );
        }
    };

    // No data, display a message
    if (data && data.length <= 0)
    {
        return (
            <Box textAlign={"center"}>
                {renderCategoryBar()}
                <h1> Congratulations, No Tasks! </h1>
            </Box>
        );
    } else {
        return (
            <Box>
                {/* {renderCategoryBar()} */}
                {renderMainBar()}
                <Divider/>
                <Stack spacing={0.5}>
                    {/* Display each task. */}
                    {categories && data && data.map((item, index) => {
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
                                                        <CheckCircleOutline sx={{color: "green"}}/>
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
                                                            <Typography sx={{ fontSize: 20, lineHeight: "25px" }} color="text.primary" gutterBottom>
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

                                                <Grid item  sx={{display: "flex", justifyContent: "center", alignItems: "center"}}>                                 
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
                                            <Typography sx={{ fontSize: 14, overflowWrap: "break-word", paddingLeft: "3em" }} color="text.primary" gutterBottom>
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
        );
    }
}

export default TaskListView;