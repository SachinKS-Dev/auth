from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
import json
from .models import Message, ChatRoom
from django.contrib.auth.models import User

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['chat_room_id']
        self.room_group_name = f'chat_{self.room_name}'

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

        # Fetch and send the last 50 messages from the chat room to the user
        past_messages = await self.get_past_messages(self.room_name)
        for message in past_messages:
            await self.send(text_data=json.dumps({
                'message': message['content'],
                'sender': message['sender'],
                'timestamp': message['timestamp'],
            }))

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        data = json.loads(text_data)
        message_content = data['message']
        username = data['username']
        chat_room_id = self.room_name

        sender = await self.get_user(username)
        chat_room = await self.get_chat_room_by_id(chat_room_id)

        # Save message to the database asynchronously
        saved_message = await self.save_message(chat_room, sender, message_content)

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': saved_message['content'],
                'sender': saved_message['sender'],
                'timestamp': saved_message['timestamp'],
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
    def get_user(self, username):
        return User.objects.get(username=username)

    @database_sync_to_async
    def get_chat_room_by_id(self, chat_room_id):
        return ChatRoom.objects.get(id=chat_room_id)

    @database_sync_to_async
    def save_message(self, chat_room, sender, content):
        message = Message.objects.create(chat_room=chat_room, sender=sender, content=content)
        return {
            'content': message.content,
            'sender': message.sender.username,
            'timestamp': message.timestamp.isoformat(),
        }

    @database_sync_to_async
    def get_past_messages(self, chat_room_id):
        chat_room = ChatRoom.objects.get(id=chat_room_id)
        messages = Message.objects.filter(chat_room=chat_room).order_by('-timestamp')[:50]
        return [{'content': msg.content, 'sender': msg.sender.username, 'timestamp': msg.timestamp.isoformat()} for msg in messages][::-1]
