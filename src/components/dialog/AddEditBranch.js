import React from 'react'
import { useDispatch } from 'react-redux'

import api from "../../utils/api"
import { setSnackbar } from '../../redux/snackbar/snackbar.action'

import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

const AddEditBranch = ({
  open, setOpen, dispatch, _id, setBranchToBeEdited
}) => {
  const reduxDispatch = useDispatch();

  // Initial state for dialog box data
  const initialBranchState = {
    code: "",
    name: ""
  }

  // Initial state for errors
  const initialFormErrorsState = {
    codeError: '', nameError: ''
  }

  // State to handle dialog data
  const [branch, setBranch] = React.useState(initialBranchState);

  // Text field errors
  const [formErrors, setFormErrors] = React.useState(initialFormErrorsState)

  // State to handle loading
  const [loading, setLoading] = React.useState(_id ? true : false);

  // Get branch details by id to fill dialog when updating
  const getBranch = async (_id) => {
    const { data } = await api.get(`/exam_cell/branch/${_id}`);
    return data;
  }

  React.useEffect(() => {
    // No ID is passed to dialog
    // Which means user wants to add new member instead of editing an existing member
    if (!_id) return
    let mounted = true;
    getBranch(_id).then(data => {
      if (mounted) {
        setBranch({ ...data });
        setLoading(false);
      }
    })
    return () => mounted = false;
  }, [_id])

  // Handle closing dialog box (set open to false) and clear state
  const setDialogClose = () => {
    setOpen(false);

    // Clear any exam cell member details from dialog box
    setBranch(initialBranchState);

    // Clear form errors
    setFormErrors(initialFormErrorsState);

    // Clear member to be edited ID
    setBranchToBeEdited(null);
  }

  // Function to handle form change to update state
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setBranch({ ...branch, [name]: value })
    // If the value of a field is changed, clear any errors associated with it
    setFormErrors({ ...formErrors, [`${name}Error`]: "" })
  }

  // Validate branch details
  const branchValidation = () => {
    if (formErrors.codeError || formErrors.nameError)
      return false;

    let codeError = "", nameError = "";

    const { code, name } = branch;
    if (!code || code.length === 0) codeError = 'Branch code is required';
    if (!name || name.length === 0) nameError = 'Branch name is required';

    // Return false if any error exists, to stop form from sending data
    if (codeError || nameError) {
      setFormErrors({ ...formErrors, codeError, nameError })
      return false;
    }

    return true
  }

  // Function to handle onSubmit form to add new branch
  const addBranch = async (e) => {
    try {
      e.preventDefault();
      if (!branchValidation()) {
        return
      }
      const { data } = await api.post("/exam_cell/branch", {
        ...branch
      })
      dispatch({
        type: 'ADD_BRANCH',
        payload: data
      })
      setDialogClose();
      reduxDispatch(setSnackbar(true, "success", "Added new branch successfully!"))
    }
    catch (err) {
      if (err.response) {
        if (Array.isArray(err.response.data.error)) {
          const errors = {};
          err.response.data.error.forEach(({ param, msg }) => {
            errors[`${param}Error`] = msg;
          })
          setFormErrors({ ...formErrors, ...errors })
        } else {
          reduxDispatch(setSnackbar(true, "error", err.response.data.error))
        }
      }
    }
  }

  const editBranch = async (e) => {
    try {
      e.preventDefault();
      if (!branchValidation()) {
        return
      }
      const { data } = await api.put(`/exam_cell/branch/${_id}`, {
        ...branch
      })
      dispatch({
        type: 'EDIT_BRANCH',
        payload: data
      })
      setDialogClose();
      reduxDispatch(setSnackbar(true, "success", "Updated branch successfully!"))
    } catch (err) {
      if (err.response) {
        if (Array.isArray(err.response.data.error)) {
          const errors = {};
          err.response.data.error.forEach(({ param, msg }) => {
            errors[`${param}Error`] = msg;
          })
          setFormErrors({ ...formErrors, ...errors })
        } else {
          reduxDispatch(setSnackbar(true, "error", err.response.data.error))
        }
      }
    }
  }


  return (
    loading ? <></> : <Dialog open={open} onClose={setDialogClose}>
      <DialogTitle>
        {
          _id ? "Edit Branch" : "Add New Branch"
        }
      </DialogTitle>
      <form onSubmit={_id ? editBranch : addBranch}>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column' }}>
          <TextField
            label="Code"
            variant="standard"
            value={branch.code}
            onChange={handleFormChange}
            name="code"
            error={formErrors.codeError ? true : false}
            helperText={formErrors.codeError}
          />
          <TextField
            label="Name"
            variant="standard"
            value={branch.name}
            onChange={handleFormChange}
            name="name"
            sx={{ margin: '6px 0' }}
            error={formErrors.nameError ? true : false}
            helperText={formErrors.nameError}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button variant="outlined" onClick={setDialogClose}>Cancel</Button>
          <Button variant="outlined" type="submit">
            {
              _id ? "Edit" : "Add"
            }
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default AddEditBranch