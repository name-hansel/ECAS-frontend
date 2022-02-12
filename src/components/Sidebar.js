import { Drawer, Avatar, List, ListItemButton, ListItemIcon, ListItemText, Typography } from "@mui/material";
import { styled } from '@mui/material/styles';
import { Link, useLocation } from "react-router-dom"

const Sidebar = ({ itemList, name, avatar, role }) => {
  const drawerWidth = 250;
  const location = useLocation();

  const CustomListItemButton = styled(ListItemButton)(() => ({
    '&.Mui-selected': {
      backgroundColor: '#dedede',
    }, '&.Mui-selected:hover': {
      backgroundColor: '#dedede',
    }, '&:hover': {
      backgroundColor: '#eeeeee'
    }
  }))

  return <Drawer
    sx={{
      width: drawerWidth,
      flexShrink: 0,
      "& .MuiDrawer-paper": {
        width: drawerWidth,
        boxSizing: "border-box",
      },
    }}
    variant="permanent"
    anchor="left"
  >
    <Avatar
      alt="avatar"
      src={avatar}
      sx={{ width: 100, height: 100 }}
      style={{
        margin: '20px auto',
        marginTop: 'auto'
      }}
    />
    {/* Name */}
    <Typography variant="h5" gutterBottom component="div" style={{
      textAlign: "center",
      margin: '0 auto',
    }}>
      {name}
    </Typography>
    {/* Role */}
    {role && <Typography variant="subtitle1" gutterBottom component="div" style={{
      textAlign: "center",
      margin: '0 auto',
    }}>
      {role}
    </Typography>
    }
    {/* List */}
    <List style={{
      margin: "auto"
    }}>
      {itemList.map((item, index) => {
        const { text, icon, to, onClick } = item;
        return (
          <CustomListItemButton
            key={text}
            component={Link}
            to={to}
            selected={to === location.pathname}
            onClick={onClick ? onClick : null}
          >
            {icon && <ListItemIcon>{icon}</ListItemIcon>}
            <ListItemText primary={text} />
          </CustomListItemButton>
        );
      })}
    </List>
  </Drawer >
}

export default Sidebar;