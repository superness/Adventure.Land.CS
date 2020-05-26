using System;
using System.Collections.Generic;

using System.Globalization;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace Adventure.Land.CS.Automation
{
    public partial class Items
    {
        [JsonProperty("name")]
        public string Name { get; set; }

        [JsonProperty("data")]
        public Data Data { get; set; }
    }

    public partial class Data
    {
        [JsonProperty("skin_r", NullValueHandling = NullValueHandling.Ignore)]
        public string SkinR { get; set; }

        [JsonProperty("explanation", NullValueHandling = NullValueHandling.Ignore)]
        public string Explanation { get; set; }

        [JsonProperty("grades", NullValueHandling = NullValueHandling.Ignore)]
        public long[] Grades { get; set; }

        [JsonProperty("skin")]
        public string Skin { get; set; }

        [JsonProperty("tier", NullValueHandling = NullValueHandling.Ignore)]
        public double? Tier { get; set; }

        [JsonProperty("name")]
        public string Name { get; set; }

        [JsonProperty("a", NullValueHandling = NullValueHandling.Ignore)]
        public A? A { get; set; }

        [JsonProperty("upgrade", NullValueHandling = NullValueHandling.Ignore)]
        public Dictionary<string, double> Upgrade { get; set; }

        [JsonProperty("rpiercing", NullValueHandling = NullValueHandling.Ignore)]
        public long? Rpiercing { get; set; }

        [JsonProperty("g")]
        public long G { get; set; }

        [JsonProperty("wtype", NullValueHandling = NullValueHandling.Ignore)]
        public string Wtype { get; set; }

        [JsonProperty("damage", NullValueHandling = NullValueHandling.Ignore)]
        public Damage? Damage { get; set; }

        [JsonProperty("trex", NullValueHandling = NullValueHandling.Ignore)]
        public string Trex { get; set; }

        [JsonProperty("range", NullValueHandling = NullValueHandling.Ignore)]
        public double? Range { get; set; }

        [JsonProperty("projectile", NullValueHandling = NullValueHandling.Ignore)]
        public string Projectile { get; set; }

        [JsonProperty("attack", NullValueHandling = NullValueHandling.Ignore)]
        public double? Attack { get; set; }

        [JsonProperty("type")]
        public string Type { get; set; }

        [JsonProperty("id")]
        public string Id { get; set; }

        [JsonProperty("dex", NullValueHandling = NullValueHandling.Ignore)]
        public long? Dex { get; set; }

        [JsonProperty("compound", NullValueHandling = NullValueHandling.Ignore)]
        public Dictionary<string, double> Compound { get; set; }

        [JsonProperty("ignore", NullValueHandling = NullValueHandling.Ignore)]
        public bool? Ignore { get; set; }

        [JsonProperty("s", NullValueHandling = NullValueHandling.Ignore)]
        public long? S { get; set; }

        [JsonProperty("e", NullValueHandling = NullValueHandling.Ignore)]
        public long? E { get; set; }

        [JsonProperty("armor", NullValueHandling = NullValueHandling.Ignore)]
        public double? Armor { get; set; }

        [JsonProperty("skin_a", NullValueHandling = NullValueHandling.Ignore)]
        public string SkinA { get; set; }

        [JsonProperty("str", NullValueHandling = NullValueHandling.Ignore)]
        public long? Str { get; set; }

        [JsonProperty("miss", NullValueHandling = NullValueHandling.Ignore)]
        public long? Miss { get; set; }

        [JsonProperty("duration", NullValueHandling = NullValueHandling.Ignore)]
        public double? Duration { get; set; }

        [JsonProperty("speed", NullValueHandling = NullValueHandling.Ignore)]
        public double? Speed { get; set; }

        [JsonProperty("buy", NullValueHandling = NullValueHandling.Ignore)]
        public bool? Buy { get; set; }

        [JsonProperty("cx", NullValueHandling = NullValueHandling.Ignore)]
        public Cx Cx { get; set; }

        [JsonProperty("ability", NullValueHandling = NullValueHandling.Ignore)]
        public string Ability { get; set; }

        [JsonProperty("crit", NullValueHandling = NullValueHandling.Ignore)]
        public double? Crit { get; set; }

        [JsonProperty("reflection", NullValueHandling = NullValueHandling.Ignore)]
        public double? Reflection { get; set; }

        [JsonProperty("mp", NullValueHandling = NullValueHandling.Ignore)]
        public long? Mp { get; set; }

        [JsonProperty("stat", NullValueHandling = NullValueHandling.Ignore)]
        public Stat? Stat { get; set; }

        [JsonProperty("set", NullValueHandling = NullValueHandling.Ignore)]
        public string Set { get; set; }

        [JsonProperty("grade", NullValueHandling = NullValueHandling.Ignore)]
        public long? Grade { get; set; }

        [JsonProperty("resistance", NullValueHandling = NullValueHandling.Ignore)]
        public double? Resistance { get; set; }

        [JsonProperty("scroll", NullValueHandling = NullValueHandling.Ignore)]
        public bool? Scroll { get; set; }

        [JsonProperty("protection", NullValueHandling = NullValueHandling.Ignore)]
        public bool? Protection { get; set; }

        [JsonProperty("class", NullValueHandling = NullValueHandling.Ignore)]
        public Class[] Class { get; set; }

        [JsonProperty("event", NullValueHandling = NullValueHandling.Ignore)]
        public bool? Event { get; set; }

        [JsonProperty("vit", NullValueHandling = NullValueHandling.Ignore)]
        public long? Vit { get; set; }

        [JsonProperty("multiplier", NullValueHandling = NullValueHandling.Ignore)]
        public double? Multiplier { get; set; }

        [JsonProperty("gold", NullValueHandling = NullValueHandling.Ignore)]
        public long? Gold { get; set; }

        [JsonProperty("legacy", NullValueHandling = NullValueHandling.Ignore)]
        public Legacy Legacy { get; set; }

        [JsonProperty("days", NullValueHandling = NullValueHandling.Ignore)]
        public long? Days { get; set; }

        [JsonProperty("gain", NullValueHandling = NullValueHandling.Ignore)]
        public string Gain { get; set; }

        [JsonProperty("withdrawal", NullValueHandling = NullValueHandling.Ignore)]
        public string Withdrawal { get; set; }

        [JsonProperty("cuteness", NullValueHandling = NullValueHandling.Ignore)]
        public long? Cuteness { get; set; }

        [JsonProperty("frequency", NullValueHandling = NullValueHandling.Ignore)]
        public long? Frequency { get; set; }

        [JsonProperty("credit", NullValueHandling = NullValueHandling.Ignore)]
        public string Credit { get; set; }

        [JsonProperty("edge", NullValueHandling = NullValueHandling.Ignore)]
        public long? Edge { get; set; }

        [JsonProperty("hp", NullValueHandling = NullValueHandling.Ignore)]
        public long? Hp { get; set; }

        [JsonProperty("onclick", NullValueHandling = NullValueHandling.Ignore)]
        public string Onclick { get; set; }

        [JsonProperty("action", NullValueHandling = NullValueHandling.Ignore)]
        public string Action { get; set; }

        [JsonProperty("monster", NullValueHandling = NullValueHandling.Ignore)]
        public string Monster { get; set; }

        [JsonProperty("apiercing", NullValueHandling = NullValueHandling.Ignore)]
        public long? Apiercing { get; set; }

        [JsonProperty("quest", NullValueHandling = NullValueHandling.Ignore)]
        public string Quest { get; set; }

        [JsonProperty("eat", NullValueHandling = NullValueHandling.Ignore)]
        public bool? Eat { get; set; }

        [JsonProperty("int", NullValueHandling = NullValueHandling.Ignore)]
        public long? Int { get; set; }

        [JsonProperty("skin_c", NullValueHandling = NullValueHandling.Ignore)]
        public string SkinC { get; set; }

        [JsonProperty("charisma", NullValueHandling = NullValueHandling.Ignore)]
        public long? Charisma { get; set; }

        [JsonProperty("exclusive", NullValueHandling = NullValueHandling.Ignore)]
        public bool? Exclusive { get; set; }

        [JsonProperty("evasion", NullValueHandling = NullValueHandling.Ignore)]
        public double? Evasion { get; set; }

        [JsonProperty("stand", NullValueHandling = NullValueHandling.Ignore)]
        public string Stand { get; set; }

        [JsonProperty("special", NullValueHandling = NullValueHandling.Ignore)]
        public bool? Special { get; set; }

        [JsonProperty("attr0", NullValueHandling = NullValueHandling.Ignore)]
        public double? Attr0 { get; set; }

        [JsonProperty("luck", NullValueHandling = NullValueHandling.Ignore)]
        public long? Luck { get; set; }

        [JsonProperty("dreturn", NullValueHandling = NullValueHandling.Ignore)]
        public long? Dreturn { get; set; }

        [JsonProperty("reward", NullValueHandling = NullValueHandling.Ignore)]
        public long? Reward { get; set; }

        [JsonProperty("lifesteal", NullValueHandling = NullValueHandling.Ignore)]
        public long? Lifesteal { get; set; }

        [JsonProperty("xp", NullValueHandling = NullValueHandling.Ignore)]
        public long? Xp { get; set; }

        [JsonProperty("for", NullValueHandling = NullValueHandling.Ignore)]
        public long? For { get; set; }

        [JsonProperty("delia", NullValueHandling = NullValueHandling.Ignore)]
        public string Delia { get; set; }

        [JsonProperty("charge", NullValueHandling = NullValueHandling.Ignore)]
        public long? Charge { get; set; }

        [JsonProperty("gives", NullValueHandling = NullValueHandling.Ignore)]
        public Stat[][] Gives { get; set; }

        [JsonProperty("unlocks", NullValueHandling = NullValueHandling.Ignore)]
        public string Unlocks { get; set; }

        [JsonProperty("output", NullValueHandling = NullValueHandling.Ignore)]
        public long? Output { get; set; }

        [JsonProperty("note", NullValueHandling = NullValueHandling.Ignore)]
        public string Note { get; set; }

        [JsonProperty("critdamage", NullValueHandling = NullValueHandling.Ignore)]
        public long? Critdamage { get; set; }

        [JsonProperty("offering", NullValueHandling = NullValueHandling.Ignore)]
        public double? Offering { get; set; }

        [JsonProperty("manasteal", NullValueHandling = NullValueHandling.Ignore)]
        public double? Manasteal { get; set; }

        [JsonProperty("npc", NullValueHandling = NullValueHandling.Ignore)]
        public string Npc { get; set; }

        [JsonProperty("nopo", NullValueHandling = NullValueHandling.Ignore)]
        public string Nopo { get; set; }

        [JsonProperty("projectile_test", NullValueHandling = NullValueHandling.Ignore)]
        public string ProjectileTest { get; set; }

        [JsonProperty("awesomeness", NullValueHandling = NullValueHandling.Ignore)]
        public long? Awesomeness { get; set; }

        [JsonProperty("mp_cost", NullValueHandling = NullValueHandling.Ignore)]
        public long? MpCost { get; set; }

        [JsonProperty("hat", NullValueHandling = NullValueHandling.Ignore)]
        public string Hat { get; set; }

        [JsonProperty("res", NullValueHandling = NullValueHandling.Ignore)]
        public long? Res { get; set; }

        [JsonProperty("acolor", NullValueHandling = NullValueHandling.Ignore)]
        public string Acolor { get; set; }

        [JsonProperty("strength", NullValueHandling = NullValueHandling.Ignore)]
        public long? Strength { get; set; }

        [JsonProperty("bling", NullValueHandling = NullValueHandling.Ignore)]
        public long? Bling { get; set; }

        [JsonProperty("cash", NullValueHandling = NullValueHandling.Ignore)]
        public long? Cash { get; set; }

        [JsonProperty("buy_with_cash", NullValueHandling = NullValueHandling.Ignore)]
        public bool? BuyWithCash { get; set; }

        [JsonProperty("opens", NullValueHandling = NullValueHandling.Ignore)]
        public string Opens { get; set; }

        [JsonProperty("attr1", NullValueHandling = NullValueHandling.Ignore)]
        public long? Attr1 { get; set; }

        [JsonProperty("rare", NullValueHandling = NullValueHandling.Ignore)]
        public bool? Rare { get; set; }
    }

    public partial class Cx
    {
        [JsonProperty("scale", NullValueHandling = NullValueHandling.Ignore)]
        public double? Scale { get; set; }

        [JsonProperty("accent", NullValueHandling = NullValueHandling.Ignore)]
        public string Accent { get; set; }

        [JsonProperty("extension", NullValueHandling = NullValueHandling.Ignore)]
        public bool? Extension { get; set; }

        [JsonProperty("large", NullValueHandling = NullValueHandling.Ignore)]
        public bool? Large { get; set; }

        [JsonProperty("lightborder", NullValueHandling = NullValueHandling.Ignore)]
        public bool? Lightborder { get; set; }

        [JsonProperty("border", NullValueHandling = NullValueHandling.Ignore)]
        public long? Border { get; set; }
    }

    public partial class Legacy
    {
        [JsonProperty("gold", NullValueHandling = NullValueHandling.Ignore)]
        public long? Gold { get; set; }

        [JsonProperty("set")]
        public object Set { get; set; }

        [JsonProperty("class")]
        public object Class { get; set; }

        [JsonProperty("luck", NullValueHandling = NullValueHandling.Ignore)]
        public long? Luck { get; set; }
    }

    public enum Class { Mage, Merchant, Priest, Ranger, Rogue, Warrior };

    public enum Damage { Heal, Magical, Physical };

    public partial struct A
    {
        public bool? Bool;
        public long? Integer;

        public static implicit operator A(bool Bool) => new A { Bool = Bool };
        public static implicit operator A(long Integer) => new A { Integer = Integer };
    }

    public partial struct Stat
    {
        public long? Integer;
        public string String;

        public static implicit operator Stat(long Integer) => new Stat { Integer = Integer };
        public static implicit operator Stat(string String) => new Stat { String = String };
    }


    internal class AConverter : JsonConverter
    {
        public override bool CanConvert(Type t) => t == typeof(A) || t == typeof(A?);

        public override object ReadJson(JsonReader reader, Type t, object existingValue, JsonSerializer serializer)
        {
            switch (reader.TokenType)
            {
                case JsonToken.Integer:
                    var integerValue = serializer.Deserialize<long>(reader);
                    return new A { Integer = integerValue };
                case JsonToken.Boolean:
                    var boolValue = serializer.Deserialize<bool>(reader);
                    return new A { Bool = boolValue };
            }
            throw new Exception("Cannot unmarshal type A");
        }

        public override void WriteJson(JsonWriter writer, object untypedValue, JsonSerializer serializer)
        {
            var value = (A)untypedValue;
            if (value.Integer != null)
            {
                serializer.Serialize(writer, value.Integer.Value);
                return;
            }
            if (value.Bool != null)
            {
                serializer.Serialize(writer, value.Bool.Value);
                return;
            }
            throw new Exception("Cannot marshal type A");
        }

        public static readonly AConverter Singleton = new AConverter();
    }

    internal class ClassConverter : JsonConverter
    {
        public override bool CanConvert(Type t) => t == typeof(Class) || t == typeof(Class?);

        public override object ReadJson(JsonReader reader, Type t, object existingValue, JsonSerializer serializer)
        {
            if (reader.TokenType == JsonToken.Null) return null;
            var value = serializer.Deserialize<string>(reader);
            switch (value)
            {
                case "mage":
                    return Class.Mage;
                case "merchant":
                    return Class.Merchant;
                case "priest":
                    return Class.Priest;
                case "ranger":
                    return Class.Ranger;
                case "rogue":
                    return Class.Rogue;
                case "warrior":
                    return Class.Warrior;
            }
            throw new Exception("Cannot unmarshal type Class");
        }

        public override void WriteJson(JsonWriter writer, object untypedValue, JsonSerializer serializer)
        {
            if (untypedValue == null)
            {
                serializer.Serialize(writer, null);
                return;
            }
            var value = (Class)untypedValue;
            switch (value)
            {
                case Class.Mage:
                    serializer.Serialize(writer, "mage");
                    return;
                case Class.Merchant:
                    serializer.Serialize(writer, "merchant");
                    return;
                case Class.Priest:
                    serializer.Serialize(writer, "priest");
                    return;
                case Class.Ranger:
                    serializer.Serialize(writer, "ranger");
                    return;
                case Class.Rogue:
                    serializer.Serialize(writer, "rogue");
                    return;
                case Class.Warrior:
                    serializer.Serialize(writer, "warrior");
                    return;
            }
            throw new Exception("Cannot marshal type Class");
        }

        public static readonly ClassConverter Singleton = new ClassConverter();
    }

    internal class DamageConverter : JsonConverter
    {
        public override bool CanConvert(Type t) => t == typeof(Damage) || t == typeof(Damage?);

        public override object ReadJson(JsonReader reader, Type t, object existingValue, JsonSerializer serializer)
        {
            if (reader.TokenType == JsonToken.Null) return null;
            var value = serializer.Deserialize<string>(reader);
            switch (value)
            {
                case "heal":
                    return Damage.Heal;
                case "magical":
                    return Damage.Magical;
                case "physical":
                    return Damage.Physical;
            }
            throw new Exception("Cannot unmarshal type Damage");
        }

        public override void WriteJson(JsonWriter writer, object untypedValue, JsonSerializer serializer)
        {
            if (untypedValue == null)
            {
                serializer.Serialize(writer, null);
                return;
            }
            var value = (Damage)untypedValue;
            switch (value)
            {
                case Damage.Heal:
                    serializer.Serialize(writer, "heal");
                    return;
                case Damage.Magical:
                    serializer.Serialize(writer, "magical");
                    return;
                case Damage.Physical:
                    serializer.Serialize(writer, "physical");
                    return;
            }
            throw new Exception("Cannot marshal type Damage");
        }

        public static readonly DamageConverter Singleton = new DamageConverter();
    }

    internal class StatConverter : JsonConverter
    {
        public override bool CanConvert(Type t) => t == typeof(Stat) || t == typeof(Stat?);

        public override object ReadJson(JsonReader reader, Type t, object existingValue, JsonSerializer serializer)
        {
            switch (reader.TokenType)
            {
                case JsonToken.Integer:
                    var integerValue = serializer.Deserialize<long>(reader);
                    return new Stat { Integer = integerValue };
                case JsonToken.String:
                case JsonToken.Date:
                    var stringValue = serializer.Deserialize<string>(reader);
                    return new Stat { String = stringValue };
            }
            throw new Exception("Cannot unmarshal type Stat");
        }

        public override void WriteJson(JsonWriter writer, object untypedValue, JsonSerializer serializer)
        {
            var value = (Stat)untypedValue;
            if (value.Integer != null)
            {
                serializer.Serialize(writer, value.Integer.Value);
                return;
            }
            if (value.String != null)
            {
                serializer.Serialize(writer, value.String);
                return;
            }
            throw new Exception("Cannot marshal type Stat");
        }

        public static readonly StatConverter Singleton = new StatConverter();
    }
}
