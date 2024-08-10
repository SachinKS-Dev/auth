from django.contrib import admin
from .models import Interest, Message


@admin.register(Interest)
class InterestAdmin(admin.ModelAdmin):
    list_display = ('from_user', 'to_user', 'status')
    search_fields = ('from_user__username', 'to_user__username', 'status')


@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ('sender', 'recipient', 'content', 'timestamp')
    list_filter = ('timestamp', 'sender', 'recipient')
    search_fields = ('sender__username', 'recipient__username', 'content')
    readonly_fields = ('timestamp',)
