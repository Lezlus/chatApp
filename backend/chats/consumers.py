import json
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import async_to_sync

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        print("Connected to consumer")
        self.room_name = self.scope['url_route']['kwargs']['roomName']
        print(f"Connected to roomName: {self.room_name}")
        self.room_group_name = f'chat_{self.room_name}'

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
        print("recieved message")
        text_data_json = json.loads(text_data)
        message = text_data_json["message"]
        print(f'The Message recieved is "{message}"')
    
        # Send message to room group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "chat_message",
                "message": message
            }
        )

    # Receive message from room group
    async def chat_message(self, event):
        message = event["message"]

        # Send message to web socket
        await self.send(json.dumps({
            "message": message
        }))