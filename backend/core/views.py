from django.http import HttpResponse
from django.shortcuts import render

from .forms import UploadForm
from .schema import schema

# Create your views here.


def image_upload_view(request):
    if request.method == "POST":
        form = UploadForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()
    else:
        form = UploadForm()
    return render(request, "upload.html", {"form": form})


def activate(request, token):
    print(token)
    mutation = (
        """
        mutation {
            verifyAccount(token: "%s") {
                success
                errors
                }
            }
        """
        % token
    )
    result = schema.execute(mutation)
    print(result)
    return HttpResponse(result)
