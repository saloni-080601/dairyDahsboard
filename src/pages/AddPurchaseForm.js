import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  Checkbox, 
  Container, 
  Divider, 
  FormControl, 
  FormControlLabel, 
  FormLabel, 
  Grid, 
  IconButton, 
  InputAdornment, 
  InputLabel, 
  MenuItem, 
  Paper, 
  Radio, 
  RadioGroup, 
  Select, 
  Step, 
  StepLabel, 
  Stepper, 
  TextField, 
  Typography
} from '@mui/material';
import { 
  ArrowBack, 
  CalendarMonth, 
  AccessTime, 
  Description, 
  Add, 
  Delete, 
  AttachMoney 
} from '@mui/icons-material';

export default function AddPurchaseForm() {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    department: "",
    fromType: "supplier",
    supplier: "",
    poNumber: "393",
    invoiceDate: new Date().toISOString().split('T')[0],
    timeOfDay: "morning",
    invoiceNumber: "",
    gstNumber: "",
    paymentType: "unpaid",
    updateInventory: true,
    items: [{ id: 1, name: "", qty: "", unit: "", price: "", amount: "", tax: "", description: "" }],
    grandTotal: 0,
    totalTaxes: 0,
    // Added payment details fields
    paidAmount: "",
    paymentDate: new Date().toISOString().split('T')[0],
    paymentMode: "cash"
  });
  
  const [invoiceFile, setInvoiceFile] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRadioChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // If switching to unpaid, clear payment details
    if (name === "paymentType" && value === "unpaid") {
      setFormData(prev => ({
        ...prev,
        [name]: value,
        paidAmount: "",
        paymentDate: new Date().toISOString().split('T')[0],
        paymentMode: "cash"
      }));
    }
    
    // If switching to paid, set default paid amount to grand total
    if (name === "paymentType" && value === "paid") {
      setFormData(prev => ({
        ...prev,
        [name]: value,
        paidAmount: prev.grandTotal
      }));
    }
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData({ ...formData, [name]: checked });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setInvoiceFile(file);
  };

  const handleItemChange = (e, index) => {
    const { name, value } = e.target;
    const updatedItems = [...formData.items];
    updatedItems[index] = { ...updatedItems[index], [name]: value };

    if (name === 'price' || name === 'qty') {
      const price = name === 'price' ? value : updatedItems[index].price;
      const qty = name === 'qty' ? value : updatedItems[index].qty;
      if (price && qty) {
        updatedItems[index].amount = (parseFloat(price) * parseFloat(qty)).toFixed(2);
      }
    }

    setFormData({ ...formData, items: updatedItems });
    calculateTotals(updatedItems);
  };

  const addNewItem = () => {
    const newItem = { id: formData.items.length + 1, name: "", qty: "", unit: "", price: "", amount: "", tax: "", description: "" };
    setFormData({ ...formData, items: [...formData.items, newItem] });
  };

  const removeItem = (index) => {
    const updatedItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: updatedItems });
    calculateTotals(updatedItems);
  };

  const calculateTotals = (items) => {
    let total = 0;
    let taxes = 0;
    items.forEach(item => {
      if (item.amount) total += parseFloat(item.amount);
      if (item.tax) taxes += parseFloat(item.tax);
    });
    
    const newTotal = total.toFixed(2);
    
    setFormData(prev => {
      // Update paid amount if payment type is "paid"
      const updatedData = { 
        ...prev, 
        grandTotal: newTotal, 
        totalTaxes: taxes.toFixed(2)
      };
      
      // If payment type is already set to "paid", update the paid amount field too
      if (prev.paymentType === "paid") {
        updatedData.paidAmount = newTotal;
      }
      
      return updatedData;
    });
  };

  const handleSubmit = () => {
    console.log("Submitting form data:", formData);
    // API submission code here
    alert('Purchase added successfully!');
  };

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const steps = ['Supplier Details', 'Invoice Information', 'Items & Payment'];

  return (
    <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh', py: 3 }}>
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Button 
            variant="outlined" 
            startIcon={<ArrowBack />} 
            sx={{ mr: 2 }}
            onClick={() => console.log("Back to billing")}
          >
            Back to Billing
          </Button>
          <Typography variant="h5" component="h1" fontWeight="medium">
            New Purchase
          </Typography>
        </Box>

        <Paper sx={{ p: 4, mb: 4 }}>
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {activeStep === 0 && (
            <Box>
              <Typography variant="h6" sx={{ mb: 3 }}>Department & Supplier</Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel id="department-label">Department *</InputLabel>
                    <Select
                      labelId="department-label"
                      name="department"
                      value={formData.department}
                      label="Department *"
                      onChange={handleInputChange}
                    >
                      <MenuItem value="" disabled>Please select department</MenuItem>
                      <MenuItem value="production">Production</MenuItem>
                      <MenuItem value="sales">Sales</MenuItem>
                      <MenuItem value="admin">Administration</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <FormControl component="fieldset">
                    <FormLabel component="legend">From</FormLabel>
                    <RadioGroup 
                      row 
                      name="fromType" 
                      value={formData.fromType}
                      onChange={handleRadioChange}
                    >
                      <FormControlLabel value="supplier" control={<Radio />} label="Supplier" />
                      <FormControlLabel value="kitchen" control={<Radio />} label="Kitchen" />
                    </RadioGroup>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel id="supplier-label">Supplier *</InputLabel>
                    <Select
                      labelId="supplier-label"
                      name="supplier"
                      value={formData.supplier}
                      label="Supplier *"
                      onChange={handleInputChange}
                    >
                      <MenuItem value="" disabled>Select Supplier</MenuItem>
                      <MenuItem value="indore_cake">Indore cake [Supplier]</MenuItem>
                      <MenuItem value="f1_kitchen">F1 [Kitchen]</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="PO No. *"
                    name="poNumber"
                    value={formData.poNumber}
                    onChange={handleInputChange}
                  />
                </Grid>
              </Grid>
              
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                <Button 
                  variant="contained" 
                  onClick={handleNext}
                >
                  Next
                </Button>
              </Box>
            </Box>
          )}

          {activeStep === 1 && (
            <Box>
              <Typography variant="h6" sx={{ mb: 3 }}>Invoice Details</Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Invoice Date *"
                    type="date"
                    name="invoiceDate"
                    value={formData.invoiceDate}
                    onChange={handleInputChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <CalendarMonth />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel id="time-of-day-label">Time of Day</InputLabel>
                    <Select
                      labelId="time-of-day-label"
                      name="timeOfDay"
                      value={formData.timeOfDay}
                      label="Time of Day"
                      onChange={handleInputChange}
                      startAdornment={
                        <InputAdornment position="start">
                          <AccessTime />
                        </InputAdornment>
                      }
                    >
                      <MenuItem value="morning">Morning</MenuItem>
                      <MenuItem value="evening">Evening</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Invoice Number"
                    name="invoiceNumber"
                    value={formData.invoiceNumber}
                    onChange={handleInputChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Description />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="GST No"
                    name="gstNumber"
                    value={formData.gstNumber}
                    onChange={handleInputChange}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <InputLabel sx={{ mb: 1 }}>Invoice File</InputLabel>
                  <input
                    type="file"
                    id="invoice-file-upload"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                    accept="image/png,image/jpeg,application/pdf"
                  />
                  <label htmlFor="invoice-file-upload">
                    <Button variant="outlined" component="span">
                      Choose Files
                    </Button>
                  </label>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {invoiceFile ? invoiceFile.name : 'No file chosen'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Upload only png, jpeg, gif or pdf file (max 5MB)
                  </Typography>
                </Grid>
              </Grid>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                <Button onClick={handleBack}>
                  Back
                </Button>
                <Button 
                  variant="contained" 
                  onClick={handleNext}
                >
                  Next
                </Button>
              </Box>
            </Box>
          )}

          {activeStep === 2 && (
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6">Raw Material Details</Typography>
                <Button 
                  variant="outlined" 
                  color="error" 
                  startIcon={<Add />}
                  onClick={addNewItem}
                >
                  Add Item
                </Button>
              </Box>
              
              {formData.items.map((item, index) => (
                <Paper 
                  key={index} 
                  variant="outlined" 
                  sx={{ mb: 3, p: 2 }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="subtitle1" fontWeight="medium">
                      {item.name || `Item #${index + 1}`}
                    </Typography>
                    <IconButton 
                      color="error" 
                      onClick={() => removeItem(index)}
                    >
                      <Delete />
                    </IconButton>
                  </Box>
                  
                  <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Item Name"
                        name="name"
                        value={item.name}
                        onChange={(e) => handleItemChange(e, index)}
                        size="small"
                      />
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Description"
                        name="description"
                        value={item.description}
                        onChange={(e) => handleItemChange(e, index)}
                        size="small"
                      />
                    </Grid>
                  </Grid>
                  
                  <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={6} md={3}>
                      <TextField
                        fullWidth
                        label="Quantity"
                        name="qty"
                        value={item.qty}
                        onChange={(e) => handleItemChange(e, index)}
                        size="small"
                      />
                    </Grid>
                    
                    <Grid item xs={6} md={3}>
                      <TextField
                        fullWidth
                        label="Unit"
                        name="unit"
                        value={item.unit}
                        onChange={(e) => handleItemChange(e, index)}
                        size="small"
                      />
                    </Grid>
                    
                    <Grid item xs={6} md={3}>
                      <TextField
                        fullWidth
                        label="Price"
                        name="price"
                        value={item.price}
                        onChange={(e) => handleItemChange(e, index)}
                        size="small"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <AttachMoney />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    
                    <Grid item xs={6} md={3}>
                      <TextField
                        fullWidth
                        label="Tax"
                        name="tax"
                        value={item.tax}
                        onChange={(e) => handleItemChange(e, index)}
                        size="small"
                      />
                    </Grid>
                  </Grid>
                  
                  <Typography variant="h6" sx={{ mt: 1 }}>
                    Total: ₹{item.amount || '0.00'}
                  </Typography>
                </Paper>
              ))}
              
              <Divider sx={{ my: 3 }} />
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <FormControl component="fieldset">
                    <FormLabel component="legend">Payment Type</FormLabel>
                    <RadioGroup 
                      row 
                      name="paymentType" 
                      value={formData.paymentType}
                      onChange={handleRadioChange}
                    >
                      <FormControlLabel value="unpaid" control={<Radio />} label="Unpaid" />
                      <FormControlLabel value="paid" control={<Radio />} label="Paid" />
                    </RadioGroup>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.updateInventory}
                        onChange={handleCheckboxChange}
                        name="updateInventory"
                      />
                    }
                    label="Update Inventory Stock"
                  />
                </Grid>
              </Grid>
              
              {/* Payment details section - only shown when "Paid" is selected */}
              {formData.paymentType === "paid" && (
                <Paper variant="outlined" sx={{ mt: 3, p: 3 }}>
                  <Typography variant="subtitle1" sx={{ mb: 2 }}>Payment Details</Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        required
                        fullWidth
                        label="Paid Amount"
                        name="paidAmount"
                        value={formData.paidAmount}
                        onChange={handleInputChange}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <AttachMoney />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <TextField
                        required
                        fullWidth
                        label="Payment Date"
                        type="date"
                        name="paymentDate"
                        value={formData.paymentDate}
                        onChange={handleInputChange}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <CalendarMonth />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    
                    <Grid item xs={12}>
                      <FormControl component="fieldset">
                        <FormLabel component="legend">Payment Mode</FormLabel>
                        <RadioGroup 
                          row 
                          name="paymentMode" 
                          value={formData.paymentMode}
                          onChange={handleRadioChange}
                        >
                          <FormControlLabel value="cash" control={<Radio />} label="Cash" />
                          <FormControlLabel value="card" control={<Radio />} label="Card" />
                          <FormControlLabel value="cheque" control={<Radio />} label="Cheque" />
                          <FormControlLabel value="online" control={<Radio />} label="Online" />
                          <FormControlLabel value="other" control={<Radio />} label="Other" />
                        </RadioGroup>
                      </FormControl>
                    </Grid>
                  </Grid>
                </Paper>
              )}
              
              <Paper 
                sx={{ 
                  mt: 3, 
                  p: 2, 
                  bgcolor: '#e3f2fd', 
                  border: '1px solid #90caf9'
                }}
              >
                <Typography variant="h6" fontWeight="medium">
                  Grand Total: ₹{formData.grandTotal || '0.00'}
                </Typography>
                <Typography color="text.secondary">
                  Total Taxes: ₹{formData.totalTaxes || '0.00'}
                </Typography>
                {formData.paymentType === "paid" && (
                  <Typography variant="subtitle1" sx={{ mt: 1, color: 'green' }}>
                    Paid Amount: ₹{formData.paidAmount || '0.00'}
                  </Typography>
                )}
              </Paper>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                <Button onClick={handleBack}>
                  Back
                </Button>
                <Button 
                  variant="contained" 
                  color="success" 
                  onClick={handleSubmit}
                >
                  Submit Purchase
                </Button>
              </Box>
            </Box>
          )}
        </Paper>
      </Container>
    </Box>
  );
}