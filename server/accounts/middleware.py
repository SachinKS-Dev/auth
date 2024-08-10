# accounts/middleware.py or api/middleware.py
from django.contrib.auth.models import AnonymousUser
from django.utils.deprecation import MiddlewareMixin


class EnsureAuthenticatedMiddleware(MiddlewareMixin):
    def process_request(self, request):
        print(f"User is authenticated: {request.user}")
        if not request.user.is_authenticated:
            request.user = AnonymousUser()
