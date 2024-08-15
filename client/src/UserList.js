import React from 'react';
import {Button, Card, CardContent, Typography} from '@mui/material';

function UserList({users, handleSendInterest, handleChat, isChatAvailable}) {
    return (
        <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
        }}>
            {users.map((user) => {
                const chatStatus = isChatAvailable(user.id);

                return (
                    <Card key={user.id} sx={{margin: 1, width: 200}}>
                        <CardContent>
                            <Typography variant="h6" align="center">{user.username}</Typography>
                            {chatStatus === 'noRequest' && (
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => handleSendInterest(user.id)}
                                    fullWidth
                                >
                                    Send Request
                                </Button>
                            )}
                            {chatStatus === 'chatAvailable' && (
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    onClick={() => handleChat(user.id)}
                                    fullWidth
                                >
                                    Chat
                                </Button>
                            )}
                            {chatStatus === 'pending' && (
                                <Typography variant="body2" align="center" color="textSecondary">
                                    Request Pending
                                </Typography>
                            )}
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}

export default UserList;
