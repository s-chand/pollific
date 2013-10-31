from google.appengine.ext import blobstore
from google.appengine.ext.webapp import blobstore_handlers
import urllib
import logging

class UploadHandler(blobstore_handlers.BlobstoreUploadHandler):
    def get(self):
        self.response.write(blobstore.create_upload_url('/upload'))
        
    def post(self):
        upload_files = self.get_uploads('file')  # 'file' is file upload field in the form
        blob_info = upload_files[0]
        self.redirect('/serve/%s' % blob_info.key())
    

class ServeHandler(blobstore_handlers.BlobstoreDownloadHandler):
    def get(self, resource):
        logging.error("Something is right")
        resource = str(urllib.unquote(resource))
        blob_info = blobstore.BlobInfo.get(resource)
        self.send_blob(blob_info)