import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Popover from '@mui/material/Popover';
import MailIcon from '@mui/icons-material/Mail';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import ListAltIcon from '@mui/icons-material/ListAlt';
import AppsIcon from '@mui/icons-material/Apps';
import TodayIcon from '@mui/icons-material/Today';
import UpcomingIcon from '@mui/icons-material/Upcoming';
import EventRepeatIcon from '@mui/icons-material/EventRepeat';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import AddIcon from '@mui/icons-material/Add';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

import * as React from 'react';
import { Link, useLocation } from 'react-router-dom';

import TaskView from '../components/taskview';
import { AddTaskSharp, FolderCopy, Task } from '@mui/icons-material';
import { Button, Grid } from '@mui/material';

import FolderOpenIcon from '@mui/icons-material/FolderOpen';

import {
  useTheme,
  makeStyles
} from "@mui/material";

import { styled } from '@mui/material/styles';
import UserButton from './userbutton';
import { Stack } from '@mui/system';

import "./navbar.css";

import {
  useQuery,
  useMutation,
  useQueryClient
} from "@tanstack/react-query";

import { getCategories } from "../api/data";

import { AccountContext } from '../api/Account';
import AddCategoryPopup from './addcategorypopup';
import AddTaskPopup from './addtaskpopup';

const drawerWidth = 320;

function Navbar(props) {

  const {getSession, logOut} = React.useContext(AccountContext);
  
  // Handle deleting data, must be above the other return statements
  const queryClient = useQueryClient();

  const theme = useTheme();
  const {pathname } = useLocation();

  const [openDrawer, setDrawer] = React.useState(false);

  const toggleDrawer = () => {
    setDrawer(!openDrawer);
  };

  var navList = [
    {
      text: "Home",
      icon: <HomeIcon/>,
      to: "/home",
      inner: false,
      addTaskButton: false,
      addCategoryButton: false,
      color: "blue"
    },
    {
      text: "Tasks",
      icon: <ListAltIcon/>,
      to: null,
      inner: false,
      addTaskButton: true,
      addCategoryButton: false,
      color: "navy"
    },
    {
      text: "All",
      icon: <AppsIcon/>,
      to: "/tasks/all",
      inner: true,
      addTaskButton: false,
      addCategoryButton: false,
      color: "gold"
    },
    {
      text: "Today",
      icon: <TodayIcon/>,
      to: "/tasks/today",
      inner: true,
      addTaskButton: false,
      addCategoryButton: false,
      color: "red"
    },
    {
      text: "Upcoming",
      icon: <UpcomingIcon/>,
      to: "/tasks/upcoming",
      inner: true,
      addTaskButton: false,
      addCategoryButton: false,
      color: "brown"
    },
    {
      text: "Past",
      icon: <EventRepeatIcon/>,
      to: "/tasks/past",
      inner: true,
      addTaskButton: false,
      addCategoryButton: false,
      color: "black"
    },
    {
      text: "Finished",
      icon: <AssignmentTurnedInIcon/>,
      to: "/tasks/finished",
      inner: true,
      addTaskButton: false,
      addCategoryButton: false,
      color: "green"
    },
    {
      text: "Calendar",
      icon: <CalendarMonthIcon/>,
      to: "/calendar",
      inner: false,
      color: "purple"
    },
    {
      text: "Categories",
      icon: <FolderCopy/>,
      to: null,
      inner: false,
      addTaskButton: false,
      addCategoryButton: true,
      color: "gold"
    }
  ]

  // ------------------------------------------------------------- BEGIN ADD CATEGORIES TO THE NAVBAR LIST --------------------------------------------------------------------- //
  // This happens only at the beginning!

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

  if(categoriesQueryData)
  {
    for(var i = 0; i < categoriesQueryData.length; i++)
    {

      var category = {
        text: categoriesQueryData[i]["category_name"],
        icon: <FolderOpenIcon/>,
        to: "/tasks/category/" + categoriesQueryData[i]["category_id"],
        inner: true,
        addTaskButton: false,
        addCategoryButton: false,
        color: categoriesQueryData[i]["color_code"]
      };

      navList.push(category);

    }
  }

  // ------------------------------------------------------------- END ADD CATEGORIES TO THE NAVBAR LIST --------------------------------------------------------------------- //

  const navbarStyles = {
    appbarColor: "#ffffff",
    sidebarColor: "#f0f0f0",
    mainPageColor: "#ffffff",
    navbarMainColor: "#ffffff",
    appbarShadow: 0.1,
    appbarBorderRadius: "0em 0em 0em 0em",
    verticalLineWidth: 0,
    listItemColorSelected: "#fff281",
    listItemColorHover: "#fffbd6",
    navbarListPaddingSide: '0.5em',
    navbarInnerListPaddingSide: '2em',
  }

  const NavbarItemButton = styled(ListItemButton)(({ theme }) => ({
    paddingTop: "0.2em",
    paddingLeft: "2.5em",
    paddingRight: "2.5em",
    paddingBottom: "0.2em",
    borderRadius: "1em",
    color: "black",
    '&.Mui-selected, &.Mui-selected:hover': {
      backgroundColor: navbarStyles.listItemColorSelected,
      color: "black"
    },
    '&:hover': {
      backgroundColor: navbarStyles.listItemColorHover
    }
  }));

  const drawer = (
    <div style={{overflowX: "hidden"}}>
      <Toolbar/>
      <List style={{ marginLeft: "0px"}}>
        {navList.map((item, index) => {
          const {text, icon, to, inner, addTaskButton, addCategoryButton, color} = item;
          if(to != null) {
            return (
              <ListItem 
                component={Link} 
                key={text} 
                to={to} 
                onClick={toggleDrawer}
                disablePadding
                sx={{
                  paddingLeft: inner ? navbarStyles.navbarInnerListPaddingSide : navbarStyles.navbarListPaddingSide, 
                  paddingRight: navbarStyles.navbarListPaddingSide
                }}
                >
                  <NavbarItemButton
                    disableRipple
                    selected={to === pathname}
                    >
                      <ListItemIcon style={{"color": color}}>
                        {icon}
                      </ListItemIcon>
                      <ListItemText sx={{overflowWrap: "break-word"}} primary={text} />
                  </NavbarItemButton>
              </ListItem>
            );
          } else {
            return (
              <ListItem key={text} style={{paddingLeft: "3em"}}>
                <ListItemIcon style={{"color": color}}>
                  {icon}
                </ListItemIcon>
                <ListItemText primary={text} />
                {addTaskButton &&
                  <Box sx={{alignContent: "right"}}>
                    <AddTaskPopup listItemColorSelected={navbarStyles.listItemColorSelected} listItemColorHover={navbarStyles.listItemColorHover}/>
                  </Box>
                }
                {addCategoryButton &&
                  <Box sx={{alignContent: "right"}}>
                    <AddCategoryPopup listItemColorSelected={navbarStyles.listItemColorSelected} listItemColorHover={navbarStyles.listItemColorHover}/>
                  </Box>
                }
              </ListItem>
            )
          }
        })}
      </List>

    </div>
  );

  return (
    <div>
      <Box sx={{ display: 'flex' }}>

          <AppBar 
            position="fixed" 
            sx={{ 
              zIndex: (theme) => theme.zIndex.drawer + 1, 
              backgroundColor: navbarStyles.appbarColor,
              boxShadow: navbarStyles.appbarShadow,
              flexGrow: 1,
              borderRadius: navbarStyles.appbarBorderRadius
            }}>
                <Toolbar variant="dense">
                  <IconButton
                    color="inherit"
                    edge="start"
                    onClick={toggleDrawer}
                    sx={{ mr: 2, display: { md: "none" }}}
                  >
                    <MenuIcon />
                  </IconButton>
                  <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, paddingLeft: "1.5em" }}>
                    Mellow
                  </Typography>
                  <UserButton/>
                </Toolbar>
          </AppBar>

          <Box sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
            {/** Two drawers because one of them is for mobile view and the other is for larger screens. They disable each other depending on the screen size. */}
            <Drawer
              sx={{
                display: { xs: "none", sm: "none", md: "block" },
                "& .MuiDrawer-paper": {
                  boxSizing: "border-box",
                  width: drawerWidth,
                  borderWidth: navbarStyles.verticalLineWidth,
                  backgroundColor: navbarStyles.sidebarColor,
                  boxShadow: "1em 1en 1em #000000"
                }
              }}
              variant="permanent"
             
            >
              {drawer}
            </Drawer>

            <Drawer
              sx={{
                display: { xs: "block", sm: "block", md: "none" },
                "& .MuiDrawer-paper": {
                  boxSizing: "border-box",
                  width: drawerWidth,
                  borderWidth: navbarStyles.verticalLineWidth,
                  backgroundColor: navbarStyles.sidebarColor
                }
              }}
              variant="temporary"
              open={openDrawer}
              onClose={toggleDrawer}
            >
              {drawer}
            </Drawer>
          </Box>

          {/* This part is the main content. (usually what is to the right of the sidebar.) */}
          <Box
            sx={{ flexGrow: 1, height: "100vh", bgcolor: navbarStyles.mainPageColor }}
          >
            <Toolbar variant="dense"/>
            {props.children}
          </Box>
        </Box>


        
    </div>
  );
}

export default Navbar;