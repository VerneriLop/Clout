from users.serializers import UserSerializer
from rest_framework import serializers
from .models import Image


class ImageSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    # user = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Image
        fields = "__all__"
