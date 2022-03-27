import React from 'react'
import { FileIcon, defaultStyles } from 'react-file-icon';

import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Badge from '@mui/material/Badge';
import { styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: 20,
    fontSize: '16px'
  },
}));

const UploadAttachmentItems = ({ awsFileName, dispatch, removeFile }) => {
  const extension = awsFileName.split(".").pop();

  return <StyledBadge badgeContent={<CloseIcon style={{ cursor: 'pointer' }} fontSize={"16px"} onClick={() => removeFile(awsFileName)} />} color="primary">
    <Paper
      elevation={0}
      variant="outlined" sx={{
        marginRight: 2,
        p: 2,
        width: '80',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <div style={{ width: '50px' }}>
        <FileIcon extension={extension} {...defaultStyles[extension]} />
      </div>
      <Typography sx={{ alignSelf: 'flex-start', marginTop: 1 }}>
        {awsFileName}
      </Typography>
    </Paper>
  </StyledBadge>
}

export default UploadAttachmentItems