import { Drawer, Avatar, List, ListItem, ListItemIcon, ListItemText, Typography } from "@mui/material";

const Sidebar = ({ itemList, name, avatar, role }) => {
  const drawerWidth = 250;

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
        const { text, icon, onClick } = item;
        return (
          <ListItem button key={text} onClick={onClick}>
            {icon && <ListItemIcon>{icon}</ListItemIcon>}
            <ListItemText primary={text} />
          </ListItem>
        );
      })}
    </List>
  </Drawer >
}

export default Sidebar;