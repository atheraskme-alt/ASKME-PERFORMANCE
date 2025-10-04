import React, { useState, useEffect } from 'react';
import { User, PerformanceRecord } from '@/entities/all';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { toast } from '@/components/ui/use-toast';

export default function ManagePerformance({ user }) {
    const [employees, setEmployees] = useState([]);
    const [selectedEmployeeEmail, setSelectedEmployeeEmail] = useState('');
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0],
        punctuality: 5,
        attitude: 5,
        responsiveness: 5,
        hr_remarks: '',
    });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchEmployees = async () => {
            const users = await User.filter({ role: 'user' });
            setEmployees(users);
        };
        fetchEmployees();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSliderChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value[0] }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedEmployeeEmail) {
            alert('Please select an employee.');
            return;
        }
        setIsLoading(true);
        try {
            await PerformanceRecord.create({
                ...formData,
                employee_email: selectedEmployeeEmail
            });
            toast({ title: "Success", description: "Performance record saved successfully." });
            setFormData({
                date: new Date().toISOString().split('T')[0],
                punctuality: 5,
                attitude: 5,
                responsiveness: 5,
                hr_remarks: '',
            });
            setSelectedEmployeeEmail('');
        } catch (error) {
            console.error(error);
            toast({ title: "Error", description: "Failed to save record.", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    };
    
    if (user?.role !== 'admin') {
      return <div className="text-center p-8"><p>Access Denied. This page is for HR Admins only.</p></div>
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Log Performance Record</h1>
            <Card className="max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle>New Performance Entry</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <Label htmlFor="employee">Select Employee</Label>
                            <Select value={selectedEmployeeEmail} onValueChange={setSelectedEmployeeEmail}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select an employee..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {employees.map(emp => (
                                        <SelectItem key={emp.id} value={emp.email}>
                                            {emp.full_name} ({emp.email})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label htmlFor="date">Date</Label>
                            <Input id="date" name="date" type="date" value={formData.date} onChange={handleChange} required />
                        </div>
                        
                        <div className="space-y-4">
                            <Label>Punctuality: {formData.punctuality}/10</Label>
                            <Slider name="punctuality" defaultValue={[5]} max={10} step={1} onValueChange={(val) => handleSliderChange('punctuality', val)} />
                        </div>

                        <div className="space-y-4">
                            <Label>Attitude & Behavior: {formData.attitude}/10</Label>
                            <Slider name="attitude" defaultValue={[5]} max={10} step={1} onValueChange={(val) => handleSliderChange('attitude', val)} />
                        </div>

                        <div className="space-y-4">
                            <Label>Responsiveness: {formData.responsiveness}/10</Label>
                            <Slider name="responsiveness" defaultValue={[5]} max={10} step={1} onValueChange={(val) => handleSliderChange('responsiveness', val)} />
                        </div>

                        <div>
                            <Label htmlFor="hr_remarks">HR Remarks</Label>
                            <Textarea id="hr_remarks" name="hr_remarks" value={formData.hr_remarks} onChange={handleChange} placeholder="Add any specific comments..."/>
                        </div>

                        <Button type="submit" className="w-full" disabled={isLoading}>{isLoading ? 'Saving...' : 'Save Record'}</Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
