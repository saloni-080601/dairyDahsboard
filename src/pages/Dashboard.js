import { useState, useEffect } from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Grid, 
  TextField, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button,
  Container,
  Paper,
  Avatar,
  CircularProgress
} from '@mui/material';

// Import dayjs adapter
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

// API endpoint - better to store in env variable or config file
const API_ENDPOINT = "https://script.google.com/macros/s/AKfycbz4EU0pjZRfMQnpctF2_TKWEhATAUNDvz09In2nMPhoz0o3DFXXI8rjTNbApbIko3Q/exec";

export default function MilkSupplierCards() {
  // Get today's date using dayjs
  const today = dayjs();
  
  const [openModal, setOpenModal] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [timePeriod, setTimePeriod] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [milkSuppliers, setMilkSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [filteredSuppliers, setFilteredSuppliers] = useState([]);
  
  // Time periods for milk collection
  const timePeriods = [
    { value: 'morning', label: 'सुबह (Morning)', timeRange: '4 AM - 11 AM' },
    { value: 'evening', label: 'शाम (Evening)', timeRange: '12 AM - 12 PM' }
  ];

  // Function to determine the default time period based on current time
  const getDefaultTimePeriod = () => {
    const currentHour = new Date().getHours();
    
    // If current time is between 4 AM (4) and 11 AM (11)
    if (currentHour >= 0 && currentHour <= 12) {
      return 'morning';
    } 
    // If current time is between 12 PM (12) and 10 PM (22)
    else if (currentHour >= 12 && currentHour <= 24) {
      return 'evening';
    }
    // Default to morning if outside these hours
    else {
      return 'morning';
    }
  };

  // Set the default time period and fetch suppliers when component mounts
  useEffect(() => {
    const defaultPeriod = getDefaultTimePeriod();
    setTimePeriod(defaultPeriod);
    
    // Check for logged in user from localStorage
    const username = localStorage.getItem('userName');
    if (username) {
      setLoggedInUser(username);
    }
    
    // Fetch milk suppliers and invoices from API
    fetchMilkSuppliers();
    fetchInvoices();
  }, []);

  // Colors for suppliers
  const colors = [
    { color: "#3f51b5", textColor: "#FFFFFF" },
    { color: "#4caf50", textColor: "#FFFFFF" },
    { color: "#ff9800", textColor: "#000000" },
    { color: "#f44336", textColor: "#FFFFFF" },
    { color: "#9c27b0", textColor: "#FFFFFF" },
    { color: "#e91e63", textColor: "#FFFFFF" }
  ];

  // Function to fetch milk suppliers from API
  const fetchMilkSuppliers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_ENDPOINT}?type=supplier`);
      
      // Check if the response is OK
      if (!response.ok) {
        throw new Error('Failed to fetch suppliers');
      }
      
      const data = await response.json();
      console.log('Fetched suppliers:', data);
      
      // If we have suppliers data
      if (data && data.length > 0) {
        // Add colors to suppliers
        const suppliersWithColors = data.map((supplier, index) => ({
          ...supplier,
          color: colors[index % colors.length].color,
          textColor: colors[index % colors.length].textColor
        }));
        
        // Filter suppliers if user is logged in
        const username = localStorage.getItem('userName');
        console.log('Username:', username);
        if (username) {
          const filteredSuppliers = suppliersWithColors.filter(
            supplier => console.log('Supplier:', supplier) || supplier.UserName === username
          );
          setMilkSuppliers(filteredSuppliers.length > 0 ? filteredSuppliers : suppliersWithColors);
        } else {
          setMilkSuppliers(suppliersWithColors);
        }
      } else {
        // Handle case where no suppliers are returned
        setError("No suppliers found. Please check with administrator.");
        setMilkSuppliers([]);
      }
    } catch (error) {
      console.error("Error fetching suppliers:", error);
      setError("Failed to load suppliers. Please check your connection and try again.");
      setMilkSuppliers([]);
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch invoices from API
  const fetchInvoices = async () => {
    try {
      const response = await fetch(`${API_ENDPOINT}?type=invoices`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch invoices');
      }
      
      const data = await response.json();
      console.log('Fetched invoices:', data);
      
      if (data && data.length > 0) {
        setInvoices(data);
      } else {
        setInvoices([]);
      }
    } catch (error) {
      console.error("Error fetching invoices:", error);
      setInvoices([]);
    }
  };

  // Filter suppliers based on submitted data for current time period and date
  useEffect(() => {
    if (milkSuppliers.length > 0 && invoices.length > 0) {
      const today = dayjs().format('DD/MM/YYYY');
      const currentPeriodLabel = timePeriods.find(p => p.value === timePeriod)?.label || '';
      
      // Find suppliers who have already submitted data for today and current period
      const submittedSupplierIds = invoices
        .filter(invoice => 
          invoice['Invoice Date'] === today && 
          invoice['Time Period'] === currentPeriodLabel
        )
        .map(invoice => parseInt(invoice['Supplier ID']));
      
      console.log('Submitted supplier IDs for today and current period:', submittedSupplierIds);
      
      // Filter out suppliers who have already submitted
      const filtered = milkSuppliers.filter(supplier => 
        !submittedSupplierIds.includes(parseInt(supplier.ID))
      );
      
      setFilteredSuppliers(filtered);
    } else {
      setFilteredSuppliers(milkSuppliers);
    }
  }, [milkSuppliers, invoices, timePeriod]);

  // Refresh data when time period changes
  useEffect(() => {
    fetchInvoices();
  }, [timePeriod]);

  const handleCardClick = (supplier) => {
    setSelectedSupplier(supplier);
    setOpenModal(true);
    setQuantity();
  };
  
  const handleClose = () => {
    setOpenModal(false);
  };
  
  const formatDate = () => {
    return dayjs().format('DD/MM/YYYY');
  };
  
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    
    // Validate inputs
    if (!quantity || quantity <= 0) {
      alert("कृपया वैध मात्रा दर्ज करें (Please enter a valid quantity)");
      return;
    }
  
    const selectedTimePeriod = timePeriods.find(period => period.value === timePeriod);
    const invoicePayload = {
      action: "create",
      data: {
        supplierId: selectedSupplier.ID,
        supplierName: selectedSupplier.Name,
        pricePerLiter: selectedSupplier.Price,
        quantity: quantity,
        totalAmount: (quantity * selectedSupplier.Price).toFixed(2),
        timePeriod: timePeriods.find(period => period.value === timePeriod).label,
        date: formatDate(),
      }
    };
  
    try {
      setIsSubmitting(true);
      
      // When using no-cors mode, you cannot access the response content
      await fetch(API_ENDPOINT, {
        method: "POST",
        body: JSON.stringify(invoicePayload),
        headers: {
          "Content-Type": "application/json"
        },
        mode: "no-cors"
      });
      
      // Since we can't read the response with no-cors, we assume success
      // and show an alert
      alert("चालान सफलतापूर्वक जमा किया गया! (Invoice submitted successfully!)");
      setOpenModal(false);
      
      // Refresh invoices to update the filtered list
      fetchInvoices();
    } catch (error) {
      console.error("POST Error:", error);
      alert("नेटवर्क त्रुटि! कृपया पुनः प्रयास करें। (Network error! Please try again.)");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Function to get the display label for the current time period
  const getTimePeriodLabel = () => {
    const period = timePeriods.find(p => p.value === timePeriod);
    return period ? period.label : '';
  };
  
  // Function to handle refresh button click
  const handleRefresh = () => {
    setLoading(true);
    setError(null);
    fetchMilkSuppliers();
    fetchInvoices();
  };

  // Function to toggle time period
  const handleToggleTimePeriod = () => {
    const newPeriod = timePeriod === 'morning' ? 'evening' : 'morning';
    setTimePeriod(newPeriod);
  };
  
  // Loading state when fetching suppliers
  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress size={60} sx={{ mb: 3 }} />
          <Typography variant="h6">लोड हो रहा है... (Loading...)</Typography>
        </Box>
      </Container>
    );
  }
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={0} sx={{ p: 2, mb: 4, backgroundColor: 'transparent', textAlign: 'center' }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ color: '#3f51b5', fontWeight: 'bold' }}>
          🥛 दूध आपूर्तिकर्ता 
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom sx={{ color: '#666' }}>
          Milk Suppliers
        </Typography>
        {loggedInUser && (
          <Typography variant="h6" sx={{ color: '#4caf50', mt: 1 }}>
            स्वागत है, {loggedInUser}! (Welcome, {loggedInUser}!)
          </Typography>
        )}
      </Paper>

      {/* Time Period Toggle */}
      {/* <Paper elevation={2} sx={{ p: 2, mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          वर्तमान समय अवधि (Current Time Period): {getTimePeriodLabel()}
        </Typography>
        <Button 
          variant="contained" 
          color="primary"
          onClick={handleToggleTimePeriod}
        >
          {timePeriod === 'morning' ? 'शाम के लिए बदलें (Switch to Evening)' : 'सुबह के लिए बदलें (Switch to Morning)'}
        </Button>
      </Paper> */}
      
      {error && (
        <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 2, bgcolor: '#fff8f8', borderLeft: '4px solid #f44336' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body1" sx={{ color: '#d32f2f' }}>
              {error}
            </Typography>
            <Button 
              variant="outlined" 
              color="primary" 
              size="small"
              onClick={handleRefresh}
              sx={{ ml: 2 }}
            >
              पुनः प्रयास करें (Retry)
            </Button>
          </Box>
        </Paper>
      )}
      
      {filteredSuppliers.length === 0 && !error ? (
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
          <Typography variant="h6" sx={{ color: '#666' }}>
            {milkSuppliers.length > 0 
              ? `इस समय अवधि के लिए सभी आपूर्तिकर्ताओं ने पहले ही डेटा जमा कर दिया है। (All suppliers have already submitted data for this time period.)`
              : `कोई आपूर्तिकर्ता नहीं मिला (No suppliers found)`
            }
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            sx={{ mt: 2 }}
            onClick={handleRefresh}
          >
            पुनः लोड करें (Reload)
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {filteredSuppliers.map((supplier) => (
            <Grid item xs={6} md={4} key={supplier.ID}>
              <Card 
                sx={{ 
                  height: { xs: 140, sm: 180 },
                  display: 'flex', 
                  flexDirection: 'column',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    cursor: 'pointer',
                    boxShadow: 6,
                  },
                  borderRadius: 2,
                  overflow: 'hidden',
                  backgroundColor: supplier.color
                }}
                onClick={() => handleCardClick(supplier)}
              >
                <CardContent sx={{ 
                  flexGrow: 1, 
                  justifyContent: 'center', 
                  alignItems: 'center',
                  p: { xs: 2, sm: 5 }
                }}>
                  <Typography 
                    variant="h1" 
                    align="center"
                    sx={{ 
                      color: supplier.textColor, 
                      fontWeight: 'bold',
                      fontSize: { xs: '3.5rem', sm: '5rem' }
                    }}
                  >
                    {supplier.ID}
                  </Typography>
                  <Typography
                    variant="h6"
                    component="div"
                    align="center"
                    sx={{
                      color: supplier.textColor,
                      fontWeight: 'bold',
                      mt: 2,
                      fontSize: { xs: '1rem', sm: '1.5rem' }
                    }}
                  >
                    {supplier.Name}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
      
      {selectedSupplier && (
        <Dialog
          open={openModal}
          onClose={handleClose}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 2,
              overflow: 'hidden'
            }
          }}
        >
          <DialogTitle sx={{ 
            backgroundColor: selectedSupplier.color, 
            color: selectedSupplier.textColor,
            py: 2
          }}>
            दूध चालान बनाएँ (Create Milk Invoice)
          </DialogTitle>
          <DialogContent sx={{ pt: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar 
                sx={{ bgcolor: selectedSupplier.color, mr: 2, width: 56, height: 56, fontSize: '1.5rem' }}
              >
                {selectedSupplier.ID}
              </Avatar>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  आपूर्तिकर्ता (Supplier): {selectedSupplier.Name}
                </Typography>
                <Typography variant="body1">
                  उत्पाद (Product): दूध (Milk) - ₹{selectedSupplier.Price.toFixed(2)} प्रति लीटर (per liter)
                </Typography>
              </Box>
            </Box>
            
            <Box component="form" sx={{ mt: 3 }}>
              {/* Read-only date field showing current date */}
              <TextField
                label="चालान दिनांक (Invoice Date)"
                value={formatDate()}
                fullWidth
                InputProps={{
                  readOnly: true,
                }}
                sx={{ mb: 2 }}
              />
              
              {/* Time Period Field (non-editable) */}
              <TextField
                label="समय अवधि (Time Period)"
                value={getTimePeriodLabel()}
                fullWidth
                InputProps={{
                  readOnly: true,
                }}
                sx={{ mb: 2 }}
              />
              
              <TextField
                label="मात्रा, लीटर में (Quantity in liters)"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(parseFloat(e.target.value) || '')}
                fullWidth
                margin="normal"
                inputProps={{ min: "0.5", step: "0.5" }}
                required
                sx={{ mb: 2 }}
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ px: 3, py: 2, bgcolor: '#f9f9f9' }}>
            <Button 
              onClick={handleClose} 
              variant="outlined" 
              disabled={isSubmitting}
            >
              रद्द करें (Cancel)
            </Button>
            <Button 
              onClick={handleSubmit} 
              variant="contained" 
              disabled={isSubmitting}
              sx={{ 
                bgcolor: selectedSupplier.color,
                '&:hover': {
                  bgcolor: selectedSupplier.color,
                  opacity: 0.9,
                }
              }}
            >
              {isSubmitting ? 'जमा हो रहा है... (Submitting...)' : 'चालान जमा करें (Submit Invoice)'}
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Container>
  );
}