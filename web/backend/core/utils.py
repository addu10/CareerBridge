import os
import magic
from django.conf import settings
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _

def validate_file_type(file, allowed_types=None):
    """
    Validate the file type using python-magic.
    
    Args:
        file: The uploaded file object
        allowed_types: List of allowed MIME types
        
    Returns:
        bool: True if file type is valid
        
    Raises:
        ValidationError: If file type is not allowed
    """
    if allowed_types is None:
        allowed_types = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ]
    
    # Read the first 2048 bytes to determine file type
    file_type = magic.from_buffer(file.read(2048), mime=True)
    file.seek(0)  # Reset file pointer
    
    if file_type not in allowed_types:
        raise ValidationError(
            _('File type not allowed. Allowed types: %(allowed_types)s'),
            params={'allowed_types': ', '.join(allowed_types)}
        )
    
    return True

def validate_file_size(file, max_size_mb=5):
    """
    Validate the file size.
    
    Args:
        file: The uploaded file object
        max_size_mb: Maximum file size in megabytes
        
    Returns:
        bool: True if file size is valid
        
    Raises:
        ValidationError: If file size exceeds limit
    """
    max_size_bytes = max_size_mb * 1024 * 1024
    
    if file.size > max_size_bytes:
        raise ValidationError(
            _('File size too large. Maximum size: %(max_size_mb)sMB'),
            params={'max_size_mb': max_size_mb}
        )
    
    return True

def get_file_upload_path(instance, filename):
    """
    Generate a unique file path for uploads.
    
    Args:
        instance: The model instance
        filename: The original filename
        
    Returns:
        str: The generated file path
    """
    # Get the file extension
    ext = filename.split('.')[-1]
    
    # Generate a unique filename
    new_filename = f"{instance.user.id}_{instance.id}.{ext}"
    
    # Return the path relative to MEDIA_ROOT
    return os.path.join('uploads', instance._meta.model_name, new_filename)

def process_resume_file(file):
    """
    Process a resume file for text extraction.
    
    Args:
        file: The uploaded resume file
        
    Returns:
        str: The extracted text content
    """
    # Validate file type
    validate_file_type(file, ['application/pdf', 'application/msword', 
                             'application/vnd.openxmlformats-officedocument.wordprocessingml.document'])
    
    # Validate file size (max 5MB)
    validate_file_size(file, max_size_mb=5)
    
    # TODO: Implement text extraction based on file type
    # For now, just read the file content
    return file.read().decode('utf-8') 