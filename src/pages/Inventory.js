import React from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  IconButton, 
  Grid, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel,
  Divider,
  Paper
} from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const Inventory = () => {
  // Sample data for the pie chart
  const data = [
    { name: 'Category 1', value: 30 },
    { name: 'Category 2', value: 25 },
    { name: 'Category 3', value: 15 },
    { name: 'Category 4', value: 10 },
    { name: 'Category 5', value: 8 },
    { name: 'Category 6', value: 7 },
    { name: 'Category 7', value: 5 },
  ];

  const COLORS = ['#69a3ff', '#41cabc', '#93e088', '#fadd6f', '#f8c266', '#f5926e', '#e84855'];

  return (
    <Box sx={{ p: 3, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <Grid container spacing={2}>
        {/* Key Statistics */}
        <Grid item xs={12} md={6} lg={4}>
          <Card elevation={0}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6" component="div">
                  Key Statistics
                </Typography>
                <IconButton size="small">
                  <InfoOutlinedIcon />
                </IconButton>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1, p: 1, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                <Typography variant="body1" color="text.secondary">
                  Purchase
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  ₹ 0
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 1, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                <Typography variant="body1" color="text.secondary">
                  Wastage
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  ₹ 0
                </Typography>
              </Box>
              
              <Box mt={2}>
                <FormControl size="small" variant="outlined" sx={{ minWidth: 120 }}>
                  <Select
                    defaultValue="Today"
                    sx={{ bgcolor: 'white' }}
                  >
                    <MenuItem value="Today">Today</MenuItem>
                    <MenuItem value="Yesterday">Yesterday</MenuItem>
                    <MenuItem value="Last Week">Last Week</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* COGS */}
        <Grid item xs={12} md={6} lg={4}>
          <Card elevation={0} sx={{ height: '100%' }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6" component="div">
                  COGS
                </Typography>
                <IconButton size="small">
                  <LightModeOutlinedIcon />
                </IconButton>
              </Box>
              
              <Box display="flex" justifyContent="center" alignItems="center" sx={{ height: '70%' }}>
                <Box textAlign="center">
                  <img src="/api/placeholder/100/100" alt="No data" style={{ opacity: 0.5 }} />
                  <Typography variant="body1" color="text.secondary" mt={2}>
                    No Consumption Data Found
                  </Typography>
                </Box>
              </Box>
              
              <Box display="flex" gap={1} mt={2}>
                <FormControl size="small" variant="outlined" sx={{ minWidth: 120 }}>
                  <Select
                    defaultValue="Today"
                    sx={{ bgcolor: 'white' }}
                  >
                    <MenuItem value="Today">Today</MenuItem>
                    <MenuItem value="Yesterday">Yesterday</MenuItem>
                    <MenuItem value="Last Week">Last Week</MenuItem>
                  </Select>
                </FormControl>
                
                <FormControl size="small" variant="outlined" sx={{ minWidth: 120 }}>
                  <Select
                    defaultValue="Category"
                    sx={{ bgcolor: 'white' }}
                  >
                    <MenuItem value="Category">Category</MenuItem>
                    <MenuItem value="Type">Type</MenuItem>
                    <MenuItem value="Brand">Brand</MenuItem>
                  </Select>
                </FormControl>
                
                <FormControl size="small" variant="outlined" sx={{ minWidth: 120 }}>
                  <Select
                    defaultValue="Top 10"
                    sx={{ bgcolor: 'white' }}
                  >
                    <MenuItem value="Top 10">Top 10</MenuItem>
                    <MenuItem value="Top 20">Top 20</MenuItem>
                    <MenuItem value="All">All</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Pending Section */}
        <Grid item xs={12} md={6} lg={4}>
          <Grid container spacing={2}>
            {/* Pending Purchases */}
            <Grid item xs={12}>
              <Card elevation={0}>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6" component="div">
                      Pending Purchases
                    </Typography>
                    <IconButton size="small">
                      <InfoOutlinedIcon />
                    </IconButton>
                  </Box>
                  
                  <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
                    <Typography variant="h5" fontWeight="medium">
                      1
                    </Typography>
                    <ArrowForwardIcon color="action" />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            {/* Pending PO Approvals */}
            <Grid item xs={12}>
              <Card elevation={0}>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6" component="div">
                      Pending PO Approvals
                    </Typography>
                    <IconButton size="small">
                      <InfoOutlinedIcon />
                    </IconButton>
                  </Box>
                  
                  <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
                    <Typography variant="h5" fontWeight="medium">
                      0
                    </Typography>
                    <Box>
                      <Typography variant="caption" color="primary" sx={{ display: 'flex', alignItems: 'center' }}>
                        <InfoOutlinedIcon sx={{ fontSize: 12, mr: 0.5 }} />
                        In last three months
                      </Typography>
                      <Box display="flex" justifyContent="flex-end">
                        <ArrowForwardIcon color="action" />
                      </Box>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>

        {/* New Purchase */}
        <Grid item xs={12} md={6} lg={4}>
          <Card elevation={0}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6" component="div">
                  New Purchase
                </Typography>
                <IconButton size="small">
                  <InfoOutlinedIcon />
                </IconButton>
              </Box>
              
              <Box display="flex" justifyContent="center" sx={{ height: 220 }}>
                <ResponsiveContainer width="80%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Outer', value: 100 },
                        { name: 'Inner', value: 30 }
                      ]}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      innerRadius={40}
                      startAngle={90}
                      endAngle={-270}
                      dataKey="value"
                    >
                      <Cell fill="#64b5f6" />
                      <Cell fill="#2196f3" />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </Box>
              
              <Box position="relative" mt={-14} display="flex" justifyContent="center">
                <Typography variant="caption" color="text.secondary" sx={{ position: 'absolute', top: 90, left: '36%' }}>
                  indore cake
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ position: 'absolute', top: 30, left: '38%' }}>
                  Bada Cake
                </Typography>
              </Box>
              
              <Box mt={4}>
                <FormControl size="small" variant="outlined" sx={{ minWidth: 120 }}>
                  <Select
                    defaultValue="3 days"
                    sx={{ bgcolor: 'white' }}
                  >
                    <MenuItem value="3 days">3 days</MenuItem>
                    <MenuItem value="7 days">7 days</MenuItem>
                    <MenuItem value="30 days">30 days</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Current Stock Price */}
        <Grid item xs={12} md={6} lg={4}>
          <Card elevation={0} sx={{ height: '100%' }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6" component="div">
                  Current Stock Price
                </Typography>
                <IconButton size="small">
                  <InfoOutlinedIcon />
                </IconButton>
              </Box>
              
              <Typography variant="h5" fontWeight="medium" sx={{ mb: 2 }}>
                ₹ 154,452.807
              </Typography>
              
              <Box sx={{ height: 220, display: 'flex', justifyContent: 'center' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      innerRadius={30}
                      dataKey="value"
                    >
                      {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </Box>
              
              <Box display="flex" justifyContent="center" mt={2}>
                <Typography variant="body1" fontWeight="medium">
                  Top 10 Raw Materials
                </Typography>
              </Box>

              <Box display="flex" justifyContent="space-between" alignItems="center" mt={4}>
                <FormControl size="small" variant="outlined" sx={{ minWidth: 120 }}>
                  <Select
                    defaultValue="All Category"
                    sx={{ bgcolor: 'white' }}
                  >
                    <MenuItem value="All Category">All Category</MenuItem>
                    <MenuItem value="Food">Food</MenuItem>
                    <MenuItem value="Beverages">Beverages</MenuItem>
                  </Select>
                </FormControl>
                
                <Box display="flex" alignItems="center">
                  <Typography variant="body2" color="primary">
                    View
                  </Typography>
                  <ArrowForwardIcon fontSize="small" color="primary" />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Raw Materials */}
        <Grid item xs={12} md={6} lg={4}>
          <Card elevation={0} sx={{ height: '100%' }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6" component="div">
                  Raw Materials
                </Typography>
                <IconButton size="small">
                  <InfoOutlinedIcon />
                </IconButton>
              </Box>
              
              <Box display="flex" justifyContent="center" alignItems="center" sx={{ height: 220 }}>
                <Box textAlign="center">
                  <img src="/api/placeholder/100/100" alt="No data" style={{ opacity: 0.5 }} />
                  <Typography variant="body1" color="text.secondary" mt={2}>
                    No Raw Materials Added
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Inventory;