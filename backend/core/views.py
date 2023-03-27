from django.shortcuts import render
from .forms import UploadForm
from django.http import HttpResponse
from .models import User
# Create your views here.


def image_upload_view(request):
    if request.method == 'POST':
        form = UploadForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()
    else:
        form = UploadForm()
    return render(request, 'upload.html', {'form': form})


def verify_user(request):
    if request.method == 'GET':
        token = request.GET.get('token')
        user = User.objects.get(token=token)
        user.is_verified = True
        user.save()
        return HttpResponse('User verified')
    else:
        return HttpResponse('Error')
