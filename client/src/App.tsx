import { Input, Container, Box, Typography, Button, Icon } from '@mui/material'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import { VisuallyHiddenInput } from './elements/VisuallyHiddenInput'
import { useState } from 'react'

function App() {
  const [uploadInProgress, setUploadInProgress] = useState(false)

  const uploadFile = async (file: File) => {
    setUploadInProgress(true)
    const formData = new FormData()
    formData.append('file', file)
    try {
      const response = await fetch('http://localhost:3000/api/report/upload', {
        method: 'POST',
        body: formData,
      })
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      const data = await response.json()
      console.log('File uploaded successfully:', data)
    } catch (error) {
      console.error('Error uploading file:', error)
    } finally {
      setUploadInProgress(false)
    }
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Upload file to evaluate results
        </Typography>
        <Box component="form" noValidate autoComplete="off">
          <Button
            component="label"
            role={undefined}
            variant="contained"
            tabIndex={-1}
            startIcon={<CloudUploadIcon />}
          >
            Upload files
            <VisuallyHiddenInput
              type="file"
              onChange={(event) => uploadFile(event.target.files![0])}
              accept=".txt"
            />
          </Button>
        </Box>


      </Box>
    </Container>
  )
}

export default App
