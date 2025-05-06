// src/components/dashboard/WorkspaceChart.tsx

import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer
} from 'recharts';

interface ChartDataPoint {
  date: string;
  count: number;
}

interface WorkspaceChartProps {
  data: ChartDataPoint[];
}

const WorkspaceChart: React.FC<WorkspaceChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 65 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
        <XAxis
          dataKey="date"
          height={60}
          tickFormatter={(date) => {
            const d = new Date(date);
            return `${d.getMonth() + 1}/${d.getDate()}`;
          }}
          tick={{
            angle: -45,
            textAnchor: 'end',
            fill: '#4A5568'
          }}
        />
        <YAxis
          tick={{ fill: '#4A5568' }}
          tickFormatter={(value) => value.toFixed(0)}
        />
        <Tooltip
          labelFormatter={(date) => new Date(date).toLocaleDateString()}
          formatter={(value: number) => [value, 'Workspaces']}
          contentStyle={{
            backgroundColor: 'white',
            border: '1px solid #E2E8F0',
            borderRadius: '6px',
            padding: '8px'
          }}
        />
        <Legend verticalAlign="top" height={36} />
        <Line
          type="monotone"
          dataKey="count"
          stroke="#3182CE"
          strokeWidth={2}
          dot={{ r: 4, fill: '#3182CE' }}
          activeDot={{ r: 6, fill: '#2B6CB0' }}
          name="Workspaces Created"
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default WorkspaceChart;