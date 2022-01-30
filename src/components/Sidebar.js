import { Drawer, Avatar, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";

const Sidebar = ({ itemList, name, avatar }) => {
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
      sx={{ width: 150, height: 150 }}
      style={{
        margin: '50px auto',
        marginBottom: '10px'
      }}
    />
    <h1 style={{
      textAlign: "center",
    }}>{name}</h1>
    <List>
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