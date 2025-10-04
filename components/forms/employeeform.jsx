
import React, { useState, useEffect } from 'react';
import { User } from '@/entities/User';
import { UploadFile } from '@/integrations/Core';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Upload, X } from 'lucide-react';
import { toast, useToast } from '@/components/ui/use-toast';
import { Toaster } from '@/components/ui/toaster';

export default function EmployeeForm({ isOpen, onClose, employee }) {
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        employee_id: '',
        phone_number: '',
        job_title: '',
        department: '',
        role: 'user',
        hire_date: '',
        salary: '',
        address: '',
        profile_picture_url: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [uploadingPhoto, setUploadingPhoto] = useState(false);
    const isEditing = !!employee;

    useEffect(() => {
        if (employee) {
            setFormData({
                full_name: employee.full_name || '',
                email: employee.email || '',
                employee_id: employee.employee_id || '',
                phone_number: employee.phone_number || '',
                job_title: employee.job_title || '',
                department: employee.department || '',
                role: employee.role || 'user',
                hire_date: employee.hire_date || '',
                salary: employee.salary || '',
                address: employee.address || '',
                profile_picture_url: employee.profile_picture_url || ''
            });
        } else {
            setFormData({
                full_name: '',
                email: '',
                employee_id: '',
                phone_number: '',
                job_title: '',
                department: '',
                role: 'user',
                hire_date: '',
                salary: '',
                address: '',
                profile_picture_url: ''
            });
        }
    }, [employee, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePhotoUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadingPhoto(true);
        try {
            const { file_url } = await UploadFile({ file });
            setFormData(prev => ({ ...prev, profile_picture_url: file_url }));
        } catch (error) {
            alert('Failed to upload photo');
        } finally {
            setUploadingPhoto(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!isEditing && !formData.email.endsWith('@askmesolutions.in')) {
            if (!window.confirm("Warning: The email does not use the company domain '@askmesolutions.in'. Do you want to proceed anyway?")) {
                return;
            }
        }
        
        setIsLoading(true);
        try {
            if (isEditing) {
                await User.update(employee.id, formData);
            } else {
                const users = await User.filter({email: formData.email});
                if(users.length > 0) {
                   await User.update(users[0].id, formData);
                } else {
                   alert("User with this email does not exist. Please invite them first from the Data tab.");
                }
            }
            onClose();
        } catch (error) {
            console.error("Failed to save employee:", error);
            alert("Failed to save employee data.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <Toaster />
                <DialogHeader>
                    <DialogTitle>{isEditing ? 'Edit Employee' : 'Add Employee'}</DialogTitle>
                    {!isEditing && <DialogDescription>To add a new employee, please ensure they have first accepted an invitation to the app.</DialogDescription>}
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                        <div className="relative">
                            <img 
                                src={formData.profile_picture_url || `https://ui-avatars.com/api/?name=${formData.full_name}&background=2563eb&color=fff`} 
                                alt="Profile" 
                                className="w-20 h-20 rounded-full object-cover"
                            />
                            {formData.profile_picture_url && (
                                <button
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, profile_picture_url: '' }))}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            )}
                        </div>
                        <div>
                            <Label htmlFor="photo">Profile Photo</Label>
                            <div className="flex items-center gap-2">
                                <Input 
                                    id="photo" 
                                    type="file" 
                                    accept="image/*" 
                                    onChange={handlePhotoUpload}
                                    disabled={uploadingPhoto}
                                    className="hidden"
                                />
                                <Button 
                                    type="button" 
                                    variant="outline" 
                                    onClick={() => document.getElementById('photo')?.click()}
                                    disabled={uploadingPhoto}
                                >
                                    <Upload className="w-4 h-4 mr-2" />
                                    {uploadingPhoto ? 'Uploading...' : 'Upload Photo'}
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="full_name">Full Name</Label>
                            <Input id="full_name" name="full_name" value={formData.full_name} onChange={handleChange} required />
                        </div>
                        <div>
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required disabled={isEditing} />
                            {!isEditing && <p className="text-xs text-gray-500 mt-1">Please use the official @askmesolutions.in email.</p>}
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="employee_id">Employee ID</Label>
                            <Input id="employee_id" name="employee_id" value={formData.employee_id} onChange={handleChange} />
                        </div>
                        <div>
                            <Label htmlFor="phone_number">Phone Number</Label>
                            <Input id="phone_number" name="phone_number" value={formData.phone_number} onChange={handleChange} />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="job_title">Job Title</Label>
                            <Input id="job_title" name="job_title" value={formData.job_title} onChange={handleChange} />
                        </div>
                        <div>
                            <Label htmlFor="department">Department</Label>
                            <Input id="department" name="department" value={formData.department} onChange={handleChange} />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="hire_date">Hire Date</Label>
                            <Input id="hire_date" name="hire_date" type="date" value={formData.hire_date} onChange={handleChange} />
                        </div>
                        <div>
                            <Label htmlFor="salary">Monthly Salary ($)</Label>
                            <Input id="salary" name="salary" type="number" value={formData.salary} onChange={handleChange} />
                        </div>
                    </div>
                    <div>
                        <Label htmlFor="address">Address</Label>
                        <Input id="address" name="address" value={formData.address} onChange={handleChange} />
                    </div>
                     <div>
                        <Label htmlFor="role">Role</Label>
                        <Select name="role" value={formData.role} onValueChange={(value) => handleSelectChange('role', value)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="user">Employee</SelectItem>
                                <SelectItem value="admin">Admin</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>Cancel</Button>
                        <Button type="submit" disabled={isLoading}>{isLoading ? 'Saving...' : 'Save Employee'}</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
