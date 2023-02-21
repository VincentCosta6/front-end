
import { makeStyles } from '@material-ui/core/styles';


export const customStyles = {
    content : {
      top                   : '50%',
      left                  : '50%',
      right                 : 'auto',
      bottom                : 'auto',
      marginRight           : '-50%',
      transform             : 'translate(-50%, -50%)',
      backgroundColor: "var(--primary-color)",
      padding: 50,
    },
    overlay: {
        backgroundColor: "var(--background-color-trans)"
    }
  };

export const useStyles = makeStyles(theme => ({
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 250,
      },
      resize: {
          fontSize: "2rem"
      },
      root: {
        padding: '2px 4px',
        display: 'flex',
        alignItems: 'center',
        width: 400,
      },
      input: {
        marginLeft: 8,
        flex: 1,
      },
      iconButton: {
        padding: 10,
      },
      divider: {
        width: 1,
        height: 28,
        margin: 4,
      },
  }));
