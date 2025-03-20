from supabase import create_client, Client
from django.conf import settings
from typing import Dict, Any, Optional
import json

class SupabaseClient:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(SupabaseClient, cls).__new__(cls)
            cls._instance.client = create_client(
                settings.SUPABASE_URL,
                settings.SUPABASE_KEY
            )
        return cls._instance

    def upload_file(self, file_path: str, file_data: bytes, content_type: str) -> Dict[str, Any]:
        """
        Upload a file to Supabase Storage.
        
        Args:
            file_path: The path where the file will be stored
            file_data: The file data in bytes
            content_type: The MIME type of the file
            
        Returns:
            Dictionary containing the file URL and metadata
        """
        try:
            response = self.client.storage.from_(settings.SUPABASE_BUCKET).upload(
                file_path,
                file_data,
                {'content-type': content_type}
            )
            
            # Get the public URL
            file_url = self.client.storage.from_(settings.SUPABASE_BUCKET).get_public_url(file_path)
            
            return {
                'url': file_url,
                'path': file_path,
                'content_type': content_type
            }
        except Exception as e:
            raise Exception(f"Error uploading file to Supabase: {str(e)}")

    def delete_file(self, file_path: str) -> bool:
        """
        Delete a file from Supabase Storage.
        
        Args:
            file_path: The path of the file to delete
            
        Returns:
            bool: True if deletion was successful
        """
        try:
            self.client.storage.from_(settings.SUPABASE_BUCKET).remove([file_path])
            return True
        except Exception as e:
            raise Exception(f"Error deleting file from Supabase: {str(e)}")

    def get_file_url(self, file_path: str) -> str:
        """
        Get the public URL of a file.
        
        Args:
            file_path: The path of the file
            
        Returns:
            str: The public URL of the file
        """
        return self.client.storage.from_(settings.SUPABASE_BUCKET).get_public_url(file_path)

    def subscribe_to_changes(self, table: str, callback: callable) -> None:
        """
        Subscribe to real-time changes in a table.
        
        Args:
            table: The table name to subscribe to
            callback: The function to call when changes occur
        """
        try:
            self.client.table(table).on('*', callback).subscribe()
        except Exception as e:
            raise Exception(f"Error subscribing to Supabase changes: {str(e)}")

    def insert_record(self, table: str, data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Insert a record into a table.
        
        Args:
            table: The table name
            data: The data to insert
            
        Returns:
            Dictionary containing the inserted record
        """
        try:
            response = self.client.table(table).insert(data).execute()
            return response.data[0] if response.data else None
        except Exception as e:
            raise Exception(f"Error inserting record into Supabase: {str(e)}")

    def update_record(self, table: str, record_id: str, data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Update a record in a table.
        
        Args:
            table: The table name
            record_id: The ID of the record to update
            data: The data to update
            
        Returns:
            Dictionary containing the updated record
        """
        try:
            response = self.client.table(table).update(data).eq('id', record_id).execute()
            return response.data[0] if response.data else None
        except Exception as e:
            raise Exception(f"Error updating record in Supabase: {str(e)}")

    def delete_record(self, table: str, record_id: str) -> bool:
        """
        Delete a record from a table.
        
        Args:
            table: The table name
            record_id: The ID of the record to delete
            
        Returns:
            bool: True if deletion was successful
        """
        try:
            response = self.client.table(table).delete().eq('id', record_id).execute()
            return bool(response.data)
        except Exception as e:
            raise Exception(f"Error deleting record from Supabase: {str(e)}")

# Create a singleton instance
supabase = SupabaseClient() 