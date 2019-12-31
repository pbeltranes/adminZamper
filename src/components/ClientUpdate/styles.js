import { makeStyles } from "@material-ui/styles";
import { fade } from "@material-ui/core/styles/colorManipulator";
import { blue } from "@material-ui/core/colors";
export default makeStyles(theme => ({
  avatar: {
    backgroundColor: blue[100],
    color: blue[600],
  },
  fab: {
    position: "sticky",
    float: "right",
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));
