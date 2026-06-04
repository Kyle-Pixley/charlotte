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

class ChatRoom(models.Model):
    name = models.CharField(max_length=100, blank=True, null=True)
    participants = models.ManyToManyField(User, related_name="chatrooms")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        if self.name:
            return self.name
        return f"ChatRoom {self.id}"

class Message(models.Model):
    sender = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="sent_messages"
    )
    #For direct messages
    receiver = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="received_messages",
        blank=True,
        null=True
    )
    #For room messages
    chatroom = models.ForeignKey(
        ChatRoom,
        on_delete=models.CASCADE,
        related_name="messages",
        blank=True,
        null=True
    )

    is_read = models.BooleanField(default=False)
    body = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        if self.chatroom:
            return f"From {self.sender} in {self.chatroom} at {self.timestamp}"
        return f"From {self.sender} to {self.receiver} at {self.timestamp}"