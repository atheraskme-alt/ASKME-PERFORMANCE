import React, { useState, useEffect } from 'react';
import { Attendance } from '@/entities/all';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const COLORS = ['#10B981', '#EF4444', '#F59E0B', '#3B82F6'];

export default function MyAttendance({ user }) {
    const [records, setRecords] = useState([]);
    const [monthlyStats, setMonthlyStats] = useState({ present: 0, absent: 0, late: 0, half_day: 0 });

    useEffect(() => {
        const fetchRecords = async () => {
            if (user) {
                const data = await Attendance.filter({ employee_email: user.email }, '-date');
                setRecords(data);
                
                const currentMonth = new Date();
                const monthStart = startOfMonth(currentMonth);
                const monthEnd = endOfMonth(currentMonth);
                
                const monthRecords = data.filter(r => {
                    const recordDate = new Date(r.date);
                    return recordDate >= monthStart && recordDate <= monthEnd;
                });
                
                const stats = monthRecords.reduce((acc, record) => {
                    acc[record.status]++;
                    return acc;
                }, { present: 0, absent: 0, late: 0, half_day: 0 });
                
                setMonthlyStats(stats);
            }
        };
        fetchRecords();
    }, [user]);

    const getStatusBadge = (status) => {
        const colors = {
            present: 'bg-green-100 text-green-800',
            absent: 'bg-red-100 text-red-800',
            late: 'bg-yellow-100 text-yellow-800',
            half_day: 'bg-blue-100 text-blue-800'
        };
        return <Badge className={colors[status]}>{status.replace('_', ' ')}</Badge>;
    };

    const chartData = [
        { name: 'Present', value: monthlyStats.present, color: '#10B981' },
        { name: 'Absent', value: monthlyStats.absent, color: '#EF4444' },
        { name: 'Late', value: monthlyStats.late, color: '#F59E0B' },
        { name: 'Half Day', value: monthlyStats.half_day, color: '#3B82F6' },
    ];

    if (!user) return null;

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-gray-800">My Attendance</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card>
                    <CardHeader>
                        <CardTitle>This Month's Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-green-600">{monthlyStats.present}</div>
                                <div className="text-sm text-gray-500">Present Days</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-red-600">{monthlyStats.absent}</div>
                                <div className="text-sm text-gray-500">Absent Days</div>
                            </div>
                        </div>
                        <div className="h-48">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie 
                                        data={chartData} 
                                        dataKey="value" 
                                        nameKey="name" 
                                        cx="50%" 
                                        cy="50%" 
                                        outerRadius={60} 
                                    >
                                        {chartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Recent Attendance</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="max-h-80 overflow-y-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Hours</TableHead>
                                        <TableHead>Times</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {records.slice(0, 10).map(record => (
                                        <TableRow key={record.id}>
                                            <TableCell>{format(new Date(record.date), 'MMM d, yyyy')}</TableCell>
                                            <TableCell>{getStatusBadge(record.status)}</TableCell>
                                            <TableCell>{record.hours_worked}h</TableCell>
                                            <TableCell className="text-sm">
                                                {record.check_in_time} - {record.check_out_time}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
