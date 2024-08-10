from django.contrib.auth.models import User, AnonymousUser
from rest_framework import status, generics
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Interest, Message
from .serializers import InterestSerializer, MessageSerializer
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


class SendMessageView(APIView):
    def post(self, request):
        serializer = MessageSerializer(data=request.data)
        if serializer.is_valid():
            message = serializer.save()
            return Response(MessageSerializer(message).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ReceivedInterestListView(generics.ListAPIView):
    serializer_class = InterestSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        user = self.request.user
        print(user)  # This should print AnonymousUser if not authenticated
        if isinstance(user, AnonymousUser):
            return Interest.objects.none()  # Or handle as per your requirement
        return Interest.objects.filter(to_user=user)
