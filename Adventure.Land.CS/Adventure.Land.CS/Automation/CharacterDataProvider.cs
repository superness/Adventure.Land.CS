using Adventure.Land.CS.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Adventure.Land.CS.Automation
{
    public class CharacterDataProvider
    {
        Dictionary<string, CharacterExtraData> characterMap = new Dictionary<string, CharacterExtraData>();

        public void OnCharacterUpdate(CharacterExtraData character)
        {
            this.characterMap[character.Character.Name] = character;
        }

        private static CharacterDataProvider instance = new CharacterDataProvider();
        public static CharacterDataProvider Instance
        {
            get
            {
                return CharacterDataProvider.instance;
            }
        }
    }
}
