from rest_framework import serializers
from django.contrib.auth import get_user_model, authenticate
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    skills = serializers.ListField(child=serializers.CharField(), required=False, allow_empty=True)

    class Meta:
        model = User
        fields = (
            'id', 'username', 'email', 'first_name', 'last_name', 'user_type',
            'phone_number', 'profile_picture', 'created_at', 'updated_at',
            # Student profile fields
            'graduation_year', 'branch', 'skills', 'github_url', 'linkedin_url', 'portfolio_url',
            # Company profile fields
            'company_name', 'company_description', 'company_website', 'company_logo'
        )
        read_only_fields = ('created_at', 'updated_at', 'username')

    def validate_graduation_year(self, value):
        if value and not isinstance(value, int):
            try:
                return int(value)
            except (TypeError, ValueError):
                raise serializers.ValidationError("Graduation year must be a valid number")
        return value

    def validate_skills(self, value):
        if value is None:
            return []
        if not isinstance(value, list):
            if isinstance(value, str):
                # Handle comma-separated string
                return [skill.strip() for skill in value.split(',') if skill.strip()]
            raise serializers.ValidationError("Skills must be a list or comma-separated string")
        return [str(skill).strip() for skill in value if str(skill).strip()]

class StudentProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'phone_number',
                 'profile_picture', 'graduation_year', 'branch', 'skills',
                 'github_url', 'linkedin_url', 'portfolio_url')
        read_only_fields = ('id', 'username', 'email')

class CompanyProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'phone_number', 'company_name',
                 'company_description', 'company_website', 'company_logo')
        read_only_fields = ('id', 'username', 'email')

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ('email', 'password', 'password2', 'first_name', 'last_name', 'user_type')

    def validate(self, attrs):
        if attrs['password'] != attrs.pop('password2'):
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs

    def create(self, validated_data):
        user = User.objects.create(
            username=validated_data['email'],  # Use email as username
            email=validated_data['email'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            user_type=validated_data['user_type']
        )
        user.set_password(validated_data['password'])
        user.save()
        return user

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        # Get the username
        username = attrs.get('username')
        password = attrs.get('password')
        
        print(f"Attempting login with username: {username}")
        
        # Check if the username is actually an email
        if '@' in username:
            # Try to find user by email
            try:
                user = User.objects.get(email=username)
                # If found, replace the username with the actual username
                attrs['username'] = user.username
                print(f"Found user by email: {user.username}")
            except User.DoesNotExist:
                print(f"No user found with email: {username}")
                # Continue with normal validation (which will fail)
                pass

        # Call parent validation
        try:
            data = super().validate(attrs)
            print("Parent validation successful")
            # Add user data to response
            data['user'] = UserSerializer(self.user).data
            return data
        except Exception as e:
            print(f"Parent validation failed: {str(e)}")
            raise

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(required=True, write_only=True)

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')

        if email and password:
            try:
                user = User.objects.get(email=email)
                if user.check_password(password):
                    attrs['user'] = user
                    return attrs
            except User.DoesNotExist:
                pass

        raise serializers.ValidationError('Unable to log in with provided credentials.')

class PasswordChangeSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True, validators=[validate_password])
    new_password2 = serializers.CharField(required=True)

    def validate(self, attrs):
        if attrs['new_password'] != attrs['new_password2']:
            raise serializers.ValidationError({"new_password": "Password fields didn't match."})
        return attrs

class PasswordResetSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)

class PasswordResetConfirmSerializer(serializers.Serializer):
    token = serializers.CharField(required=True)
    uid = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True, validators=[validate_password])
    new_password2 = serializers.CharField(required=True)

    def validate(self, attrs):
        if attrs['new_password'] != attrs['new_password2']:
            raise serializers.ValidationError({"new_password": "Password fields didn't match."})
        return attrs