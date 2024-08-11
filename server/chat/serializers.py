from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Interest, Message, ChatRoom
from accounts.serializers import UserSerializer


class InterestSerializer(serializers.ModelSerializer):
    from_user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    to_user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    status = serializers.ChoiceField(choices=Interest.STATUS_CHOICES, required=False)

    class Meta:
        model = Interest
        fields = ['id', 'from_user', 'to_user', 'status']


class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ['id', 'sender', 'recipient', 'content', 'timestamp']


class InterestSerializer(serializers.ModelSerializer):
    from_user = UserSerializer()
    to_user = UserSerializer()

    class Meta:
        model = Interest
        fields = ['id', 'from_user', 'to_user', 'status']


class ChatRoomSerializer(serializers.ModelSerializer):
    participants = serializers.ListField(child=serializers.IntegerField())

    class Meta:
        model = ChatRoom
        fields = ['id', 'name', 'participants']


class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = '__all__'
