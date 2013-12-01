from google.appengine.ext import blobstore
from google.appengine.api import images
from google.appengine.ext.webapp import blobstore_handlers
import urllib
import logging
import webapp2

class UploadHandler(blobstore_handlers.BlobstoreUploadHandler):
    def get(self):
        self.response.write(blobstore.create_upload_url('/upload'))
        
    def post(self):
        upload_files = self.get_uploads('file')  # 'file' is file upload field in the form
        blob_info = upload_files[0]
        self.response.write('/serve/%s' % blob_info.key())
    

class ServeHandler(webapp2.RequestHandler):
    def get(self, resource):
        logging.error("Something is right")
        resource = str(urllib.unquote(resource))        
        blob_info = blobstore.BlobInfo.get(resource)
        img = images.Image(blob_key=resource)
        img.resize(width=200, height=200)
        #img.im_feeling_lucky()
        thumbnail = img.execute_transforms(output_encoding=images.JPEG)
        self.response.headers['Content-Type'] = 'image/jpeg'
        self.response.out.write(thumbnail)