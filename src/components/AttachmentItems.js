import React from 'react'
import { FileIcon, defaultStyles } from 'react-file-icon';

import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';

const AttachmentItems = ({ fileName }) => {
  const extension = fileName.split(".")[2]
  return <Link href={`${process.env.REACT_APP_BASE_URL}/api/public/document/${fileName}`} underline="hover" target="_blank" rel="noreferrer">
    <Paper
      elevation={0}
      variant="outlined" sx={{
        marginRight: 1,
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
        {fileName}
      </Typography>
    </Paper>
  </Link>
}

export default AttachmentItems