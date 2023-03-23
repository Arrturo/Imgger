from django import forms
from .models import Image
from .mutations.images import ImageInput

class UploadForm(forms.ModelForm):
    name = forms.CharField(max_length=255)
    file = forms.ImageField()

    class Meta:
        model = Image 
        fields = ('name', 'file',)

        
