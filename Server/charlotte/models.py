from django.db import models

# Create your models here.

#User Model
class User(models.Model):
    username = models.CharField(max_length=50, unique=True)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=100)
    groups = models.ManyToManyField('self', blank=True)
    friends = models.ManyToManyField('self', blank=True)

    def __str__(self):
        return self.username

