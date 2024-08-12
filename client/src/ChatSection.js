import React from 'react';
import { Typography } from '@mui/material';
import ChatComponent from './ChatComponent';

function ChatSection({ selectedChatRoomId, selectedChatUser }) {
    return (
        selectedChatRoomId && selectedChatUser && (
            <section>
                <Typography variant="h5">Chat with {selectedChatUser.username}</Typography>
                <ChatComponent chatRoomId={selectedChatRoomId} />
            </section>
        )
    );
}

export default ChatSection;
