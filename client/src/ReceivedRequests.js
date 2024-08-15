import React from 'react';
import {Button, Card, CardContent, Typography} from '@mui/material';

function ReceivedRequests({receivedRequests, handleConfirmInterest}) {
    return (<div>
        {receivedRequests.map((request) => (
            <CardContent sx={{borderBottom: '1px solid #ccc', borderRadius: '4px', padding: '16px', marginBottom: '8px'}}>
                {/*<Typography>Status: {request.status === 1 ? "Pending" : request.status === 2 ? "Accepted" : "Rejected"}</Typography>*/}

                {request.status === 1 ? (<div>
                    <Typography>{request.from_user.username} has sent you an interest request.</Typography>
                    <Button
                        variant="contained"
                        color="success"
                        onClick={() => handleConfirmInterest(request.id, 2)}
                        sx={{marginRight: 1}}
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
                </div>) : (
                    <Typography>
                        {request.status === 2 ? "You have accepted request" : "You have rejected request."} from {request.from_user.username}
                    </Typography>)}
            </CardContent>

        ))}
    </div>);
}

export default ReceivedRequests;
