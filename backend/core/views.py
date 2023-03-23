from django.shortcuts import render
from .forms import UploadForm

# Create your views here.


def image_upload_view(request):
    if request.method == 'POST':
        form = UploadForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()
    else:
        form = UploadForm()
    return render(request, 'upload.html', {'form': form})
