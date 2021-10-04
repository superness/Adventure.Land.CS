using Adventure.Land;
using Adventure.Land.Logic;
using Adventure.Land.Logic.Plan;
using Microsoft.AspNetCore.SignalR.Client;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading;
using System.Threading.Tasks;

namespace GroupPhoenixHunt
{
    class Program
    {
        static DateTime lastPhoenixSeen = DateTime.Now.AddDays(-1);

        private enum CombatState
        {
            FightingPhoenix,
            HuntingPhoenix,
            FarmingBetween
        }

        static string[] mageNames = new[] { "MageS", "SorcS", "MagicS" };

        static async Task Main(string[] args)
        {
            //Set connection
            HubConnection connection = SetupHubConnection();
            SignalRConnection.Hub = new ALHubCharacterCommandWrapper(connection);

            while (true)
            {
                try
                {
                    if (CharacterDataProvider.Instance.Characters.Any(c => c.CharacterData.Name == "MageS") &&
                        CharacterDataProvider.Instance.Characters.Any(c => c.CharacterData.Name == "SorcS") &&
                        CharacterDataProvider.Instance.Characters.Any(c => c.CharacterData.Name == "MagicS"))
                    {
                        await DoCombatAsync();
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine(ex.Message);
                    Thread.Sleep(1000);
                }

                await Task.Delay(500);
            }
        }

        static async Task DoCombatAsync()
        {
            CombatState state = GetCurrentState();

            // Bank anyone who needs to bank
            await BankBoys();

            switch(state)
            {
                case CombatState.HuntingPhoenix:
                    await HuntPhoenix();
                    break;
                case CombatState.FightingPhoenix:
                    // Let them fight
                    // If any of the mages are not around then magiport them in
                    await MagiportOrphanedMages();
                    lastPhoenixSeen = DateTime.Now;
                    break;
                case CombatState.FarmingBetween:
                    
                    break;
            }
        }

        static async Task FarmBScorps()
        {
            // If everyone isn't in desertland farming bscorps then get them there
            var characters = mageNames.Select(n => CharacterDataProvider.Instance.Characters.First(c => c.CharacterData.Name == n));
            var charsNotAtDesertland = characters.Where(c => c.CharacterData.In != "desertland");
            var charsNotAtBScorps = charsNotAtDesertland.Where(c => !Utilities.Instance.IsWithinDistance(c.CharacterData.GetPosition(), Places.BScorpsFarmSpot, 800));
            var charsAtBScorps = characters.Except(charsNotAtBScorps);

            if(!charsAtBScorps.Any())
            {
                // If no one is at bscorps then send the mage with the most mana to blink there so that they can magiport everyone else
                var charWithMostMp = charsNotAtBScorps.OrderByDescending(c => c.CharacterData.Mp).First();

                await new BlinkMover(charWithMostMp.CharacterData.Name).JSMove("desertland", (int)Places.BScorpsFarmSpot.X, (int)Places.BScorpsFarmSpot.Y);
                await Utilities.Instance.WaitUntilCharacterInArea(charWithMostMp.CharacterData.Name, "desertland");
                await Utilities.Instance.WaitUntilCharacterNearLocation(charWithMostMp.CharacterData.Name, Places.BScorpsFarmSpot);
            }

            // Refresh our state data if anything changed above
            characters = mageNames.Select(n => CharacterDataProvider.Instance.Characters.First(c => c.CharacterData.Name == n));
            charsNotAtDesertland = characters.Where(c => c.CharacterData.In != "desertland");
            charsNotAtBScorps = charsNotAtDesertland.Where(c => !Utilities.Instance.IsWithinDistance(c.CharacterData.GetPosition(), Places.BScorpsFarmSpot, 800));
            charsAtBScorps = characters.Except(charsNotAtBScorps);

            if(charsNotAtBScorps.Any())
            {
                // If not everyone is at bscorps then magiport the missing folks there
                var charWithMostMp = charsAtBScorps.OrderByDescending(c => c.CharacterData.Mp).First();
                foreach(var character in charsNotAtBScorps)
                {
                    await new Magiporter().Magiport(charWithMostMp.CharacterData.Name, character.CharacterData.Name);
                }
            }


        }

        static async Task BankBoys()
        {
            var characters = mageNames.Select(n => CharacterDataProvider.Instance.Characters.First(c => c.CharacterData.Name == n));

            var charactersWithFullInventory = characters.Where(c =>
            {
                return c.CharacterData.Items.Where(i => null != i).Count() >= 30;
            });

            foreach(var character in charactersWithFullInventory)
            {
                await new BankItemsIfFull(character.CharacterData.Name).MageBankIfFull();
            }
        }


        static async Task MagiportOrphanedMages()
        {
            // Figure out who is near the Phoenix
            var phoenix = EntityDataProvider.Instance.Entities.FirstOrDefault(e => e.Name == "Phoenix");

            // If Phoenix has very little health then don't bother porting anyone in
            if(phoenix.HP < 5000)
            {
                return;
            }

            List<string> mageNamesNearPhoenix = new List<string>();
            List<string> mageNamesNearPhoenixWithMana = new List<string>();
            List<string> mageNamesAwayFromPhoenix = new List<string>();
            foreach (string mageName in mageNames)
            {
                CharacterExtraData mage = CharacterDataProvider.Instance.Characters.First(c => c.CharacterData.Name == mageName);

                if (mage.CharacterData.In == phoenix.In && Utilities.Instance.IsWithinDistance(mage.CharacterData.GetPosition(), new Point2D { X = phoenix.X, Y = phoenix.Y }, 300))
                {
                    mageNamesNearPhoenix.Add(mageName);

                    if(mage.CharacterData.Mp >= 900)
                    {
                        mageNamesNearPhoenixWithMana.Add(mageName);
                    }
                }
                else
                {
                    mageNamesAwayFromPhoenix.Add(mageName);
                }
            }

            if(mageNamesNearPhoenixWithMana.Any() && mageNamesNearPhoenix.Any())
            {
                foreach(string targetName in mageNamesAwayFromPhoenix)
                {
                    await new Magiporter().Magiport(mageNamesNearPhoenixWithMana.First(), targetName);
                }
            }
        }

        class PhoenixSpawn
        {
            public int x;
            public int y;
            public string map;
        }

        static PhoenixSpawn[] ProblemSpawns = new[]
        {
            new PhoenixSpawn()
            {
                map = "main",
                x = -1184,
                y = 1454
            },
            new PhoenixSpawn()
            {
                map = "main",
                x = -1184,
                y = 108
            },
        };

        static PhoenixSpawn[] PhoenixSpawns = new[]
        {
            new PhoenixSpawn()
            {
                map = "main",
                x = 641,
                y = 1803
            },
            //new PhoenixSpawn()
            //{
            //    map = "main",
            //    x = -1184,
            //    y = 781
            //},
            new PhoenixSpawn()
            {
                map = "halloween",
                x = 8,
                y = 630
            },
            new PhoenixSpawn()
            {
                map = "main",
                x = 1188,
                y = -193
            },
            new PhoenixSpawn()
            {
                map = "cave",
                x = -180,
                y = -1164
            },
        };

        private static async Task HuntPhoenix()
        {
            var allSpawns = PhoenixSpawns.Concat(ProblemSpawns);

            // Split up the spawns and search for Phoenix
            var tokenSource = new CancellationTokenSource();

            Task mageTaskOne = Task.Run(() =>
            {
                HuntPhoenixSpawns(mageNames[0], allSpawns.Take(2).ToArray(), tokenSource.Token).Wait();
            });
            Task mageTaskTwo = Task.Run(() =>
            {
                HuntPhoenixSpawns(mageNames[1], allSpawns.Skip(2).Take(2).ToArray(), tokenSource.Token).Wait();
            });
            Task mageTaskThree = Task.Run(() =>
            {
                HuntPhoenixSpawns(mageNames[2], allSpawns.Skip(4).Take(2).ToArray(), tokenSource.Token).Wait();
            });

            // Wait for someone to find Phoenix
            Task.WaitAny(mageTaskOne, mageTaskTwo, mageTaskThree);
            tokenSource.Cancel();
        }

        private static async Task HuntPhoenixSpawns(string mageName, PhoenixSpawn[] spawns, CancellationToken ct)
        {
            // Cycle through spawn locations every 5 seconds looking for Phoenix
            int curSpawnIdx = 0;
            PhoenixSpawn curSpawn = spawns[curSpawnIdx];

            while(true)
            {
                ct.ThrowIfCancellationRequested();

                // If Phoenix is up anywhere then we gotta get outta here
                if(EntityDataProvider.Instance.Entities.Any(e => e.Name == "Phoenix"))
                {
                    return;
                }

                // Head to the next spawn
                curSpawn = spawns[curSpawnIdx];
                await new BlinkMover(mageName).JSMove(curSpawn.map, curSpawn.x, curSpawn.y);

                // Wait until we get there
                await Utilities.Instance.WaitUntilCharacterInArea(mageName, curSpawn.map, TimeSpan.FromSeconds(10));
                await Utilities.Instance.WaitUntilCharacterNearLocation(
                    mageName, new Point2D()
                    {
                        X = curSpawn.x,
                        Y = curSpawn.y
                    }, 
                    timeout: TimeSpan.FromSeconds(10));

                // Hang out for 5 seconds
                DateTime waitTime = DateTime.Now;
                while ((DateTime.Now - waitTime) < TimeSpan.FromSeconds(5))
                {
                    // If we found Phoenix then bust out
                    if(EntityDataProvider.Instance.Entities.Any(e => e.Name == "Phoenix"))
                    {
                        return;
                    }

                    await Task.Delay(100);
                }

                curSpawnIdx = (curSpawnIdx + 1) % spawns.Length;
            }
        }

        private static CombatState GetCurrentState()
        {
            // If Phoenix is around then we are trying to fight it
            var phoenix = EntityDataProvider.Instance.Entities.FirstOrDefault(e => e.Name == "Phoenix");
            if (null != phoenix)
            {
                return CombatState.FightingPhoenix;
            }

            // If it has been longer than 18 seconds then we should start hunting
            if ((DateTime.Now - lastPhoenixSeen) > TimeSpan.FromSeconds(18))
            {
                return CombatState.HuntingPhoenix;
            }

            return CombatState.FarmingBetween;
        }

        static HubConnection SetupHubConnection()
        {
            HubConnection connection = new HubConnectionBuilder().WithUrl("http://localhost:8081/ALHub").WithAutomaticReconnect().Build();

            connection.On<string, string>("ReceiveMessage", (user, message) => {
                Console.WriteLine(user + " : " + message);
            });

            connection.On<string, string>("CharacterData", (user, message) => {

                CharacterExtraData data = JsonConvert.DeserializeObject<CharacterExtraData>(message);

                try
                {
                    CharacterDataProvider.Instance.OnCharacterUpdate(data);
                }
                catch (Exception ex)
                {
                    Console.WriteLine(JsonConvert.SerializeObject(ex));
                    throw;
                }
            });

            connection.On<string, string>("EntityData", (user, message) => {

                EntityData[] data = JsonConvert.DeserializeObject<EntityData[]>(message);

                try
                {
                    EntityDataProvider.Instance.OnEntitiesUpdate(data);
                }
                catch (Exception ex)
                {
                    Console.WriteLine(JsonConvert.SerializeObject(ex));
                    throw;
                }
            });

            //Start connection
            connection.StartAsync().ContinueWith(task => {
                if (task.IsFaulted)
                {
                    Console.WriteLine("There was an error opening the connection:{0}",
                                      task.Exception.GetBaseException());
                }
                else
                {
                    Console.WriteLine("Connected");
                }

            }).Wait();

            return connection;
        }
    }
}
