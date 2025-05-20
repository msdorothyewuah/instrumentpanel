// src/components/C4TSAnalytics.tsx
import React, { useState } from 'react';
import { 
  Container, 
  Box, 
  Typography, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Grid, 
  Alert, 
  Paper,
  SelectChangeEvent
} from '@mui/material';
import { TimeRange } from '../types';
import { useC4DashboardData } from '../useAnalyticsQueries';
import { StatsCard } from './StatsCard';
import { WorkspaceChart } from './WorkspaceChart';
import { WorkspaceTable } from './WorkspaceTable';

const C4TSAnalytics: React.FC = () => {
  // State for filters
  const [timeRange, setTimeRange] = useState<TimeRange>('lastMonth');
  const [owner, setOwner] = useState<string | undefined>(undefined);

  // Fetch data using React Query
  const {
    workspaces,
    analyticsData,
    workspaceCount,
    mostViewedWorkspaces,
    recentWorkspaces,
    isLoading,
    isFetching,
    error
  } = useC4DashboardData(timeRange, owner);

  // Get unique owners for filter
  const owners = React.useMemo(() => {
    if (!workspaces?.length) return [];
    return [...new Set(workspaces.map(w => w.owner))]
      .filter(Boolean)
      .sort();
  }, [workspaces]);

  // Handle filter changes
  const handleTimeRangeChange = (event: SelectChangeEvent) => {
    setTimeRange(event.target.value as TimeRange);
  };

  const handleOwnerChange = (event: SelectChangeEvent) => {
    const value = event.target.value;
    setOwner(value || undefined);
  };

  return (
    <Container maxWidth="lg">
      <Box py={4}>
        <Box mb={4}>
          <Typography variant="h4" gutterBottom>
            C4 Model Analytics
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Monitor your C4 model usage and activity
          </Typography>
        </Box>

        {/* Error display */}
        {error && (
          <Alert severity="error" sx={{ mb: 4 }}>
            {error instanceof Error ? error.message : 'An error occurred while fetching data'}
          </Alert>
        )}

        {/* Filters */}
        <Paper sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Filters
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel id="timerange-label">Time Range</InputLabel>
                <Select
                  labelId="timerange-label"
                  value={timeRange}
                  label="Time Range"
                  onChange={handleTimeRangeChange}
                >
                  <MenuItem value="lastWeek">Last 7 Days</MenuItem>
                  <MenuItem value="lastMonth">Last 30 Days</MenuItem>
                  <MenuItem value="last3Months">Last 3 Months</MenuItem>
                  <MenuItem value="lastYear">Last Year</MenuItem>
                  <MenuItem value="last2Years">All Time</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel id="owner-label">Owner</InputLabel>
                <Select
                  labelId="owner-label"
                  value={owner || ''}
                  label="Owner"
                  onChange={handleOwnerChange}
                >
                  <MenuItem value="">All Owners</MenuItem>
                  {owners.map((ownerName) => (
                    <MenuItem key={ownerName} value={ownerName}>
                      {ownerName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Paper>

        {/* Stats Cards */}
        <StatsCard
          items={[
            {
              title: "Total C4 Models",
              value: workspaceCount,
              isLoading: isLoading.count
            }
            // Add more stats cards as needed
          ]}
        />

        {/* Analytics Chart */}
        <WorkspaceChart
          title="C4 Model Creation Over Time"
          data={analyticsData}
          isLoading={isLoading.analytics}
          isFetching={isFetching.analytics}
        />

        {/* Most Viewed Workspaces Table */}
        <Box mb={4}>
          <WorkspaceTable
            title="Most Viewed C4 Models"
            workspaces={mostViewedWorkspaces}
            isLoading={isLoading.mostViewed}
            type="c4"
          />
        </Box>

        {/* Recent Workspaces Table */}
        <WorkspaceTable
          title="Recently Created C4 Models"
          workspaces={recentWorkspaces}
          isLoading={isLoading.recent}
          type="c4"
        />
      </Box>
    </Container>
  );
};

export default C4TSAnalytics;