import React from 'react';
import type { TestReport } from '../models/Report';
import { Chip, Table, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';




interface ReportProps {
    testResults: TestReport;
}

const Report: React.FC<ReportProps> = ({ testResults }) => {
    console.log(testResults);
    if (!testResults) {
        return <div>No test results available.</div>;
    }

    return (
        <><Typography variant="h6" component="h1" gutterBottom>
            Test Results for Patient ID: {testResults.patient.id}
            <br />
            Report ID: {testResults.reportId}
        </Typography>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Test Code</TableCell>
                            <TableCell>Unit</TableCell>
                            <TableCell>Value</TableCell>
                            <TableCell>Standard High</TableCell>
                            <TableCell>Standard Low</TableCell>
                            <TableCell>Is Standard Result Normal?</TableCell>
                            <TableCell>EverLab High</TableCell>
                            <TableCell>EverLab Low</TableCell>
                            <TableCell>Is EverLab Result Normal?</TableCell>
                        </TableRow>
                    </TableHead>
                    <tbody>
                        {testResults.patient.evaluatedTestResults.map((result, index) => (
                            <TableRow key={index}>
                                <TableCell>{result.testCode}</TableCell>
                                <TableCell>{result.unit}</TableCell>
                                <TableCell>
                                    <Chip label={result.value} color="primary" />
                                </TableCell>
                                <TableCell>{result.standardHigh}</TableCell>
                                <TableCell>{result.standardLow}</TableCell>
                                <TableCell>{result.isStandardResultsNormal ? <Chip label='Yes' color='success' /> : <Chip label='No' color='warning' />}</TableCell>
                                <TableCell>{result.testEverLabHigh}</TableCell>
                                <TableCell>{result.testEverLabLow}</TableCell>
                                <TableCell>{result.isEverlabResultsNormal ? <Chip label='Yes' color='success' /> : <Chip label='No' color='warning' />}</TableCell>
                            </TableRow>
                        ))}
                    </tbody>
                </Table></TableContainer>
        </>

    )
}

export default Report;
