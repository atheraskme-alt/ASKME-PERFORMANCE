import React, { useState, useEffect } from 'react';
import { Update } from '@/entities/all';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { format } from 'date-fns';
import { CheckCircle } from 'lucide-react';

export default function Updates({ user }) {
    const [updates, setUpdates] = useState([]);

    useEffect(() => {
        loadUpdates();
    }, []);

    const loadUpdates = async () => {
        const data = await Update.list('-created_date');
        setUpdates(data);
    };

    const handleAcknowledge = async (update) => {
        if (!update.acknowledged_by?.includes(user.email)) {
            const newAcknowledgements = [...(update.acknowledged_by || []), user.email];
            await Update.update(update.id, { acknowledged_by: newAcknowledgements });
            loadUpdates();
        }
    };
    
    if (!user) return null;

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Company Updates</h1>
            <div className="space-y-6">
                {updates.map(update => {
                    const isAcknowledged = update.acknowledged_by?.includes(user.email);
                    return (
                        <Card key={update.id}>
                            <CardHeader>
                                <CardTitle>{update.title}</CardTitle>
                                <p className="text-sm text-gray-500">{format(new Date(update.created_date), 'MMMM d, yyyy')}</p>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-700 whitespace-pre-wrap">{update.content}</p>
                            </CardContent>
                            <CardFooter>
                                {isAcknowledged ? (
                                    <div className="flex items-center gap-2 text-green-600">
                                        <CheckCircle className="w-5 h-5" />
                                        <span>Acknowledged</span>
                                    </div>
                                ) : (
                                    <Button onClick={() => handleAcknowledge(update)}>Acknowledge</Button>
                                )}
                            </CardFooter>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
