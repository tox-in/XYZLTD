import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  Typography
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  LocalParking as ParkingIcon,
  DirectionsCar as CarIcon,
  Assessment as ReportIcon,
  People as PeopleIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const drawerWidth = 240;

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const menuItems = [
    {
      text: 'Dashboard',
      icon: <DashboardIcon />,
      path: '/dashboard',
      roles: ['ADMIN', 'ATTENDANT']
    },
    {
      text: 'Parking Management',
      icon: <ParkingIcon />,
      path: '/parking',
      roles: ['ADMIN']
    },
    {
      text: 'Car Entries',
      icon: <CarIcon />,
      path: '/car-entries',
      roles: ['ADMIN', 'ATTENDANT']
    },
    {
      text: 'Reports',
      icon: <ReportIcon />,
      path: '/reports',
      roles: ['ADMIN', 'ATTENDANT']
    },
    {
      text: 'User Management',
      icon: <PeopleIcon />,
      path: '/users',
      roles: ['ADMIN']
    },
    {
      text: 'Settings',
      icon: <SettingsIcon />,
      path: '/settings',
      roles: ['ADMIN', 'ATTENDANT']
    }
  ];

  const filteredMenuItems = menuItems.filter(item => 
    item.roles.includes(user?.role)
  );

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          bgcolor: 'background.paper'
        }
      }}
    >
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" color="primary">
          XYZ Parking
        </Typography>
      </Box>
      <Divider />
      <List>
        {filteredMenuItems.map((item) => (
          <ListItem
            button
            key={item.text}
            onClick={() => navigate(item.path)}
            selected={location.pathname === item.path}
            sx={{
              '&.Mui-selected': {
                bgcolor: 'primary.light',
                '&:hover': {
                  bgcolor: 'primary.light'
                }
              }
            }}
          >
            <ListItemIcon sx={{ color: location.pathname === item.path ? 'primary.main' : 'inherit' }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar; 