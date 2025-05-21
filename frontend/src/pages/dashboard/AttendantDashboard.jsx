import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Card,
  CardContent,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  Add as AddIcon,
  ExitToApp as ExitIcon,
  Receipt as ReceiptIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import { parkingService } from '../../services/parkingService';
import { carEntryService } from '../../services/carEntryService';

const AttendantDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [parkings, setParkings] = useState([]);
  const [entries, setEntries] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [orderBy, setOrderBy] = useState('');
  const [order, setOrder] = useState('asc');
  const [openEntryDialog, setOpenEntryDialog] = useState(false);
  const [openExitDialog, setOpenExitDialog] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [formData, setFormData] = useState({
    plateNumber: '',
    parkingId: '',
    entryTime: new Date().toISOString().slice(0, 16)
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [parkingsRes, entriesRes] = await Promise.all([
        parkingService.getAllParkings(),
        carEntryService.getActiveEntries()
      ]);
      setParkings(parkingsRes.data.parkings);
      setEntries(entriesRes.data.entries);
      setError(null);
    } catch (err) {
      setError('Failed to fetch dashboard data');
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
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

  const handleSubmitEntry = async () => {
    try {
      await carEntryService.createEntry(formData);
      handleCloseEntryDialog();
      fetchData();
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
      fetchData();
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

  const filteredEntries = entries.filter(entry =>
    Object.values(entry).some(value =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const sortedEntries = [...filteredEntries].sort((a, b) => {
    if (!orderBy) return 0;
    const aValue = a[orderBy];
    const bValue = b[orderBy];
    return order === 'asc' ? aValue > bValue : aValue < bValue;
  });

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Attendant Dashboard
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Available Parkings
              </Typography>
              <Typography variant="h5">
                {parkings.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Active Entries
              </Typography>
              <Typography variant="h5">
                {entries.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Available Spaces
              </Typography>
              <Typography variant="h5">
                {parkings.reduce((sum, parking) => sum + parking.availableSpaces, 0)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Today's Revenue
              </Typography>
              <Typography variant="h5">
                ${entries.reduce((sum, entry) => sum + (entry.chargedAmount || 0), 0)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <TextField
          placeholder="Search entries..."
          value={searchTerm}
          onChange={handleSearch}
          InputProps={{
            startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
          }}
          sx={{ width: 300 }}
        />
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenEntryDialog}
        >
          Register Entry
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'plateNumber'}
                  direction={orderBy === 'plateNumber' ? order : 'asc'}
                  onClick={() => handleSort('plateNumber')}
                >
                  Plate Number
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'parking.name'}
                  direction={orderBy === 'parking.name' ? order : 'asc'}
                  onClick={() => handleSort('parking.name')}
                >
                  Parking
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'entryTime'}
                  direction={orderBy === 'entryTime' ? order : 'asc'}
                  onClick={() => handleSort('entryTime')}
                >
                  Entry Time
                </TableSortLabel>
              </TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedEntries.map((entry) => (
              <TableRow key={entry.id}>
                <TableCell>{entry.plateNumber}</TableCell>
                <TableCell>{entry.parking.name}</TableCell>
                <TableCell>{new Date(entry.entryTime).toLocaleString()}</TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleOpenExitDialog(entry)}
                  >
                    <ExitIcon />
                  </IconButton>
                  <IconButton
                    color="info"
                    onClick={() => handleGenerateTicket(entry.id)}
                  >
                    <ReceiptIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Entry Dialog */}
      <Dialog open={openEntryDialog} onClose={handleCloseEntryDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Register Car Entry</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              name="plateNumber"
              label="Plate Number"
              value={formData.plateNumber}
              onChange={handleInputChange}
              required
              fullWidth
            />
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
                    {parking.name} - {parking.location} (Available: {parking.availableSpaces})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
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
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEntryDialog}>Cancel</Button>
          <Button onClick={handleSubmitEntry} variant="contained" color="primary">
            Register
          </Button>
        </DialogActions>
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

export default AttendantDashboard; 