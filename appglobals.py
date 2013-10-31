#!/usr/bin/env python

# This file contains global variables for the project. 
# All variables names must be in UPPER CASE

# Session, User, Auth config
from models.user import PollUser
import jinja2
import os

AUTH_CONFIG = {
    'webapp2_extras.sessions': {'secret_key': 'somethingreallysecret'},
    'webapp2_extras.auth': {'user_model': PollUser, 
                    'user_attributes': ['name',
                                        'email',
                                        'activated',
                                        'is_admin'
                                    ]
                }
}

## ENVIRONMENT DETAILS
IS_PROD_ENV = False
