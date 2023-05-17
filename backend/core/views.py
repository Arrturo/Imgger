from django.contrib.auth import logout
from django.http import HttpResponse, JsonResponse
from django.shortcuts import render
from graphql_jwt.shortcuts import get_refresh_token

from .schema import schema

# Create your views here.



def logout_view(request):
    response = JsonResponse({"success": True, "errors": None}, status=200)

    # Pobranie refresh tokenu z ciastka
    refresh_token = request.COOKIES.get("JWT-refresh-token")
    token = request.COOKIES.get("JWT")
    if refresh_token is None or token is None:
        response = JsonResponse(
            {"success": False, "errors": "Authorization error"}, status=400
        )
        return response
    refresh_token_instance = get_refresh_token(refresh_token)
    refresh_token_instance.delete()
    # Usunięcie ciastka z przeglądarki
    response.delete_cookie("JWT-refresh-token")
    response.delete_cookie("JWT")
    return response
