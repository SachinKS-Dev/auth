from django.contrib.auth.models import User, AnonymousUser
from django.db.models import Q
from rest_framework import status, generics
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Interest, Message, ChatRoom
from .serializers import InterestSerializer, MessageSerializer, ChatRoomSerializer
from rest_framework.permissions import AllowAny, IsAuthenticated


class CreateInterestView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        # Extract data from request
        from_user = self.request.user
        to_user_id = request.data.get('to_user')

        # Check if users are valid
        try:
            to_user = User.objects.get(id=to_user_id)
        except User.DoesNotExist:
            return Response({"error": "Invalid user(s) provided."}, status=status.HTTP_400_BAD_REQUEST)

        # Create the interest
        interest = Interest.objects.create(from_user=from_user, to_user=to_user)
        serializer = InterestSerializer(interest)

        # Send confirmation (for simplicity, just returning the created instance)
        return Response({"message": "Interest created successfully.", "interest": serializer.data},
                        status=status.HTTP_201_CREATED)


class ConfirmInterestView(APIView):
    def post(self, request, interest_id):
        # Extract the desired status from the request
        status_to_set = request.data.get('status')

        if status_to_set not in [Interest.STATUS_ACCEPTED, Interest.STATUS_REJECTED]:
            return Response({"error": "Invalid status provided."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Fetch the Interest object
            interest = Interest.objects.get(id=interest_id)
        except Interest.DoesNotExist:
            return Response({"error": "Interest not found."}, status=status.HTTP_404_NOT_FOUND)

        # Update the status
        interest.status = status_to_set
        interest.save()

        # Serialize and return the updated Interest
        serializer = InterestSerializer(interest)
        return Response({"message": "Interest status updated successfully.", "interest": serializer.data},
                        status=status.HTTP_200_OK)


class ReceivedInterestListView(generics.ListAPIView):
    serializer_class = InterestSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        user = self.request.user
        if isinstance(user, AnonymousUser):
            return Interest.objects.none()  # Or handle as per your requirement
        return Interest.objects.filter(to_user=user)


class SendMessageView(APIView):
    def post(self, request):
        # Automatically set the sender to the currently authenticated user
        sender = request.user

        # Combine the request data with the sender data
        data = request.data.copy()
        data['sender'] = sender.id

        serializer = MessageSerializer(data=data)
        if serializer.is_valid():
            message = serializer.save()
            return Response(MessageSerializer(message).data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class MessageListView(generics.ListAPIView):
    serializer_class = MessageSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        recipient_id = self.request.query_params.get('recipient')
        sender_id = self.request.user.id

        if recipient_id:
            return Message.objects.filter(
                Q(sender_id=sender_id, recipient_id=recipient_id) |
                Q(sender_id=recipient_id, recipient_id=sender_id)
            ).order_by('timestamp')
        return Message.objects.all()


class ChatRoomCreateOrGetView(generics.GenericAPIView):
    serializer_class = ChatRoomSerializer

    def post(self, request, *args, **kwargs):
        participant_id = request.data.get('participant_id')
        if not participant_id:
            return Response({'error': 'participant_id is required.'}, status=status.HTTP_400_BAD_REQUEST)

        participant = User.objects.get(id=participant_id)
        user = request.user

        # Check if a chat room already exists with the current user and the participant
        chat_room = ChatRoom.objects.filter(participants=user).filter(participants=participant).first()
        if not chat_room:
            # Create a new chat room if it does not exist
            chat_room = ChatRoom.objects.create(name=f'Chat Room with {participant.username}')
            chat_room.participants.add(user, participant)

        return Response({'chat_room_id': chat_room.id}, status=status.HTTP_200_OK)


class ChatRoomCreateView(generics.CreateAPIView):
    queryset = ChatRoom.objects.all()
    serializer_class = ChatRoomSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            # Save the chat room
            chat_room = serializer.save()

            # Add participants to the chat room
            participants = request.data.get('participants', [])
            chat_room.participants.set(participants)

            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        else:
            # Print errors for debugging
            print("Serializer errors:", serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ChatRoomListView(generics.ListAPIView):
    queryset = ChatRoom.objects.all()
    serializer_class = ChatRoomSerializer
