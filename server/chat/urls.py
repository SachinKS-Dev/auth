from django.urls import path
from .views import CreateInterestView, SendMessageView, ReceivedInterestListView, ConfirmInterestView, ChatHistoryView

urlpatterns = [
    path('interests/', CreateInterestView.as_view(), name='create_interest'),
    path('interests/received/', ReceivedInterestListView.as_view(), name='received_interest_list'),
    path('interests/<int:interest_id>/handle/', ConfirmInterestView.as_view(), name='confirm-interest'),
    path('messages/', SendMessageView.as_view(), name='send_message'),
    path('chat-history/<int:recipient_id>/', ChatHistoryView.as_view(), name='chat_history'),
]
