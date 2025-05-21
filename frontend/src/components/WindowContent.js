import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { green, orange, red, grey } from '@mui/material/colors';

const WindowContent = () => {
  const [requests, setRequests] = useState([]);
  const [clock, setClock] = useState(new Date());

  const fetchRequests = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/show-endpoints');
      if (response.ok) {
        const data = await response.json();
        setRequests(data);
      } else {
        console.error('Failed to fetch requests');
      }
    } catch (error) {
      console.error('Error fetching requests:', error);
    }
  };

  useEffect(() => {
    fetchRequests(); // Initial fetch
  }, []);

  // Update clock every second
  useEffect(() => {
    const clockInterval = setInterval(() => {
      setClock(new Date());
    }, 1000);
    return () => clearInterval(clockInterval); // Cleanup interval on unmount
  }, []);

  // Fetch requests every 20 seconds
  useEffect(() => {
    const fetchInterval = setInterval(() => {
      fetchRequests();
    }, 20000);
    return () => clearInterval(fetchInterval); // Cleanup interval on unmount
  }, []);

  // Get state color with MUI colors as inline styles
  const getStateColor = (state) => {
    switch (state.toLowerCase()) {
      case 'stable':
        return { color: green[600], fontWeight: 'bold' };
      case 'unstable':
        return { color: orange[600], fontWeight: 'bold' };
      case 'inactive':
        return { color: red[600], fontWeight: 'bold' };
      default:
        return { color: grey[700] };
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-100 to-gray-300 p-6 flex flex-col items-center">
      <AppBar position="static" className="mb-6 bg-blue-600">
        <Toolbar>
          <Typography variant="h6" className="flex-grow text-white">
            Endpoints Viewer
          </Typography>
          <Typography className="text-white">
            {clock.toLocaleTimeString()} {/* Display live clock */}
          </Typography>
          <IconButton color="inherit" onClick={fetchRequests} aria-label="Refresh">
            <RefreshIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Card className="shadow-2xl rounded-2xl w-full max-w-4xl">
        <CardContent>
          <Table className="w-full border border-gray-300">
            <TableHead className="bg-gray-200">
              <TableRow>
                <TableCell className="font-semibold">UUID</TableCell>
                <TableCell className="font-semibold">State</TableCell>
                <TableCell className="font-semibold">Malicious Count</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {requests.map((request, index) => (
                <TableRow key={index} className="hover:bg-gray-50 transition">
                  <TableCell className="py-4 px-6 text-gray-700">{request.uuid}</TableCell>
                  <TableCell className="py-4 px-6" style={getStateColor(request.state)}>
                    {request.state}
                  </TableCell>
                  <TableCell className="py-4 px-6 text-gray-700">{request.maliciousCount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default WindowContent;
