// src/components/StatsCard.tsx
import React from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Grid, 
  Typography, 
  CircularProgress, 
  TextField,
  InputAdornment
} from '@mui/material';

interface StatsItemProps {
  title: string;
  value: number | string;
  isLoading: boolean;
  configValue?: number;
  configLabel?: string;
  onConfigChange?: (value: number) => void;
}

const StatsItem: React.FC<StatsItemProps> = ({ 
  title, 
  value, 
  isLoading, 
  configValue, 
  configLabel, 
  onConfigChange 
}) => {
  return (
    <Grid item xs={12} md={4}>
      <Card sx={{ height: '100%' }}>
        <CardContent>
          <Box display="flex" alignItems="center" mb={1} justifyContent="space-between">
            <Typography color="textSecondary" variant="subtitle1">
              {title}
            </Typography>
            {configValue !== undefined && onConfigChange && (
              <Box ml={2}>
                <TextField
                  type="number"
                  size="small"
                  value={configValue}
                  onChange={(e) => onConfigChange(Number(e.target.value))}
                  InputProps={{
                    endAdornment: configLabel && (
                      <InputAdornment position="end">{configLabel}</InputAdornment>
                    ),
                  }}
                  sx={{ width: '120px' }}
                />
              </Box>
            )}
          </Box>
          <Typography variant="h4">
            {isLoading ? (
              <CircularProgress size={24} />
            ) : (
              typeof value === 'number' ? value.toLocaleString() : value
            )}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  );
};

interface StatsCardProps {
  items: StatsItemProps[];
}

export const StatsCard: React.FC<StatsCardProps> = ({ items }) => {
  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      {items.map((item, index) => (
        <StatsItem key={index} {...item} />
      ))}
    </Grid>
  );
};