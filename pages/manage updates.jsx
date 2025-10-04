import React, { useState, useEffect } from 'react';
import { Update, User } from '@/entities/all';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';

export default function ManageUpdates({ user }) {
    const [updates, setUpdates] = useState([]);
    const [newUpdate, setNewUpdate] = useState({ title: '', content: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [allEmployees, setAllEmployees] = useState([]);

    useEffect(() => {
        loadUpdates();
        const fetchUsers = async () => {
          const users = await User.filter({role: 'user'});
          setAllEmployees(users);
        }
        fetchUsers();
    }, []);

    const loadUpdates = async () => {
        const data = await Update.list('-created_date');
        setUpdates(data);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewUpdate(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await Update.create(newUpdate);
            toast({ title: "Success", description: "Update posted successfully." });
            setNewUpdate({ title: '', content: '' });
            loadUpdates();
        } catch (error) {
            toast({ title: "Error", description: "Failed to post update.", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    };
    
    if (user?.role !== 'admin') {
      return <div className="text-center p-8"><p>Access Denied. This page is for HR Admins only.</p></div>
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-8">Post a New Update</h1>
                <Card>
                    <form onSubmit={handleSubmit}>
                        <CardHeader>
                            <CardTitle>New Announcement</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="title">Title</Label>
                                <Input id="title" name="title" value={newUpdate.title} onChange={handleChange} required />
                            </div>
                            <div>
                                <Label htmlFor="content">Content</Label>
                                <Textarea id="content" name="content" value={newUpdate.content} onChange={handleChange} required rows={6}/>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button type="submit" disabled={isLoading}>{isLoading ? 'Posting...' : 'Post Update'}</Button>
                        </CardFooter>
                    </form>
                </Card>
            </div>
            <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-8">Published Updates</h2>
                <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                    {updates.map(update => (
                        <Card key={update.id}>
                            <CardHeader>
                                <CardTitle>{update.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600">{update.content}</p>
                            </CardContent>
                            <CardFooter>
                                <p className="text-sm text-gray-500">Acknowledged by {update.acknowledged_by?.length || 0} of {allEmployees.length} employees.</p>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
