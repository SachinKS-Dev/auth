# chat/consumers.py
from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer
import json
from django.contrib.auth.models import User
from .models import Message, ChatRoom

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.chat_room_id = self.scope['url_route']['kwargs']['chat_room_id']
        self.room_group_name = f'chat_{self.chat_room_id}'

        # Join the chat room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        # Leave the chat room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        data = json.loads(text_data)
        message_content = data.get('message')
        sender_username = data.get('sender')

        # Retrieve the sender from the username
        try:
            sender = await User.objects.get(username=sender_username)
        except User.DoesNotExist:
            # Handle the case where the sender does not exist
            return

        chat_room_id = self.chat_room_id
        chat_room = await self.get_chat_room_by_id(chat_room_id)

        # Save message to the database asynchronously
        saved_message = await self.save_message(chat_room, sender, message_content)

        # Broadcast message to chat room group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': saved_message.content,
                'sender': saved_message.sender.username,
                'timestamp': saved_message.timestamp.isoformat(),
            }
        )

    async def chat_message(self, event):
        message = event['message']
        sender = event['sender']
        timestamp = event['timestamp']

        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'message': message,
            'sender': sender,
            'timestamp': timestamp,
        }))

    # Example implementation of get_chat_room_by_id and save_message methods
    @database_sync_to_async
    def get_chat_room_by_id(self, chat_room_id):
        return ChatRoom.objects.get(id=chat_room_id)

    @database_sync_to_async
    def save_message(self, chat_room, sender, content):
        return Message.objects.create(chat_room=chat_room, sender=sender, content=content)
