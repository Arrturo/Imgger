from django import forms
from .models import Image


class UploadForm(forms.ModelForm):
    file = forms.ImageField()

    class Meta:
        model = Image
        fields = ('file',)
