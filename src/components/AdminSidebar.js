import { Drawer, Avatar, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import { useNavigate } from "react-router-dom"

const AdminSidebar = () => {
  const drawerWidth = 220;
  const navigate = useNavigate();
  const itemList = [
    {
      text: "Exam Cell",
      onClick: () => navigate("./exam-cell")
    },
    {
      text: "Change Password",
      onClick: () => navigate("./change-password")
    },
  ];

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
      alt="A"
      src=""
      sx={{ width: 150, height: 150 }}
      style={{
        marginLeft: "30px",
        marginTop: "50px",
        marginBottom: "50px",
      }}
    />
    <h1>Admin</h1>
    <List>
      {itemList.map((item, index) => {
        const { text, onClick } = item;
        return (
          <ListItem button key={text} onClick={onClick}>
            <ListItemText primary={text} />
          </ListItem>
        );
      })}
    </List>
  </Drawer >
}

export default AdminSidebar;