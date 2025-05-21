import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid
} from '@mui/material';
import {
  Add as AddIcon,
  ExitToApp as ExitIcon,
  Receipt as ReceiptIcon,
  Description as DescriptionIcon
} from '@mui/icons-material';
import { carEntryService } from '../../services/carEntryService';
import { parkingService } from '../../services/parkingService';
import { useAuth } from '../../context/AuthContext';

const CarEntryManagement = () => {
  const { user } = useAuth();
  const [entries, setEntries] = useState([]);
  const [parkings, setParkings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [openEntryDialog, setOpenEntryDialog] = useState(false);
  const [openExitDialog, setOpenExitDialog] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [formData, setFormData] = useState({
    plateNumber: '',
    parkingId: '',
    entryTime: new Date().toISOString().slice(0, 16)
  });

  useEffect(() => {
    fetchEntries();
    fetchParkings();
  }, [page, rowsPerPage]);

  const fetchEntries = async () => {
    try {
      setLoading(true);
      const response = await carEntryService.getAllEntries(page + 1, rowsPerPage);
      setEntries(response.data.entries);
      setTotalCount(response.data.total);
      setError(null);
    } catch (err) {
      setError('Failed to fetch car entries');
      console.error('Error fetching entries:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchParkings = async () => {
    try {
      const response = await parkingService.getAllParkings();
      setParkings(response.data.parkings);
    } catch (err) {
      console.error('Error fetching parkings:', err);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenEntryDialog = () => {
    setFormData({
      plateNumber: '',
      parkingId: '',
      entryTime: new Date().toISOString().slice(0, 16)
    });
    setOpenEntryDialog(true);
  };

  const handleCloseEntryDialog = () => {
    setOpenEntryDialog(false);
    setFormData({
      plateNumber: '',
      parkingId: '',
      entryTime: new Date().toISOString().slice(0, 16)
    });
  };

  const handleOpenExitDialog = (entry) => {
    setSelectedEntry(entry);
    setOpenExitDialog(true);
  };

  const handleCloseExitDialog = () => {
    setOpenExitDialog(false);
    setSelectedEntry(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitEntry = async (e) => {
    e.preventDefault();
    try {
      await carEntryService.createEntry(formData);
      handleCloseEntryDialog();
      fetchEntries();
      fetchParkings(); // Refresh parking spaces
    } catch (err) {
      setError('Failed to create car entry');
      console.error('Error creating entry:', err);
    }
  };

  const handleSubmitExit = async () => {
    try {
      await carEntryService.processExit(selectedEntry.id, {
        exitTime: new Date().toISOString()
      });
      handleCloseExitDialog();
      fetchEntries();
      fetchParkings(); // Refresh parking spaces
    } catch (err) {
      setError('Failed to process car exit');
      console.error('Error processing exit:', err);
    }
  };

  const handleGenerateTicket = async (id) => {
    try {
      const response = await carEntryService.generateTicket(id);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `ticket-${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      setError('Failed to generate ticket');
      console.error('Error generating ticket:', err);
    }
  };

  const handleGenerateBill = async (id) => {
    try {
      const response = await carEntryService.generateBill(id);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `bill-${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      setError('Failed to generate bill');
      console.error('Error generating bill:', err);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Car Entry Management</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenEntryDialog}
        >
          Register Entry
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Plate Number</TableCell>
              <TableCell>Parking</TableCell>
              <TableCell>Entry Time</TableCell>
              <TableCell>Exit Time</TableCell>
              <TableCell>Duration</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {entries.map((entry) => (
              <TableRow key={entry.id}>
                <TableCell>{entry.plateNumber}</TableCell>
                <TableCell>{entry.parking.name}</TableCell>
                <TableCell>{new Date(entry.entryTime).toLocaleString()}</TableCell>
                <TableCell>
                  {entry.exitTime ? new Date(entry.exitTime).toLocaleString() : '-'}
                </TableCell>
                <TableCell>
                  {entry.exitTime
                    ? `${Math.round((new Date(entry.exitTime) - new Date(entry.entryTime)) / (1000 * 60 * 60))} hours`
                    : '-'}
                </TableCell>
                <TableCell>${entry.chargedAmount || 0}</TableCell>
                <TableCell>
                  {!entry.exitTime && (
                    <IconButton
                      color="primary"
                      onClick={() => handleOpenExitDialog(entry)}
                    >
                      <ExitIcon />
                    </IconButton>
                  )}
                  <IconButton
                    color="info"
                    onClick={() => handleGenerateTicket(entry.id)}
                  >
                    <ReceiptIcon />
                  </IconButton>
                  {entry.exitTime && (
                    <IconButton
                      color="success"
                      onClick={() => handleGenerateBill(entry.id)}
                    >
                      <DescriptionIcon />
                    </IconButton>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={totalCount}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      {/* Entry Dialog */}
      <Dialog open={openEntryDialog} onClose={handleCloseEntryDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Register Car Entry</DialogTitle>
        <form onSubmit={handleSubmitEntry}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  name="plateNumber"
                  label="Plate Number"
                  value={formData.plateNumber}
                  onChange={handleInputChange}
                  required
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel>Parking Location</InputLabel>
                  <Select
                    name="parkingId"
                    value={formData.parkingId}
                    onChange={handleInputChange}
                    label="Parking Location"
                  >
                    {parkings.map((parking) => (
                      <MenuItem key={parking.id} value={parking.id}>
                        {parking.name} - {parking.location}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="entryTime"
                  label="Entry Time"
                  type="datetime-local"
                  value={formData.entryTime}
                  onChange={handleInputChange}
                  required
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseEntryDialog}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary">
              Register
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Exit Dialog */}
      <Dialog open={openExitDialog} onClose={handleCloseExitDialog}>
        <DialogTitle>Process Car Exit</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to process the exit for car {selectedEntry?.plateNumber}?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseExitDialog}>Cancel</Button>
          <Button onClick={handleSubmitExit} variant="contained" color="primary">
            Process Exit
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CarEntryManagement; 