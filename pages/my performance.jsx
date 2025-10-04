import React, { useState, useEffect } from 'react';
import { PerformanceRecord } from '@/entities/all';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

export default function MyPerformance({ user }) {
    const [records, setRecords] = useState([]);

    useEffect(() => {
        const fetchRecords = async () => {
            if (user) {
                const data = await PerformanceRecord.filter({ employee_email: user.email }, '-date');
                setRecords(data);
            }
        };
        fetchRecords();
    }, [user]);

    const chartData = records.map(r => ({
        date: format(new Date(r.date), 'MMM d'),
        Punctuality: r.punctuality,
        Attitude: r.attitude,
        Responsiveness: r.responsiveness,
    })).reverse();

    if (!user) return null;

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-8">My Performance Report</h1>
            
            <Card className="mb-8">
                <CardHeader>
                    <CardTitle>Performance Over Time</CardTitle>
                </CardHeader>
                <CardContent className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis domain={[0, 10]} />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="Punctuality" stroke="#3b82f6" />
                            <Line type="monotone" dataKey="Attitude" stroke="#10b981" />
                            <Line type="monotone" dataKey="Responsiveness" stroke="#f97316" />
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Detailed Records</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Punctuality</TableHead>
                                <TableHead>Attitude</TableHead>
                                <TableHead>Responsiveness</TableHead>
                                <TableHead>HR Remarks</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {records.map(record => (
                                <TableRow key={record.id}>
                                    <TableCell>{format(new Date(record.date), 'MMMM d, yyyy')}</TableCell>
                                    <TableCell>{record.punctuality}/10</TableCell>
                                    <TableCell>{record.attitude}/10</TableCell>
                                    <TableCell>{record.responsiveness}/10</TableCell>
                                    <TableCell className="max-w-sm">{record.hr_remarks}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
