from django.db import models

# Create your models here.

#User Model
class User(models.Model):
    first_name = models.CharField(max_length=50, unique=False)
    last_name = models.CharField(max_length=50, unique=False)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=100)
    friends = models.ManyToManyField('self', blank=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name}"


class ChatRoom(models.Model):
    name = models.CharField(max_length=100, blank=True, null=True, unique=True)

    admin = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="admin_chatrooms")


    participants = models.ManyToManyField(
        User, 
        related_name="chatrooms",
        blank=True
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name or f"ChatRoom {self.id}"

class ChatRoomJoinRequest(models.Model):
    chatroom = models.ForeignKey(
        ChatRoom,
        on_delete=models.CASCADE,
        related_name="join_requests"
    )

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="chatroom_join_requests"
    )

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("chatroom", "user")

    def __str__(self):
        return f"{self.user.username} wants to join {self.chatroom}"


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
    is_system_message = models.BooleanField(default=False)
    body = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        if self.chatroom:
            return f"From {self.sender} in {self.chatroom} at {self.timestamp}"
        return f"From {self.sender} to {self.receiver} at {self.timestamp}"