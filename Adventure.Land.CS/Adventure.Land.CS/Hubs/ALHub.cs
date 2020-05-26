using Adventure.Land.CS.Automation;
using Adventure.Land.CS.Data;
using Microsoft.AspNetCore.SignalR;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace Adventure.Land.CS.Hubs
{
    public class GameData
    {
        public string Type { get; set; }
        public string Data { get; set; }
    }

    public class CharacterCommand
    {
        public string Character { get; set; }
        public string Command { get; set; }
        public string Value { get; set; }
    }

    public class ALHub : Hub
    {
        public ALHub()
        {
        }

        public async Task ConnectClient(string user, string message)
        {
            // Ask the client about stuff
            await Clients.All.SendAsync("ReceiveMessage", "ALHub", "What up man?");
        }

        public async Task ReceiveGameData(string user, string message)
        {
            
            // character
            // entities
            // ?
            GameData data = JsonConvert.DeserializeObject<GameData>(message);

            if(data.Type == "character")
            {
                try
                {
                    await Clients.All.SendAsync("ReceiveCharacterData", "ALHub", data.Data);
                    CharacterDataProvider.Instance.OnCharacterUpdate(JsonConvert.DeserializeObject<CharacterExtraData>(data.Data));
                }
                catch(Exception ex)
                {
                    Console.WriteLine(JsonConvert.SerializeObject(ex));
                    throw;
                }
            }
        }

        public async Task SendCharacterCommand(string user, string message)
        {
            // string characterName, string commandName, string commandValue
            CharacterCommand command = JsonConvert.DeserializeObject<CharacterCommand>(message);

            try
            {
                await Clients.All.SendAsync("CharacterCommand" + command.Character, "ALHub", $"{{\"type\":\"{command.Command}\",\"data\":\"{command.Value}\"}}");
            }
            catch (Exception ex)
            {
                Console.WriteLine(JsonConvert.SerializeObject(ex));
                throw;
            }
        }
    }
}
