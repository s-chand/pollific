# import endpoints
from protorpc import messages
from protorpc import message_types
from protorpc import remote

# @endpoints.api(name='PollsAPI',version='v1', description='Pollific API')
class PollificApi(remote.Service):
    pass

application = None # endpoints.api_server([PollificApi])  