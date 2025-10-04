import React, { useState, useEffect } from 'react';
import { PerformanceRecord, Update } from '@/entities/all';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { BarChart, CheckCircle, Clock } from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { format } from 'date-fns';

const COLORS = ['#10B981', '#F59E0B', '#EF4444'];

export default function EmployeeDashboard({ user }) {
  const [records, setRecords] = useState([]);
  const [updates, setUpdates] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        const [perfRecords, allUpdates] = await Promise.all([
          PerformanceRecord.filter({ employee_email: user.email }, '-date', 30),
          Update.list('-created_date', 5)
        ]);
        setRecords(perfRecords);
        setUpdates(allUpdates);
      }
    };
    fetchData();
  }, [user]);

  const averageScores = records.reduce(
    (acc, record) => {
      acc.punctuality += record.punctuality;
      acc.attitude += record.attitude;
      acc.responsiveness += record.responsiveness;
      return acc;
    },
    { punctuality: 0, attitude: 0, responsiveness: 0 }
  );
  
  const recordCount = records.length || 1;
  const overallAverage = ((averageScores.punctuality + averageScores.attitude + averageScores.responsiveness) / 3 / recordCount).toFixed(1);

  const data = [
      { name: 'Punctuality', value: averageScores.punctuality / recordCount },
      { name: 'Attitude', value: averageScores.attitude / recordCount },
      { name: 'Responsiveness', value: averageScores.responsiveness / recordCount },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome, {user.full_name}!</h1>
      <p className="text-gray-500 mb-8">Here's a summary of your performance and recent updates.</p>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Overall Performance (Last 30 days)</CardTitle>
                    <BarChart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-5xl font-bold text-blue-600">{overallAverage} <span className="text-2xl text-gray-400">/ 10</span></div>
                    <p className="text-xs text-muted-foreground">Based on {records.length} records</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle className="text-sm font-medium">Score Breakdown</CardTitle>
                </CardHeader>
                <CardContent className="h-40">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={50} fill="#8884d8">
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(value) => `${value.toFixed(1)}/10`}/>
                        </PieChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
        
        <Card className="lg:col-span-1">
            <CardHeader>
                <CardTitle>Recent Updates</CardTitle>
            </CardHeader>
            <CardContent>
                <ul className="space-y-3">
                    {updates.map(update => (
                        <li key={update.id} className="flex items-start gap-3 text-sm">
                            {update.acknowledged_by?.includes(user.email) ? (
                                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                            ) : (
                                <Clock className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                            )}
                            <div>
                                <p className="font-medium">{update.title}</p>
                                <p className="text-xs text-gray-500">{format(new Date(update.created_date), 'MMM d, yyyy')}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
