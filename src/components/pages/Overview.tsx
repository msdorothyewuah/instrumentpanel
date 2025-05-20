// src/components/Overview.tsx
import React, { useState } from 'react';
import { 
  Container, 
  Grid, 
  Box, 
  Typography, 
  Paper, 
  Tabs, 
  Tab, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Alert, 
  SelectChangeEvent 
} from '@mui/material';
import { TimeRange } from '../types';
import { 
  useStructurizrDashboardData, 
  useC4DashboardData 
} from '../useAnalyticsQueries';
import { StatsCard } from './StatsCard';
import { WorkspaceChart } from './WorkspaceChart';
import { WorkspaceTable } from './WorkspaceTable';

// Tab panel component
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index, ...other }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`analytics-tabpanel-${index}`}
      aria-labelledby={`analytics-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

// Main Overview component
const Overview: React.FC = () => {
  // State for active tab
  const [tabValue, setTabValue] = useState(0);
  
  // State for filters
  const [timeRange, setTimeRange] = useState<TimeRange>('lastMonth');
  const [structurizrEonId, setStructurizrEonId] = useState<number | undefined>(undefined);
  const [c4Owner, setC4Owner] = useState<string | undefined>(undefined);
  const [activityDays, setActivityDays] = useState(45);
  const [newlyCreatedHours, setNewlyCreatedHours] = useState(24);

  // Fetch Structurizr data
  const structurizrData = useStructurizrDashboardData(
    timeRange, 
    structurizrEonId, 
    activityDays, 
    newlyCreatedHours
  );

  // Fetch C4 data
  const c4Data = useC4DashboardData(timeRange, c4Owner);

  // Generate unique Structurizr EON IDs for filter
  const eonIds = React.useMemo(() => {
    if (!structurizrData.workspaces?.length) return [];
    return [...new Set(structurizrData.workspaces.map(w => w.eonid))]
      .filter(Boolean)
      .sort((a, b) => a - b);
  }, [structurizrData.workspaces]);

  // Generate unique C4 owners for filter
  const owners = React.useMemo(() => {
    if (!c4Data.workspaces?.length) return [];
    return [...new Set(c4Data.workspaces.map(w => w.owner))]
      .filter(Boolean)
      .sort();
  }, [c4Data.workspaces]);

  // Handle tab change
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Handle filter changes
  const handleTimeRangeChange = (event: SelectChangeEvent) => {
    setTimeRange(event.target.value as TimeRange);
  };

  const handleEonIdChange = (event: SelectChangeEvent) => {
    const value = event.target.value;
    setStructurizrEonId(value ? Number(value) : undefined);
  };

  const handleOwnerChange = (event: SelectChangeEvent) => {
    const value = event.target.value;
    setC4Owner(value || undefined);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>
          Analytics Dashboard
        </Typography>
        
        {/* Filters common to both tabs */}
        <Paper sx={{ mb: 4, p: 3 }}>
          <Typography variant="h6" gutterBottom>Filters</Typography>
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
          </Grid>
        </Paper>
        
        {/* Tabs for switching between Structurizr and C4 analytics */}
        <Paper sx={{ mb: 4 }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange}
            aria-label="analytics tabs"
          >
            <Tab label="Structurizr Analytics" id="analytics-tab-0" />
            <Tab label="C4 Model Analytics" id="analytics-tab-1" />
          </Tabs>
          
          {/* Tab panel for Structurizr analytics */}
          <TabPanel value={tabValue} index={0}>
            {structurizrData.error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                Error loading Structurizr data: {structurizrData.error instanceof Error 
                  ? structurizrData.error.message 
                  : 'Unknown error'}
              </Alert>
            )}
            
            {/* Structurizr-specific filters */}
            <Box sx={{ mb: 3 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel id="eonid-label">EON ID</InputLabel>
                    <Select
                      labelId="eonid-label"
                      value={structurizrEonId?.toString() || ''}
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
            </Box>
            
            {/* Structurizr stats cards */}
            <StatsCard
              items={[
                {
                  title: "Total Workspaces",
                  value: structurizrData.workspaceCount,
                  isLoading: structurizrData.isLoading.count
                },
                {
                  title: "Newly Created",
                  value: structurizrData.newlyCreatedCount,
                  isLoading: structurizrData.isLoading.newlyCreated,
                  configValue: newlyCreatedHours,
                  configLabel: "hours",
                  onConfigChange: setNewlyCreatedHours
                },
                {
                  title: "Active Workspaces",
                  value: structurizrData.activeCount,
                  isLoading: structurizrData.isLoading.active,
                  configValue: activityDays,
                  configLabel: "days",
                  onConfigChange: setActivityDays
                }
              ]}
            />
            
            {/* Structurizr chart */}
            <WorkspaceChart
              title="Workspace Creation Over Time"
              data={structurizrData.analyticsData}
              isLoading={structurizrData.isLoading.analytics}
              isFetching={structurizrData.isFetching.analytics}
            />
            
            {/* Structurizr recent workspaces table */}
            <WorkspaceTable
              title="Recently Created Workspaces"
              workspaces={structurizrData.recentWorkspaces}
              isLoading={structurizrData.isLoading.recent}
              type="structurizr"
            />
          </TabPanel>
          
          {/* Tab panel for C4 analytics */}
          <TabPanel value={tabValue} index={1}>
            {c4Data.error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                Error loading C4 data: {c4Data.error instanceof Error 
                  ? c4Data.error.message 
                  : 'Unknown error'}
              </Alert>
            )}
            
            {/* C4-specific filters */}
            <Box sx={{ mb: 3 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel id="owner-label">Owner</InputLabel>
                    <Select
                      labelId="owner-label"
                      value={c4Owner || ''}
                      label="Owner"
                      onChange={handleOwnerChange}
                    >
                      <MenuItem value="">All Owners</MenuItem>
                      {owners.map((owner) => (
                        <MenuItem key={owner} value={owner}>
                          {owner}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Box>
            
            {/* C4 stats card */}
            <StatsCard
              items={[
                {
                  title: "Total C4 Workspaces",
                  value: c4Data.workspaceCount,
                  isLoading: c4Data.isLoading.count
                }
              ]}
            />
            
            {/* C4 chart */}
            <WorkspaceChart
              title="C4 Model Creation Over Time"
              data={c4Data.analyticsData}
              isLoading={c4Data.isLoading.analytics}
              isFetching={c4Data.isFetching.analytics}
            />
            
            {/* C4 most viewed workspaces table */}
            <WorkspaceTable
              title="Most Viewed C4 Models"
              workspaces={c4Data.mostViewedWorkspaces}
              isLoading={c4Data.isLoading.mostViewed}
              type="c4"
            />
            
            {/* C4 recent workspaces table */}
            <WorkspaceTable
              title="Recently Created C4 Models"
              workspaces={c4Data.recentWorkspaces}
              isLoading={c4Data.isLoading.recent}
              type="c4"
            />
          </TabPanel>
        </Paper>
      </Box>
    </Container>
  );
};

export default Overview;