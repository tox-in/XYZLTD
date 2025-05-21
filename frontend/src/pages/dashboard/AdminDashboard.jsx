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
  Alert
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Receipt as ReceiptIcon,
  LocalParking as ParkingIcon,
  DirectionsCar as CarIcon
} from '@mui/icons-material';
import { parkingService } from '../../services/parkingService';
import { carEntryService } from '../../services/carEntryService';

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [parkings, setParkings] = useState([]);
  const [entries, setEntries] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [orderBy, setOrderBy] = useState('');
  const [order, setOrder] = useState('asc');
  const [openParkingDialog, setOpenParkingDialog] = useState(false);
  const [newParking, setNewParking] = useState({
    code: '',
    name: '',
    location: '',
    totalSpaces: '',
    feePerHour: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [parkingsRes, entriesRes] = await Promise.all([
        parkingService.getAllParkings(),
        carEntryService.getAllEntries()
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

  const handleOpenParkingDialog = () => {
    setOpenParkingDialog(true);
  };

  const handleCloseParkingDialog = () => {
    setOpenParkingDialog(false);
    setNewParking({
      code: '',
      name: '',
      location: '',
      totalSpaces: '',
      feePerHour: ''
    });
  };

  const handleParkingInputChange = (e) => {
    const { name, value } = e.target;
    setNewParking(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCreateParking = async () => {
    try {
      await parkingService.createParking(newParking);
      handleCloseParkingDialog();
      fetchData();
    } catch (err) {
      setError('Failed to create parking');
      console.error('Error creating parking:', err);
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

  const filteredParkings = parkings.filter(parking =>
    Object.values(parking).some(value =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const sortedParkings = [...filteredParkings].sort((a, b) => {
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
        Admin Dashboard
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
                Total Parkings
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
                {entries.filter(entry => !entry.exitTime).length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Revenue
              </Typography>
              <Typography variant="h5">
                ${entries.reduce((sum, entry) => sum + (entry.chargedAmount || 0), 0)}
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
      </Grid>

      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <TextField
          placeholder="Search parkings..."
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
          onClick={handleOpenParkingDialog}
        >
          Add Parking
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'code'}
                  direction={orderBy === 'code' ? order : 'asc'}
                  onClick={() => handleSort('code')}
                >
                  Code
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'name'}
                  direction={orderBy === 'name' ? order : 'asc'}
                  onClick={() => handleSort('name')}
                >
                  Name
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'location'}
                  direction={orderBy === 'location' ? order : 'asc'}
                  onClick={() => handleSort('location')}
                >
                  Location
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'availableSpaces'}
                  direction={orderBy === 'availableSpaces' ? order : 'asc'}
                  onClick={() => handleSort('availableSpaces')}
                >
                  Available Spaces
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'feePerHour'}
                  direction={orderBy === 'feePerHour' ? order : 'asc'}
                  onClick={() => handleSort('feePerHour')}
                >
                  Fee/Hour
                </TableSortLabel>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedParkings.map((parking) => (
              <TableRow key={parking.id}>
                <TableCell>{parking.code}</TableCell>
                <TableCell>{parking.name}</TableCell>
                <TableCell>{parking.location}</TableCell>
                <TableCell>{parking.availableSpaces}</TableCell>
                <TableCell>${parking.feePerHour}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openParkingDialog} onClose={handleCloseParkingDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Parking</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              name="code"
              label="Parking Code"
              value={newParking.code}
              onChange={handleParkingInputChange}
              required
              fullWidth
            />
            <TextField
              name="name"
              label="Parking Name"
              value={newParking.name}
              onChange={handleParkingInputChange}
              required
              fullWidth
            />
            <TextField
              name="location"
              label="Location"
              value={newParking.location}
              onChange={handleParkingInputChange}
              required
              fullWidth
            />
            <TextField
              name="totalSpaces"
              label="Total Spaces"
              type="number"
              value={newParking.totalSpaces}
              onChange={handleParkingInputChange}
              required
              fullWidth
            />
            <TextField
              name="feePerHour"
              label="Fee per Hour"
              type="number"
              value={newParking.feePerHour}
              onChange={handleParkingInputChange}
              required
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseParkingDialog}>Cancel</Button>
          <Button onClick={handleCreateParking} variant="contained" color="primary">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminDashboard; 