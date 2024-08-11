from django.contrib import admin
from .models import Interest, Message, ChatRoom


@admin.register(Interest)
class InterestAdmin(admin.ModelAdmin):
    list_display = ('from_user', 'to_user', 'status')
    search_fields = ('from_user__username', 'to_user__username', 'status')


@admin.register(ChatRoom)
class ChatRoomAdmin(admin.ModelAdmin):
    list_display = ('name', )
    list_filter = ('name',)


@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ('sender', 'content', 'timestamp')
    list_filter = ('timestamp', 'sender')