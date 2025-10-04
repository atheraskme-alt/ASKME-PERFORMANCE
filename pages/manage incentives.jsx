import React, { useState, useEffect } from 'react';
import { User, Incentive } from '@/entities/all';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

export default function ManageIncentives({ user }) {
    const [employees, setEmployees] = useState([]);
    const [incentives, setIncentives] = useState([]);
    const [selectedEmployeeEmail, setSelectedEmployeeEmail] = useState('');
    const [formData, setFormData] = useState({
        type: 'performance_incentive',
        amount: '',
        description: '',
        date_awarded: new Date().toISOString().split('T')[0],
    });

    useEffect(() => {
        const fetchData = async () => {
            const users = await User.filter({ role: 'user' });
            const records = await Incentive.list('-date_awarded', 50);
            setEmployees(users);
            setIncentives(records);
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
        
        await Incentive.create({
            ...formData,
            employee_email: selectedEmployeeEmail,
            amount: parseFloat(formData.amount),
            approved_by: user.email
        });
        
        const records = await Incentive.list('-date_awarded', 50);
        setIncentives(records);
        setFormData({
            type: 'performance_incentive',
            amount: '',
            description: '',
            date_awarded: new Date().toISOString().split('T')[0],
        });
        setSelectedEmployeeEmail('');
    };

    const getTypeBadge = (type) => {
        const colors = {
            bonus: 'bg-green-100 text-green-800',
            performance_incentive: 'bg-blue-100 text-blue-800',
            project_completion: 'bg-purple-100 text-purple-800',
            monthly_reward: 'bg-yellow-100 text-yellow-800',
            annual_bonus: 'bg-red-100 text-red-800',
            other: 'bg-gray-100 text-gray-800'
        };
        return <Badge className={colors[type]}>{type.replace('_', ' ')}</Badge>;
    };

    if (user?.role !== 'admin') {
        return <div className="text-center p-8"><p>Access Denied. This page is for HR Admins only.</p></div>;
    }

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-gray-800">Incentives & Bonus Management</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Award Incentive/Bonus</CardTitle>
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
                                    <Label>Type</Label>
                                    <Select name="type" value={formData.type} onValueChange={(val) => setFormData(prev => ({...prev, type: val}))}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="bonus">Bonus</SelectItem>
                                            <SelectItem value="performance_incentive">Performance Incentive</SelectItem>
                                            <SelectItem value="project_completion">Project Completion</SelectItem>
                                            <SelectItem value="monthly_reward">Monthly Reward</SelectItem>
                                            <SelectItem value="annual_bonus">Annual Bonus</SelectItem>
                                            <SelectItem value="other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label htmlFor="amount">Amount ($)</Label>
                                    <Input id="amount" name="amount" type="number" step="0.01" value={formData.amount} onChange={handleChange} required />
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="date_awarded">Date Awarded</Label>
                                <Input id="date_awarded" name="date_awarded" type="date" value={formData.date_awarded} onChange={handleChange} />
                            </div>

                            <div>
                                <Label htmlFor="description">Description/Reason</Label>
                                <Textarea id="description" name="description" value={formData.description} onChange={handleChange} required placeholder="Reason for awarding this incentive..." />
                            </div>

                            <Button type="submit" className="w-full">Award Incentive</Button>
                        </form>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Recent Incentives Awarded</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="max-h-96 overflow-y-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Employee</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Amount</TableHead>
                                        <TableHead>Date</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {incentives.map(incentive => {
                                        const employee = employees.find(e => e.email === incentive.employee_email);
                                        return (
                                            <TableRow key={incentive.id}>
                                                <TableCell>{employee?.full_name || incentive.employee_email}</TableCell>
                                                <TableCell>{getTypeBadge(incentive.type)}</TableCell>
                                                <TableCell>${incentive.amount}</TableCell>
                                                <TableCell>{format(new Date(incentive.date_awarded), 'MMM d')}</TableCell>
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
