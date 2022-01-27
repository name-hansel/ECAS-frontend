import { SET_SNACKBAR } from "./snackbar.types"

export const setSnackbar = (snackbarOpen, snackbarType, snackbarMessage) => {
  return dispatch => {
    dispatch({
      type: SET_SNACKBAR,
      payload: {
        snackbarOpen, snackbarType, snackbarMessage
      }
    })
  }
}