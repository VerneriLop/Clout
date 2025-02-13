from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import get_user_model

User = get_user_model()


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)

        # 🔹 Lisää käyttäjän tiedot myös vastaukseen
        user = self.user
        data.update(
            {
                "user": {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,
                    "bio": user.bio if hasattr(user, "bio") else "",
                }
            }
        )

        return data
