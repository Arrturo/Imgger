from django.shortcuts import render
from .forms import UploadForm
from django.http import HttpResponse
from .schema import schema

# Create your views here.


def activate(request, token):
    print(token)
    mutation = '''
        mutation {
            verifyAccount(token: "%s") {
                success
                errors
                }
            }
        ''' % token
    result = schema.execute(mutation)
    print(result)
    return HttpResponse(result)
