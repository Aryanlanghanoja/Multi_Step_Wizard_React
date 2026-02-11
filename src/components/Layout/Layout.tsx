import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  IconButton,
  Box,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import HomeIcon from "@mui/icons-material/Home";
import AssignmentIcon from "@mui/icons-material/Assignment";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setDrawerOpen(false);
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <Box sx={{ display: "flex" }}>
      {!drawerOpen && (
        <IconButton
          onClick={toggleDrawer}
          sx={{
            position: "fixed",
            top: 16,
            left: 16,
            zIndex: 1300,
            backgroundColor: theme.palette.primary.main,
            color: "white",
            "&:hover": {
              backgroundColor: theme.palette.primary.dark,
            },
          }}
        >
          <MenuIcon />
        </IconButton>
      )}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer}
        sx={{
          "& .MuiDrawer-paper": {
            width: 250,
            boxSizing: "border-box",
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.text.primary,
          },
        }}
      >
        <Box sx={{ width: 250, p: 2 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography
              variant="h6"
              component="div"
              sx={{
                color: theme.palette.primary.main,
                fontWeight: "bold",
              }}
            >
              Navigation
            </Typography>
            <IconButton
              onClick={toggleDrawer}
              sx={{
                color: theme.palette.primary.main,
                "&:hover": {
                  backgroundColor: theme.palette.primary.light,
                },
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
          <List>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => handleNavigation("/")}
                sx={{
                  backgroundColor: isActive("/")
                    ? theme.palette.primary.light
                    : "transparent",
                  "&:hover": {
                    backgroundColor: theme.palette.primary.light,
                  },
                  borderRadius: 1,
                  mb: 1,
                }}
              >
                <HomeIcon sx={{ mr: 2, color: theme.palette.primary.main }} />
                <ListItemText
                  primary="Home"
                  sx={{
                    "& .MuiListItemText-primary": {
                      color: isActive("/")
                        ? theme.palette.primary.contrastText
                        : theme.palette.text.primary,
                      fontWeight: isActive("/") ? "bold" : "normal",
                    },
                  }}
                />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => handleNavigation("/form")}
                sx={{
                  backgroundColor: isActive("/form")
                    ? theme.palette.primary.light
                    : "transparent",
                  "&:hover": {
                    backgroundColor: theme.palette.primary.light,
                  },
                  borderRadius: 1,
                }}
              >
                <AssignmentIcon
                  sx={{ mr: 2, color: theme.palette.primary.main }}
                />
                <ListItemText
                  primary="Application Form"
                  sx={{
                    "& .MuiListItemText-primary": {
                      color: isActive("/form")
                        ? theme.palette.primary.contrastText
                        : theme.palette.text.primary,
                      fontWeight: isActive("/form") ? "bold" : "normal",
                    },
                  }}
                />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          ml: 0,
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
