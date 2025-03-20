import os
import logging
import requests
from django.conf import settings
from django.core.files.storage import Storage
from django.utils.deconstruct import deconstructible
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

logger = logging.getLogger(__name__)

@deconstructible
class SupabaseStorage(Storage):
    def __init__(self, **settings_dict):
        self.bucket_name = getattr(settings, 'SUPABASE_BUCKET', 'internship-portal')
        self.base_url = f"{settings.SUPABASE_URL}/storage/v1/object"
        # Use service role key for storage operations
        self.headers = {
            'apikey': os.getenv('SUPABASE_SECRET_KEY'),
            'Authorization': f'Bearer {os.getenv("SUPABASE_SECRET_KEY")}'
        }

    def _save(self, name, content):
        """Save the file to Supabase storage."""
        try:
            # Ensure the file is at the beginning
            content.seek(0)
            
            # Prepare the upload URL
            upload_url = f"{self.base_url}/{self.bucket_name}/{name}"
            
            # Prepare the file data
            files = {
                'file': (name, content, content.content_type)
            }
            
            # Upload the file
            response = requests.post(
                upload_url,
                headers=self.headers,
                files=files
            )
            
            if response.status_code not in (200, 201):
                raise Exception(f"Upload failed: {response.text}")
            
            logger.info(f"Successfully uploaded file: {name}")
            return name
            
        except Exception as e:
            logger.error(f"Error uploading file {name}: {str(e)}")
            raise

    def url(self, name):
        """Return the public URL for the file."""
        try:
            return f"{settings.SUPABASE_URL}/storage/v1/object/public/{self.bucket_name}/{name}"
        except Exception as e:
            logger.error(f"Error getting URL for file {name}: {str(e)}")
            return None

    def exists(self, name):
        """Check if the file exists in the bucket."""
        try:
            url = f"{self.base_url}/{self.bucket_name}/{name}"
            response = requests.head(url, headers=self.headers)
            return response.status_code == 200
        except Exception as e:
            logger.error(f"Error checking existence of file {name}: {str(e)}")
            return False

    def delete(self, name):
        """Delete the file from the bucket."""
        try:
            url = f"{self.base_url}/{self.bucket_name}/{name}"
            response = requests.delete(url, headers=self.headers)
            if response.status_code not in (200, 204):
                raise Exception(f"Delete failed: {response.text}")
            logger.info(f"Successfully deleted file: {name}")
        except Exception as e:
            logger.error(f"Error deleting file {name}: {str(e)}")
            raise 