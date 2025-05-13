import { Container, Box, Typography, Button, Snackbar, type SnackbarCloseReason, } from '@mui/material'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import { VisuallyHiddenInput } from './elements/VisuallyHiddenInput'
import { useEffect, useState } from 'react'
import Reports from './components/Reports'
import type { TestReport } from './models/Report'

function App() {
  const [uploadInProgress, setUploadInProgress] = useState(false)
  const [buttonText, setButtonText] = useState('Upload files')
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState<string>();
  const [uploadedFile, setUploadedFile] = useState<string>()
  const [resultData, setResultData] = useState<TestReport>()
  const uploadFile = async (file: File) => {
    setUploadInProgress(true)
    const formData = new FormData()
    formData.append('patient_record', file)
    try {

      const response = await fetch('http://localhost:3000/api/report/upload', {
        method: 'POST',
        body: formData,
      })
      if (!response.ok) {

        throw new Error('Network response was not ok')
      }
      const data = await response.json()

      setButtonText('Evaluating results...')
      setUploadedFile(data.fileId)
      setSnackBarMessage(data.message);

    } catch (error) {

      setSnackBarMessage('Network response was not ok');

      setUploadInProgress(false)
    } finally {
      setSnackBarOpen(true);

    }
  }


  useEffect(() => {
    try {
      if (uploadedFile) {
        const fetchData = async () => {
          const response = await fetch(`http://localhost:3000/api/report/${uploadedFile}`)

          if (!response.ok) {
            throw new Error('Network response was not ok')
          }

          setSnackBarMessage('Evaluated results successfully');

          const data = await response.json()

          setResultData(data.result.report)

        }
        fetchData()

      }
    }
    catch (error) {
      console.error('Error fetching data:', error)
    }
    finally {
      setUploadInProgress(false)
      setButtonText('Upload files')
    }
  }, [uploadedFile])



  const handleClose = (
    _event: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason,
  ) => {
    if (reason === 'clickaway') {
      setSnackBarOpen(false);
      return;
    }
    setSnackBarOpen(false);
  };


  return (
    <Container maxWidth="lg">
      <Snackbar
        open={snackBarOpen}
        autoHideDuration={6000}
        onClose={handleClose}
        message={snackBarMessage}
      />
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {resultData ? 'Test results' : 'Upload file to evaluate results'}
        </Typography>
        <Box component="form" noValidate autoComplete="off">
          {!resultData ?

            <Button
              component="label"
              role={undefined}
              variant="contained"
              tabIndex={-1}
              loading={uploadInProgress}
              disabled={uploadInProgress}
              loadingPosition="start"
              startIcon={<CloudUploadIcon />


              }
            >
              {buttonText}
              <VisuallyHiddenInput
                type="file"
                disabled={uploadInProgress}
                onChange={(event) => {
                  console.log('event', event)
                  uploadFile(event.target.files![0])
                }}
                accept=".txt"
              />
            </Button> : <Reports testResults={resultData} />
          }
        </Box>


      </Box>
    </Container>
  )
}

export default App
