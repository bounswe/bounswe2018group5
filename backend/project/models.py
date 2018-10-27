from django.db import models

# Create your models here.

from mongoengine import *

class Dummy(Document):
    name = StringField()