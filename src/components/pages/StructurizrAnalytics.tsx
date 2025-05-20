// src/components/StructurizrAnalytics.tsx
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
import { useStructurizrDashboardData } from '../useAnalyticsQueries';
import { StatsCard } from './StatsCard';
import { WorkspaceChart } from './WorkspaceChart';
import { WorkspaceTable } from './WorkspaceTable';

const StructurizrAnalytics: React.FC = () => {
  // State for filters
  const [timeRange, setTimeRange] = useState<TimeRange>('lastMonth');
  const [eonid, setEonid] = useState<number | undefined>(undefined);
  const [activityDays, setActivityDays] = useState(45);
  const [newlyCreatedHours, setNewlyCreatedHours] = useState(24);

  // Fetch data using React Query
  const {
    workspaces,
    analyticsData,
    workspaceCount,
    newlyCreatedCount,
    activeCount,
    recentWorkspaces,
    isLoading,
    isFetching,
    error
  } = useStructurizrDashboardData(timeRange, eonid, activityDays, newlyCreatedHours);

  // Get unique EON IDs for filter
  const eonIds = React.useMemo(() => {
    if (!workspaces?.length) return [];
    return [...new Set(workspaces.map(w => w.eonid))]
      .filter(Boolean)
      .sort((a, b) => a - b);
  }, [workspaces]);

  // Handle filter changes
  const handleTimeRangeChange = (event: SelectChangeEvent) => {
    setTimeRange(event.target.value as TimeRange);
  };

  const handleEonIdChange = (event: SelectChangeEvent) => {
    const value = event.target.value;
    setEonid(value ? Number(value) : undefined);
  };

  return (
    <Container maxWidth="lg">
      <Box py={4}>
        <Box mb={4}>
          <Typography variant="h4" gutterBottom>
            Structurizr Analytics
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Monitor your Structurizr workspace usage and activity
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
                <InputLabel id="eonid-label">EON ID</InputLabel>
                <Select
                  labelId="eonid-label"
                  value={eonid?.toString() || ''}
                  label="EON ID"
                  onChange={handleEonIdChange}
                >
                  <MenuItem value="">All EON IDs</MenuItem>
                  {eonIds.map((id) => (
                    <MenuItem key={id} value={id.toString()}>
                      {id}
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
              title: "Total Workspaces",
              value: workspaceCount,
              isLoading: isLoading.count
            },
            {
              title: "Newly Created",
              value: newlyCreatedCount,
              isLoading: isLoading.newlyCreated,
              configValue: newlyCreatedHours,
              configLabel: "hours",
              onConfigChange: setNewlyCreatedHours
            },
            {
              title: "Active Workspaces",
              value: activeCount,
              isLoading: isLoading.active,
              configValue: activityDays,
              configLabel: "days",
              onConfigChange: setActivityDays
            }
          ]}
        />

        {/* Analytics Chart */}
        <WorkspaceChart
          title="Workspace Creation Over Time"
          data={analyticsData}
          isLoading={isLoading.analytics}
          isFetching={isFetching.analytics}
        />

        {/* Recent Workspaces Table */}
        <WorkspaceTable
          title="Recently Created Workspaces"
          workspaces={recentWorkspaces}
          isLoading={isLoading.recent}
          type="structurizr"
        />
      </Box>
    </Container>
  );
};

export default StructurizrAnalytics;