import React, { useState, useEffect } from 'react';
import { User, Attendance } from '@/entities/all';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

export default function ManageAttendance({ user }) {
    const [employees, setEmployees] = useState([]);
    const [attendanceRecords, setAttendanceRecords] = useState([]);
    const [selectedEmployeeEmail, setSelectedEmployeeEmail] = useState('');
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0],
        status: 'present',
        check_in_time: '09:00',
        check_out_time: '17:00',
        hours_worked: 8,
        notes: '',
    });

    useEffect(() => {
        const fetchData = async () => {
            const users = await User.filter({ role: 'user' });
            const records = await Attendance.list('-date', 50);
            setEmployees(users);
            setAttendanceRecords(records);
        };
        fetchData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedEmployeeEmail) {
            alert('Please select an employee.');
            return;
        }
        
        await Attendance.create({
            ...formData,
            employee_email: selectedEmployeeEmail,
            hours_worked: parseFloat(formData.hours_worked)
        });
        
        const records = await Attendance.list('-date', 50);
        setAttendanceRecords(records);
        setFormData({
            date: new Date().toISOString().split('T')[0],
            status: 'present',
            check_in_time: '09:00',
            check_out_time: '17:00',
            hours_worked: 8,
            notes: '',
        });
        setSelectedEmployeeEmail('');
    };

    const getStatusBadge = (status) => {
        const colors = {
            present: 'bg-green-100 text-green-800',
            absent: 'bg-red-100 text-red-800',
            late: 'bg-yellow-100 text-yellow-800',
            half_day: 'bg-blue-100 text-blue-800'
        };
        return <Badge className={colors[status]}>{status.replace('_', ' ')}</Badge>;
    };

    if (user?.role !== 'admin') {
        return <div className="text-center p-8"><p>Access Denied. This page is for HR Admins only.</p></div>;
    }

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-gray-800">Daily Attendance Management</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Mark Attendance</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <Label>Employee</Label>
                                <Select value={selectedEmployeeEmail} onValueChange={setSelectedEmployeeEmail}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select employee..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {employees.map(emp => (
                                            <SelectItem key={emp.id} value={emp.email}>
                                                {emp.full_name} ({emp.employee_id})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="date">Date</Label>
                                    <Input id="date" name="date" type="date" value={formData.date} onChange={handleChange} />
                                </div>
                                <div>
                                    <Label>Status</Label>
                                    <Select name="status" value={formData.status} onValueChange={(val) => setFormData(prev => ({...prev, status: val}))}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="present">Present</SelectItem>
                                            <SelectItem value="absent">Absent</SelectItem>
                                            <SelectItem value="late">Late</SelectItem>
                                            <SelectItem value="half_day">Half Day</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <Label htmlFor="check_in_time">Check In</Label>
                                    <Input id="check_in_time" name="check_in_time" type="time" value={formData.check_in_time} onChange={handleChange} />
                                </div>
                                <div>
                                    <Label htmlFor="check_out_time">Check Out</Label>
                                    <Input id="check_out_time" name="check_out_time" type="time" value={formData.check_out_time} onChange={handleChange} />
                                </div>
                                <div>
                                    <Label htmlFor="hours_worked">Hours</Label>
                                    <Input id="hours_worked" name="hours_worked" type="number" step="0.5" value={formData.hours_worked} onChange={handleChange} />
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="notes">Notes</Label>
                                <Input id="notes" name="notes" value={formData.notes} onChange={handleChange} placeholder="Optional notes..." />
                            </div>

                            <Button type="submit" className="w-full">Mark Attendance</Button>
                        </form>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Recent Attendance Records</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="max-h-96 overflow-y-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Employee</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Hours</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {attendanceRecords.map(record => {
                                        const employee = employees.find(e => e.email === record.employee_email);
                                        return (
                                            <TableRow key={record.id}>
                                                <TableCell>{employee?.full_name || record.employee_email}</TableCell>
                                                <TableCell>{format(new Date(record.date), 'MMM d')}</TableCell>
                                                <TableCell>{getStatusBadge(record.status)}</TableCell>
                                                <TableCell>{record.hours_worked}h</TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
