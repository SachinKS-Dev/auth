from django.urls import path
from .views import CreateInterestView, SendMessageView, ReceivedInterestListView, ConfirmInterestView, MessageListView

urlpatterns = [
    path('interests/', CreateInterestView.as_view(), name='create_interest'),
    path('interests/received/', ReceivedInterestListView.as_view(), name='received_interest_list'),
    path('interests/<int:interest_id>/handle/', ConfirmInterestView.as_view(), name='confirm-interest'),
    path('messages/send/', SendMessageView.as_view(), name='send_message'),  # POST for sending messages
    path('messages/', MessageListView.as_view(), name='message_list'),  # GET for retrieving messages
]
