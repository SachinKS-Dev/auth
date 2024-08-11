from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer
import json
from .models import Message, ChatRoom
from django.contrib.auth.models import User


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['recipient_id']
        self.room_group_name = f'chat_{self.room_name}'

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        data = json.loads(text_data)
        message_content = data['message']
        chat_room_id = self.room_name

        sender = self.scope["user"]
        chat_room = await self.get_chat_room_by_id(chat_room_id)

        # Save message to the database asynchronously
        saved_message = await self.save_message(chat_room, sender, message_content)

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

        await self.send(text_data=json.dumps({
            'message': message,
            'sender': sender,
            'timestamp': timestamp,
        }))

    @database_sync_to_async
    def get_chat_room_by_id(self, chat_room_id):
        return ChatRoom.objects.get(id=chat_room_id)

    @database_sync_to_async
    def save_message(self, chat_room, sender, content):
        return Message.objects.create(chat_room=chat_room, sender=sender, content=content)
