import React from 'react';
import { Button, Card, CardContent, Typography } from '@mui/material';

function ReceivedRequests({ receivedRequests, handleConfirmInterest }) {
    return (
        <div>
            {receivedRequests.map((request) => (
                <Card key={request.id} sx={{ margin: 1 }}>
                    <CardContent>
                        <Typography>{request.from_user.username} has sent you an interest request.</Typography>
                        <Typography>Status: {request.status}</Typography>
                        {request.status === 1 && (
                            <div>
                                <Button
                                    variant="contained"
                                    color="success"
                                    onClick={() => handleConfirmInterest(request.id, 2)}
                                    sx={{ marginRight: 1 }}
                                >
                                    Accept
                                </Button>
                                <Button
                                    variant="contained"
                                    color="error"
                                    onClick={() => handleConfirmInterest(request.id, 3)}
                                >
                                    Reject
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}

export default ReceivedRequests;
