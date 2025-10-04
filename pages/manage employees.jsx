
import React, { useState, useEffect } from 'react';
import { User } from '@/entities/User';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import EmployeeForm from '../components/forms/EmployeeForm';
import { toast } from '@/components/ui/use-toast';
import { Toaster } from '@/components/ui/toaster';

export default function ManageEmployees({ user }) {
    const [employees, setEmployees] = useState([]);
    const [isFormOpen, setFormOpen] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);

    useEffect(() => {
        loadEmployees();
    }, []);

    const loadEmployees = async () => {
        const allUsers = await User.list();
        setEmployees(allUsers);
    };

    const handleEdit = (employee) => {
        setSelectedEmployee(employee);
        setFormOpen(true);
    };

    const handleDelete = async (employeeId) => {
        if (window.confirm('Are you sure you want to remove this user from the app? This will not delete their account but will revoke their access.')) {
            // In a real scenario, you might have an API endpoint to remove a user from an app.
            // For now, we simulate this. User deletion is a protected action.
            console.log("Request to remove user:", employeeId);
            toast({
                title: "Action Not Available",
                description: "User removal from the app is a protected action, typically handled in the main platform's user management settings.",
                variant: "destructive"
            });
        }
    };

    const handleFormClose = () => {
        setFormOpen(false);
        setSelectedEmployee(null);
        loadEmployees();
    };
    
    if (user?.role !== 'admin') {
      return <div className="text-center p-8"><p>Access Denied. This page is for HR Admins only.</p></div>
    }

    return (
        <div>
            <Toaster />
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Manage Employees</h1>
                <Button onClick={() => { setSelectedEmployee(null); setFormOpen(true); }}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Employee
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Employee List</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Employee ID</TableHead>
                                <TableHead>Job Title</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {employees.map(employee => (
                                <TableRow key={employee.id}>
                                    <TableCell className="font-medium flex items-center gap-2">
                                        <img src={employee.profile_picture_url || `https://ui-avatars.com/api/?name=${employee.full_name}`} alt={employee.full_name} className="w-8 h-8 rounded-full" />
                                        {employee.full_name}
                                    </TableCell>
                                    <TableCell>{employee.employee_id}</TableCell>
                                    <TableCell>{employee.job_title}</TableCell>
                                    <TableCell>{employee.email}</TableCell>
                                    <TableCell>{employee.role}</TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            <Button variant="outline" size="icon" onClick={() => handleEdit(employee)}>
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button variant="destructive" size="icon" onClick={() => handleDelete(employee.id)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <EmployeeForm
                isOpen={isFormOpen}
                onClose={handleFormClose}
                employee={selectedEmployee}
            />
        </div>
    );
}
