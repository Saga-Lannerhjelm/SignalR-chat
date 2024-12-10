using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using ChatService.dataService;
using ChatService.Models;
using Microsoft.AspNetCore.SignalR;

// project made with help from https://www.youtube.com/watch?v=nEQvA5HfEDE

namespace ChatService.Hubs
{
    public class ChatHub : Hub
    {
        private readonly SharedDB _shared;

        public ChatHub (SharedDB shared)
        {
            _shared = shared;
        }

        public async Task JoinRoom (UserConnection user) 
        {
            var id = Context.ConnectionId;
            await Groups.AddToGroupAsync(id, user.ChatRoom);
            _shared.Connection[id] = new UserConnection { UserName = user.UserName, ChatRoom = user.ChatRoom};

            await Clients.OthersInGroup(user.ChatRoom).SendAsync("ReceiveMessage", $"{user.UserName} has joined!");
            await Clients.Caller.SendAsync("ReceiveMessage", $"Welcome to room {user.ChatRoom}!");
            await SendConnectedUsers(user.ChatRoom);
        }

        public async Task SendMessage (string msg)
        {
            if (_shared.Connection.TryGetValue(Context.ConnectionId, out UserConnection? user))
            {
                await Clients.OthersInGroup(user.ChatRoom).SendAsync("ReceiveMessageFromUser", msg, user.UserName);
                await Clients.Caller.SendAsync("ReceiveMessageFromUser", msg, null);
            }
        }

        public Task SendConnectedUsers (string chatRoom) {
            var users = _shared.Connection.Values
            .Where(c => c.ChatRoom == chatRoom)
            .Select(c => c.UserName);

            return Clients.Group(chatRoom).SendAsync("UsersInRoom", users);
        }

        public async Task UserIsTyping () {
            if (_shared.Connection.TryGetValue(Context.ConnectionId, out UserConnection? user))
            {
            await Clients.OthersInGroup(user.ChatRoom).SendAsync("Typing", user.UserName);
            }
        }

        public override Task OnDisconnectedAsync(Exception? exception)
        {
            if (_shared.Connection.TryGetValue(Context.ConnectionId, out UserConnection? user))
            {
                _shared.Connection.Remove(Context.ConnectionId, out _);
                Clients.Group(user.ChatRoom).SendAsync("ReceiveMessage", $"{user.UserName} has left the chat :(");

                SendConnectedUsers(user.ChatRoom);
            }
            return base.OnDisconnectedAsync(exception);
        }
    }
}