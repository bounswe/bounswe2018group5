from django.shortcuts import render
from django.http import JsonResponse

# Create your views here.

from project.models import Dummy
from mongoengine import connect
import os

def index(request):

    dummy = Dummy()
    dummy.name="whatever"
    dummy.save()
    return JsonResponse({"user" : "whoCares"})