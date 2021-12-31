import json
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import async_to_sync

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        print("Connected to consumer")
        self.room_name = self.scope['url_route']['kwargs']['roomName']
        print(f"Connected to roomName: {self.room_name}")
        self.room_group_name = f'chat_{self.room_name}'
        self.user = self.scope["user"]
        print(self.user.username)
        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name,
        )
        await self.accept()

    async def disconnect(self, close_code):
        # leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name,
        )

    # Recieves message from web socket
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        option = text_data_json['option']
        if option == "active_notification":
            username = text_data_json['username']
            userId = text_data_json["user_Id"]
            # Send message to room group
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    "type": "active_user",
                    "username": username,
                    "user_Id": userId
                }
            )

        else:
            print("recieved message")
            message = text_data_json["message"]
            username = text_data_json['username']
            userId = text_data_json["user_Id"]
            print(f'The Message recieved is "{message}" from user: "{username}"')
    
            # Send message to room group
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    "type": "chat_message",
                    "message": message,
                    "username": username,
                    "user_Id": userId
                }
            )


    async def active_user(self, event):
        username = event["username"]
        userId = event["user_Id"]

        await self.send(json.dumps({
            'option': "userActive",
            "username": username,
            "userId": userId
        }))

    # Receive message from room group
    async def chat_message(self, event):
        message = event["message"]
        username = event["username"]
        userId = event["user_Id"]
        # Send message to web socket
        await self.send(json.dumps({
            "option": "newMessage",
            "message": message,
            "username": username,
            "userId": userId
        }))