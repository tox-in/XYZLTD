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
  Alert
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { parkingService } from '../../services/parkingService';

const ParkingManagement = () => {
  const [parkings, setParkings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedParking, setSelectedParking] = useState(null);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    location: '',
    totalSpaces: '',
    feePerHour: ''
  });

  useEffect(() => {
    fetchParkings();
  }, [page, rowsPerPage]);

  const fetchParkings = async () => {
    try {
      setLoading(true);
      const response = await parkingService.getAllParkings(page + 1, rowsPerPage);
      setParkings(response.data.parkings);
      setTotalCount(response.data.total);
      setError(null);
    } catch (err) {
      setError('Failed to fetch parking data');
      console.error('Error fetching parkings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenDialog = (parking = null) => {
    if (parking) {
      setSelectedParking(parking);
      setFormData({
        code: parking.code,
        name: parking.name,
        location: parking.location,
        totalSpaces: parking.totalSpaces,
        feePerHour: parking.feePerHour
      });
    } else {
      setSelectedParking(null);
      setFormData({
        code: '',
        name: '',
        location: '',
        totalSpaces: '',
        feePerHour: ''
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedParking(null);
    setFormData({
      code: '',
      name: '',
      location: '',
      totalSpaces: '',
      feePerHour: ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedParking) {
        await parkingService.updateParking(selectedParking.id, formData);
      } else {
        await parkingService.createParking(formData);
      }
      handleCloseDialog();
      fetchParkings();
    } catch (err) {
      setError('Failed to save parking data');
      console.error('Error saving parking:', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this parking?')) {
      try {
        await parkingService.deleteParking(id);
        fetchParkings();
      } catch (err) {
        setError('Failed to delete parking');
        console.error('Error deleting parking:', err);
      }
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
        <Typography variant="h4">Parking Management</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add Parking
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
              <TableCell>Code</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Total Spaces</TableCell>
              <TableCell>Fee/Hour</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {parkings.map((parking) => (
              <TableRow key={parking.id}>
                <TableCell>{parking.code}</TableCell>
                <TableCell>{parking.name}</TableCell>
                <TableCell>{parking.location}</TableCell>
                <TableCell>{parking.totalSpaces}</TableCell>
                <TableCell>${parking.feePerHour}</TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleOpenDialog(parking)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(parking.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
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

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedParking ? 'Edit Parking' : 'Add New Parking'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                name="code"
                label="Parking Code"
                value={formData.code}
                onChange={handleInputChange}
                required
                fullWidth
              />
              <TextField
                name="name"
                label="Parking Name"
                value={formData.name}
                onChange={handleInputChange}
                required
                fullWidth
              />
              <TextField
                name="location"
                label="Location"
                value={formData.location}
                onChange={handleInputChange}
                required
                fullWidth
              />
              <TextField
                name="totalSpaces"
                label="Total Spaces"
                type="number"
                value={formData.totalSpaces}
                onChange={handleInputChange}
                required
                fullWidth
              />
              <TextField
                name="feePerHour"
                label="Fee per Hour"
                type="number"
                value={formData.feePerHour}
                onChange={handleInputChange}
                required
                fullWidth
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary">
              {selectedParking ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default ParkingManagement; 