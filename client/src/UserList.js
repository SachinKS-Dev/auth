import React from 'react';
import { Button, Card, CardContent, Typography } from '@mui/material';

function UserList({ users, handleSendInterest, handleChat, isChatAvailable }) {
    return (
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {users.map((user) => {
                const chatAvailable = isChatAvailable(user.id);

                return (
                    <Card key={user.id} sx={{ margin: 1, width: 200 }}>
                        <CardContent>
                            <Typography variant="h6">{user.username}</Typography>
                            {!chatAvailable && (
                                <Button variant="contained" color="primary" onClick={() => handleSendInterest(user.id)}>
                                    Send Request
                                </Button>
                            )}
                            {chatAvailable && (
                                <Button variant="contained" color="secondary" onClick={() => handleChat(user.id)}>
                                    Chat
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}

export default UserList;
