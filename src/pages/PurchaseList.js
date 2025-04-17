import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  TextField,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  MenuItem,
  Select,
  FormControl,
  Grid,
  CircularProgress
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import AddIcon from '@mui/icons-material/Add';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import FilterListIcon from '@mui/icons-material/FilterList';
import AddPurchaseForm from './AddPurchaseForm';

// Google Apps Script deployed web app URL
const APPS_SCRIPT_API_URL = 'YOUR_DEPLOYED_WEB_APP_URL';

const PurchaseList = () => {
  const [fromDate, setFromDate] = useState('2025-04-03');
  const [toDate, setToDate] = useState('2025-04-10');
  const [supplier, setSupplier] = useState('All');
  const [invoiceNo, setInvoiceNo] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [purchaseData, setPurchaseData] = useState([]);
  const [totalInsights, setTotalInsights] = useState({
    totalAmount: '0.000',
    outstandingPayment: '0.000',
    taxPaid: '0.000'
  });

  // Fetch purchase data from Apps Script API
  const fetchPurchaseData = async (fromDate, toDate, supplier, invoiceNo) => {
    setIsLoading(true);
    setError(null);
  
    try {
      let url = 'https://script.google.com/macros/s/AKfycbwV3QUINvcfcY7OYlMIUtRhjrdoqkAn64ltk2MGWkt026yR81fzlpy5RKESvgcBpus/exec?type=getInventory';
  
      // Add query params only if they exist
      // if (fromDate) url += `&fromDate=${encodeURIComponent(fromDate)}`;
      // if (toDate) url += `&toDate=${encodeURIComponent(toDate)}`;
      // if (supplier && supplier !== 'All') url += `&supplier=${encodeURIComponent(supplier)}`;
      // if (invoiceNo) url += `&invoiceNo=${encodeURIComponent(invoiceNo)}`;
  
      const response = await fetch(url);
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log('Fetched purchase data:', data);
  
      if (data.success) {
        setPurchaseData(data.purchases || []);
  
        if (data.insights) {
          setTotalInsights({
            totalAmount: data.insights.totalAmount || '0.000',
            outstandingPayment: data.insights.outstandingPayment || '0.000',
            taxPaid: data.insights.taxPaid || '0.000'
          });
        }
      } else {
        throw new Error(data.message || 'Failed to fetch purchase data');
      }
    } catch (err) {
      console.error('Error fetching purchase data:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  

  // Add a new purchase via Apps Script API
  const addPurchase = async (purchaseData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(APPS_SCRIPT_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'addPurchase',
          purchase: purchaseData
        }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to add purchase');
      }
      
      // Refresh the purchase list
      fetchPurchaseData(fromDate, toDate, supplier, invoiceNo);
      
      return data;
    } catch (err) {
      console.error('Error adding purchase:', err);
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Delete a purchase via Apps Script API
  const deletePurchase = async (id) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(APPS_SCRIPT_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'deletePurchase',
          id: id
        }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to delete purchase');
      }
      
      // Refresh the purchase list
      fetchPurchaseData(fromDate, toDate, supplier, invoiceNo);
      
      return data;
    } catch (err) {
      console.error('Error deleting purchase:', err);
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Load purchase data on component mount
  useEffect(() => {
    fetchPurchaseData(fromDate, toDate, supplier, invoiceNo);
  }, []);

  // Calculate total purchase amount from current data (as backup if API doesn't provide insights)
  const calculateTotalPurchaseAmount = () => {
    return purchaseData.reduce((sum, item) => {
      // Remove commas and convert to number
      const amount = parseFloat(item.total.replace(/,/g, ''));
      return sum + (isNaN(amount) ? 0 : amount);
    }, 0).toFixed(3);
  };

  const formattedTotal = new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 3
  }).format(totalInsights.totalAmount || calculateTotalPurchaseAmount());

  const handleSearch = () => {
    fetchPurchaseData(fromDate, toDate, supplier, invoiceNo);
  };

  const handleClear = () => {
    // Reset all filters to default
    setFromDate('2025-04-03');
    setToDate('2025-04-10');
    setSupplier('All');
    setInvoiceNo('');
    // Fetch with cleared filters
    fetchPurchaseData('2025-04-03', '2025-04-10', 'All', '');
  };

  const handleAddPurchase = () => {
    setShowAddForm(true);
  };

  const handleCancelAdd = () => {
    setShowAddForm(false);
  };

  const handleSubmitPurchase = async (newPurchase) => {
    try {
      await addPurchase(newPurchase);
      setShowAddForm(false);
    } catch (err) {
      // Error is already set in the addPurchase function
      // You could show a more specific error message here if needed
    }
  };

  const handleEditPurchase = (id) => {
    // Navigate to edit form or show modal
    // For now, just log
    console.log("Edit purchase with ID:", id);
  };

  const handleDeletePurchase = (id) => {
    // Show confirmation dialog and delete if confirmed
    if (window.confirm("Are you sure you want to delete this purchase?")) {
      deletePurchase(id);
    }
  };

  if (showAddForm) {
    return (
      <AddPurchaseForm 
        onCancel={handleCancelAdd} 
        onSubmit={handleSubmitPurchase}
      />
    );
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h1">Purchase List</Typography>
        <Box>
          <Button 
            variant="contained" 
            color="error" 
            startIcon={<AddIcon />} 
            sx={{ mr: 2 }}
            onClick={handleAddPurchase}
          >
            Add Purchase
          </Button>
          <Button 
            variant="outlined" 
            startIcon={<FileDownloadOutlinedIcon />} 
            endIcon={<FilterListIcon />}
          >
            Export
          </Button>
        </Box>
      </Box>

      {/* Search/Filter Row */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={2}>
          <Typography variant="subtitle2">Start Date</Typography>
          <TextField
            fullWidth
            type="date"
            size="small"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <CalendarTodayIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Typography variant="subtitle2">End Date</Typography>
          <TextField
            fullWidth
            type="date"
            size="small"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <CalendarTodayIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Typography variant="subtitle2">From</Typography>
          <FormControl fullWidth size="small">
            <Select
              value={supplier}
              onChange={(e) => setSupplier(e.target.value)}
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="F1 [Kitchen]">F1 [Kitchen]</MenuItem>
              <MenuItem value="Indore cake [Supplier]">Indore cake [Supplier]</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Typography variant="subtitle2">Invoice No.</Typography>
          <TextField
            fullWidth
            size="small"
            value={invoiceNo}
            onChange={(e) => setInvoiceNo(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2} sx={{ display: 'flex', alignItems: 'flex-end' }}>
          <Button variant="outlined" sx={{ mr: 1 }}>
            More Filters
          </Button>
          <Button 
            variant="contained" 
            color="error" 
            onClick={handleSearch}
            sx={{ mr: 1 }}
            disabled={isLoading}
          >
            Search
          </Button>
          <Button 
            variant="outlined" 
            onClick={handleClear}
            disabled={isLoading}
          >
            Clear
          </Button>
        </Grid>
      </Grid>

      {/* Insights Section */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Typography variant="h6" component="h2">Insights</Typography>
          <IconButton size="small">
            <FilterListIcon fontSize="small" />
          </IconButton>
        </Box>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          <Paper 
            sx={{ 
              p: 2, 
              flex: 1, 
              minWidth: '250px',
              borderTop: '4px solid #1976d2',
              borderRadius: '4px'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                Total Purchase invoice amount recorded is
              </Typography>
              <IconButton size="small">
                <InfoOutlinedIcon fontSize="small" />
              </IconButton>
            </Box>
            <Typography variant="h5" sx={{ mt: 1, color: '#555' }}>
              ₹ {totalInsights.totalAmount}
            </Typography>
          </Paper>
          
          <Paper 
            sx={{ 
              p: 2, 
              flex: 1, 
              minWidth: '250px',
              borderTop: '4px solid #4caf50',
              borderRadius: '4px' 
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                Total Outstanding Payment of
              </Typography>
              <IconButton size="small">
                <InfoOutlinedIcon fontSize="small" />
              </IconButton>
            </Box>
            <Typography variant="h5" sx={{ mt: 1, color: '#555' }}>
              ₹ {totalInsights.outstandingPayment}
            </Typography>
          </Paper>
          
          <Paper 
            sx={{ 
              p: 2, 
              flex: 1, 
              minWidth: '250px', 
              borderTop: '4px solid #ff9800',
              borderRadius: '4px'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                Tax paid to the seller
              </Typography>
              <IconButton size="small">
                <InfoOutlinedIcon fontSize="small" />
              </IconButton>
            </Box>
            <Typography variant="h5" sx={{ mt: 1, color: '#555' }}>
              ₹ {totalInsights.taxPaid}
            </Typography>
          </Paper>
        </Box>
      </Box>

      {/* Data Table */}
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Paper sx={{ p: 3, textAlign: 'center', color: 'error.main' }}>
          <Typography>{error}</Typography>
          <Button 
            variant="contained" 
            color="primary" 
            sx={{ mt: 2 }} 
            onClick={() => fetchPurchaseData(fromDate, toDate, supplier, invoiceNo)}
          >
            Retry
          </Button>
        </Paper>
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} size="small">
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableCell>From</TableCell>
                  <TableCell>Invoice Date</TableCell>
                  <TableCell>Invoice Number</TableCell>
                  <TableCell>MRN/PO Number</TableCell>
                  <TableCell>Total (₹)</TableCell>
                  <TableCell>Payment</TableCell>
                  <TableCell>Created By</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {purchaseData.length > 0 ? (
                  purchaseData.map((row) => (
                    <TableRow
                      key={row.id}
                      sx={{ 
                        '&:nth-of-type(odd)': { backgroundColor: '#f9f9f9' },
                        '&:last-child td, &:last-child th': { border: 0 } 
                      }}
                    >
                      <TableCell component="th" scope="row">
                        {row.from}
                      </TableCell>
                      <TableCell>{row.invoiceDate}</TableCell>
                      <TableCell>{row.invoiceNumber}</TableCell>
                      <TableCell>{row.mrnPoNumber}</TableCell>
                      <TableCell sx={{ backgroundColor: '#e8f5e9' }}>{row.totalAmount}</TableCell>
                      <TableCell>{row.paymentStatus}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          {row.createdBy}
                          <IconButton size="small">
                            <InfoOutlinedIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ color: '#4caf50' }}>{row.status}</TableCell>
                      <TableCell>
                        <IconButton size="small" onClick={() => handleEditPurchase(row.id)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" onClick={() => handleDeletePurchase(row.id)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small">
                          <MoreVertIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} align="center">
                      <Typography sx={{ py: 2 }}>No purchase records found.</Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          
          {/* Pagination */}
          {purchaseData.length > 0 && (
            <Box sx={{ p: 2, bgcolor: '#ffebee', borderRadius: '0 0 4px 4px' }}>
              <Typography variant="body2">
                Showing 1 to {purchaseData.length} of {purchaseData.length} records
              </Typography>
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default PurchaseList;