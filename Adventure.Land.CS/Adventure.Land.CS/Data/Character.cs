namespace Adventure.Land.CS.Data
{
    using System;
    using System.Collections.Generic;

    using System.Globalization;
    using Newtonsoft.Json;
    using Newtonsoft.Json.Converters;

    public class ExtraData
    {
        [JsonProperty("target")]
        public string Target { get; set; }
    }

    public class CharacterExtraData
    {
        [JsonProperty("character")]
        public Character Character { get; set; }
        [JsonProperty("extra")]
        public ExtraData ExtraData { get; set; }
    }
    public partial class Character
    {
        [JsonProperty("x")]
        public double X { get; set; }

        [JsonProperty("y")]
        public double Y { get; set; }

        [JsonProperty("note")]
        public string Note { get; set; }

        [JsonProperty("properties")]
        public string[] Properties { get; set; }

        [JsonProperty("read_only")]
        public string[] ReadOnly { get; set; }

        [JsonProperty("proxy_character")]
        public bool ProxyCharacter { get; set; }

        [JsonProperty("alpha")]
        public long Alpha { get; set; }

        [JsonProperty("visible")]
        public bool Visible { get; set; }

        [JsonProperty("cskin")]
        public long Cskin { get; set; }

        [JsonProperty("i")]
        public long I { get; set; }

        [JsonProperty("j")]
        public long J { get; set; }

        [JsonProperty("skin")]
        public string Skin { get; set; }

        [JsonProperty("stype")]
        public string Stype { get; set; }

        [JsonProperty("updates")]
        public long Updates { get; set; }

        [JsonProperty("cscale")]
        public long Cscale { get; set; }

        [JsonProperty("in")]
        public string In { get; set; }

        [JsonProperty("map")]
        public string Map { get; set; }

        [JsonProperty("hp")]
        public long Hp { get; set; }

        [JsonProperty("max_hp")]
        public long MaxHp { get; set; }

        [JsonProperty("mp")]
        public long Mp { get; set; }

        [JsonProperty("max_mp")]
        public long MaxMp { get; set; }

        [JsonProperty("xp")]
        public long Xp { get; set; }

        [JsonProperty("attack")]
        public long Attack { get; set; }

        [JsonProperty("frequency")]
        public double Frequency { get; set; }

        [JsonProperty("speed")]
        public long Speed { get; set; }

        [JsonProperty("range")]
        public long Range { get; set; }

        [JsonProperty("armor")]
        public long Armor { get; set; }

        [JsonProperty("resistance")]
        public long Resistance { get; set; }

        [JsonProperty("level")]
        public long Level { get; set; }

        [JsonProperty("rip")]
        public bool Rip { get; set; }

        [JsonProperty("afk")]
        public bool Afk { get; set; }

        [JsonProperty("s")]
        public S S { get; set; }

        [JsonProperty("c")]
        public Acx C { get; set; }

        [JsonProperty("q")]
        public Acx Q { get; set; }

        [JsonProperty("age")]
        public long Age { get; set; }

        [JsonProperty("pdps")]
        public double Pdps { get; set; }

        [JsonProperty("id")]
        public string Id { get; set; }

        [JsonProperty("cid")]
        public long Cid { get; set; }

        [JsonProperty("stand")]
        public string Stand { get; set; }

        [JsonProperty("cx")]
        public Cx Cx { get; set; }

        [JsonProperty("slots")]
        public Slots Slots { get; set; }

        [JsonProperty("ctype")]
        public string Ctype { get; set; }

        [JsonProperty("owner")]
        public string Owner { get; set; }

        [JsonProperty("int")]
        public long Int { get; set; }

        [JsonProperty("str")]
        public long Str { get; set; }

        [JsonProperty("dex")]
        public long Dex { get; set; }

        [JsonProperty("vit")]
        public long Vit { get; set; }

        [JsonProperty("for")]
        public long For { get; set; }

        [JsonProperty("mp_cost")]
        public long MpCost { get; set; }

        [JsonProperty("max_xp")]
        public long MaxXp { get; set; }

        [JsonProperty("goldm")]
        public double Goldm { get; set; }

        [JsonProperty("xpm")]
        public double Xpm { get; set; }

        [JsonProperty("luckm")]
        public double Luckm { get; set; }

        [JsonProperty("isize")]
        public long Isize { get; set; }

        [JsonProperty("esize")]
        public long Esize { get; set; }

        [JsonProperty("gold")]
        public long Gold { get; set; }

        [JsonProperty("cash")]
        public long Cash { get; set; }

        [JsonProperty("targets")]
        public long Targets { get; set; }

        [JsonProperty("m")]
        public long M { get; set; }

        [JsonProperty("evasion")]
        public long Evasion { get; set; }

        [JsonProperty("miss")]
        public long Miss { get; set; }

        [JsonProperty("reflection")]
        public long Reflection { get; set; }

        [JsonProperty("lifesteal")]
        public long Lifesteal { get; set; }

        [JsonProperty("manasteal")]
        public long Manasteal { get; set; }

        [JsonProperty("rpiercing")]
        public long Rpiercing { get; set; }

        [JsonProperty("apiercing")]
        public long Apiercing { get; set; }

        [JsonProperty("crit")]
        public long Crit { get; set; }

        [JsonProperty("critdamage")]
        public long Critdamage { get; set; }

        [JsonProperty("dreturn")]
        public long Dreturn { get; set; }

        [JsonProperty("tax")]
        public double Tax { get; set; }

        [JsonProperty("xrange")]
        public long Xrange { get; set; }

        [JsonProperty("items")]
        public Item[] Items { get; set; }

        [JsonProperty("cc")]
        public long Cc { get; set; }

        [JsonProperty("ipass")]
        public string Ipass { get; set; }

        [JsonProperty("friends")]
        public object[] Friends { get; set; }

        [JsonProperty("acx")]
        public Acx Acx { get; set; }

        [JsonProperty("xcx")]
        public string[] Xcx { get; set; }

        [JsonProperty("pzazz")]
        public long Pzazz { get; set; }

        [JsonProperty("last_ms")]
        public DateTimeOffset LastMs { get; set; }

        [JsonProperty("cxc")]
        public Cxc Cxc { get; set; }

        [JsonProperty("name")]
        public string Name { get; set; }

        [JsonProperty("walking")]
        public object Walking { get; set; }

        [JsonProperty("fx")]
        public Acx Fx { get; set; }

        [JsonProperty("emblems")]
        public Acx Emblems { get; set; }

        [JsonProperty("real_alpha")]
        public long RealAlpha { get; set; }

        [JsonProperty("real_x")]
        public double RealX { get; set; }

        [JsonProperty("real_y")]
        public double RealY { get; set; }

        [JsonProperty("type")]
        public string Type { get; set; }

        [JsonProperty("me")]
        public long Me { get; set; }

        [JsonProperty("base")]
        public Base Base { get; set; }

        [JsonProperty("awidth")]
        public long Awidth { get; set; }

        [JsonProperty("aheight")]
        public long Aheight { get; set; }

        [JsonProperty("ping")]
        public double Ping { get; set; }

        [JsonProperty("vision")]
        public long[] Vision { get; set; }

        [JsonProperty("name_tag")]
        public NameTag NameTag { get; set; }

        [JsonProperty("ntag_cache")]
        public string NtagCache { get; set; }

        [JsonProperty("last_targets")]
        public long LastTargets { get; set; }

        [JsonProperty("listeners")]
        public Listener[] Listeners { get; set; }

        [JsonProperty("stats")]
        public Stats Stats { get; set; }

        [JsonProperty("bank")]
        public object Bank { get; set; }

        [JsonProperty("code")]
        public bool Code { get; set; }

        [JsonProperty("from_x")]
        public double FromX { get; set; }

        [JsonProperty("from_y")]
        public double FromY { get; set; }

        [JsonProperty("going_x")]
        public double GoingX { get; set; }

        [JsonProperty("going_y")]
        public double GoingY { get; set; }

        [JsonProperty("moving")]
        public bool Moving { get; set; }

        [JsonProperty("ref_speed")]
        public long RefSpeed { get; set; }

        [JsonProperty("vx")]
        public long Vx { get; set; }

        [JsonProperty("vy")]
        public long Vy { get; set; }

        [JsonProperty("angle")]
        public double Angle { get; set; }

        [JsonProperty("a_direction")]
        public long ADirection { get; set; }

        [JsonProperty("direction")]
        public long Direction { get; set; }

        [JsonProperty("ms_walk")]
        public DateTimeOffset MsWalk { get; set; }

        [JsonProperty("last_stop")]
        public DateTimeOffset LastStop { get; set; }

        [JsonProperty("last_walking")]
        public long LastWalking { get; set; }

        [JsonProperty("move_num")]
        public long MoveNum { get; set; }

        [JsonProperty("tp")]
        public long Tp { get; set; }

        [JsonProperty("user")]
        public object User { get; set; }

        [JsonProperty("bot")]
        public string Bot { get; set; }

        [JsonProperty("target")]
        public object Target { get; set; }

        [JsonProperty("party")]
        public string Party { get; set; }

        [JsonProperty("standed")]
        public Standed Standed { get; set; }

        [JsonProperty("focus")]
        public string Focus { get; set; }
    }

    public partial class Acx
    {
    }

    public partial class Base
    {
        [JsonProperty("h")]
        public long H { get; set; }

        [JsonProperty("v")]
        public long V { get; set; }

        [JsonProperty("vn")]
        public long Vn { get; set; }
    }

    public partial class Cx
    {
        [JsonProperty("hair")]
        public string Hair { get; set; }

        [JsonProperty("head")]
        public string Head { get; set; }
    }

    public partial class Cxc
    {
        [JsonProperty("bg")]
        public Standed Bg { get; set; }

        [JsonProperty("marmor12bcopy")]
        public Standed Marmor12Bcopy { get; set; }

        [JsonProperty("hairdo520")]
        public Fmakeup03 Hairdo520 { get; set; }

        [JsonProperty("mskin1b")]
        public Fmakeup03 Mskin1B { get; set; }

        [JsonProperty("fmakeup03")]
        public Fmakeup03 Fmakeup03 { get; set; }

        [JsonProperty("weaponstaff")]
        public Fmakeup03 Weaponstaff { get; set; }
    }

    public partial class Standed
    {
        [JsonProperty("x")]
        public double X { get; set; }

        [JsonProperty("y")]
        public long Y { get; set; }

        [JsonProperty("width")]
        public long Width { get; set; }

        [JsonProperty("height")]
        public long Height { get; set; }

        [JsonProperty("alpha")]
        public long Alpha { get; set; }

        [JsonProperty("visible")]
        public bool Visible { get; set; }

        [JsonProperty("stype", NullValueHandling = NullValueHandling.Ignore)]
        public string Stype { get; set; }

        [JsonProperty("zy")]
        public double Zy { get; set; }

        [JsonProperty("name")]
        public object Name { get; set; }

        [JsonProperty("skin", NullValueHandling = NullValueHandling.Ignore)]
        public string Skin { get; set; }
    }

    public partial class Fmakeup03
    {
        [JsonProperty("x")]
        public long X { get; set; }

        [JsonProperty("y")]
        public long Y { get; set; }

        [JsonProperty("width")]
        public long Width { get; set; }

        [JsonProperty("height")]
        public long Height { get; set; }

        [JsonProperty("alpha")]
        public long Alpha { get; set; }

        [JsonProperty("visible")]
        public bool Visible { get; set; }

        [JsonProperty("cskin", NullValueHandling = NullValueHandling.Ignore)]
        public string Cskin { get; set; }

        [JsonProperty("i", NullValueHandling = NullValueHandling.Ignore)]
        public long? I { get; set; }

        [JsonProperty("frames", NullValueHandling = NullValueHandling.Ignore)]
        public long? Frames { get; set; }

        [JsonProperty("skin")]
        public string Skin { get; set; }

        [JsonProperty("stype")]
        public string Stype { get; set; }

        [JsonProperty("updates")]
        public long Updates { get; set; }

        [JsonProperty("y_disp", NullValueHandling = NullValueHandling.Ignore)]
        public long? YDisp { get; set; }

        [JsonProperty("zy")]
        public double Zy { get; set; }

        [JsonProperty("moved", NullValueHandling = NullValueHandling.Ignore)]
        public bool? Moved { get; set; }

        [JsonProperty("name")]
        public object Name { get; set; }

        [JsonProperty("j", NullValueHandling = NullValueHandling.Ignore)]
        public long? J { get; set; }
    }

    public partial class Item
    {
        [JsonProperty("q", NullValueHandling = NullValueHandling.Ignore)]
        public long? Q { get; set; }

        [JsonProperty("name")]
        public string Name { get; set; }
    }

    public partial class Listener
    {
        [JsonProperty("id")]
        public string Id { get; set; }

        [JsonProperty("event")]
        public string Event { get; set; }

        [JsonProperty("one", NullValueHandling = NullValueHandling.Ignore)]
        public bool? One { get; set; }
    }

    public partial class NameTag
    {
        [JsonProperty("x")]
        public long X { get; set; }

        [JsonProperty("y")]
        public long Y { get; set; }

        [JsonProperty("width")]
        public long Width { get; set; }

        [JsonProperty("height")]
        public long Height { get; set; }

        [JsonProperty("alpha")]
        public long Alpha { get; set; }

        [JsonProperty("visible")]
        public bool Visible { get; set; }

        [JsonProperty("fillAlpha")]
        public long FillAlpha { get; set; }

        [JsonProperty("lineWidth")]
        public long LineWidth { get; set; }

        [JsonProperty("nativeLines")]
        public bool NativeLines { get; set; }

        [JsonProperty("lineColor")]
        public long LineColor { get; set; }

        [JsonProperty("lineAlignment")]
        public double LineAlignment { get; set; }

        [JsonProperty("graphicsData")]
        public GraphicsDatum[] GraphicsData { get; set; }

        [JsonProperty("tint")]
        public long Tint { get; set; }

        [JsonProperty("currentPath")]
        public object CurrentPath { get; set; }

        [JsonProperty("isMask")]
        public bool IsMask { get; set; }

        [JsonProperty("boundsPadding")]
        public long BoundsPadding { get; set; }

        [JsonProperty("dirty")]
        public long Dirty { get; set; }

        [JsonProperty("fastRectDirty")]
        public long FastRectDirty { get; set; }

        [JsonProperty("clearDirty")]
        public long ClearDirty { get; set; }

        [JsonProperty("boundsDirty")]
        public long BoundsDirty { get; set; }

        [JsonProperty("cachedSpriteDirty")]
        public bool CachedSpriteDirty { get; set; }

        [JsonProperty("filling")]
        public bool Filling { get; set; }

        [JsonProperty("fillColor")]
        public object FillColor { get; set; }

        [JsonProperty("zy")]
        public long Zy { get; set; }

        [JsonProperty("name")]
        public object Name { get; set; }
    }

    public partial class GraphicsDatum
    {
        [JsonProperty("lineWidth")]
        public long LineWidth { get; set; }

        [JsonProperty("lineAlignment")]
        public double LineAlignment { get; set; }

        [JsonProperty("nativeLines")]
        public bool NativeLines { get; set; }

        [JsonProperty("lineColor")]
        public long LineColor { get; set; }

        [JsonProperty("fillColor")]
        public long FillColor { get; set; }

        [JsonProperty("fillAlpha")]
        public long FillAlpha { get; set; }

        [JsonProperty("fill")]
        public bool Fill { get; set; }

        [JsonProperty("holes")]
        public object[] Holes { get; set; }

        [JsonProperty("shape")]
        public Shape Shape { get; set; }

        [JsonProperty("type")]
        public long Type { get; set; }
    }

    public partial class Shape
    {
        [JsonProperty("x")]
        public long X { get; set; }

        [JsonProperty("y")]
        public long Y { get; set; }

        [JsonProperty("width")]
        public long Width { get; set; }

        [JsonProperty("height")]
        public long Height { get; set; }

        [JsonProperty("type")]
        public long Type { get; set; }
    }

    public partial class S
    {
        [JsonProperty("mluck")]
        public Mluck Mluck { get; set; }
    }

    public partial class Mluck
    {
        [JsonProperty("ms")]
        public long Ms { get; set; }

        [JsonProperty("f")]
        public string F { get; set; }
    }

    public partial class Slots
    {
        [JsonProperty("ring1")]
        public object Ring1 { get; set; }

        [JsonProperty("ring2")]
        public object Ring2 { get; set; }

        [JsonProperty("earring1")]
        public object Earring1 { get; set; }

        [JsonProperty("earring2")]
        public object Earring2 { get; set; }

        [JsonProperty("belt")]
        public Amulet Belt { get; set; }

        [JsonProperty("mainhand")]
        public Helmet Mainhand { get; set; }

        [JsonProperty("offhand")]
        public Amulet Offhand { get; set; }

        [JsonProperty("helmet")]
        public Helmet Helmet { get; set; }

        [JsonProperty("chest")]
        public object Chest { get; set; }

        [JsonProperty("pants")]
        public object Pants { get; set; }

        [JsonProperty("shoes")]
        public Helmet Shoes { get; set; }

        [JsonProperty("gloves")]
        public Amulet Gloves { get; set; }

        [JsonProperty("amulet")]
        public Amulet Amulet { get; set; }

        [JsonProperty("orb")]
        public object Orb { get; set; }

        [JsonProperty("elixir")]
        public object Elixir { get; set; }

        [JsonProperty("cape")]
        public object Cape { get; set; }

        [JsonProperty("trade1")]
        public Trade Trade1 { get; set; }

        [JsonProperty("trade2")]
        public Trade Trade2 { get; set; }

        [JsonProperty("trade3")]
        public Trade Trade3 { get; set; }

        [JsonProperty("trade4")]
        public Trade Trade4 { get; set; }

        [JsonProperty("trade5")]
        public object Trade5 { get; set; }

        [JsonProperty("trade6")]
        public object Trade6 { get; set; }

        [JsonProperty("trade7")]
        public object Trade7 { get; set; }

        [JsonProperty("trade8")]
        public Trade Trade8 { get; set; }

        [JsonProperty("trade9")]
        public object Trade9 { get; set; }

        [JsonProperty("trade10")]
        public object Trade10 { get; set; }

        [JsonProperty("trade11")]
        public Trade Trade11 { get; set; }

        [JsonProperty("trade12")]
        public Trade Trade12 { get; set; }

        [JsonProperty("trade13")]
        public Trade Trade13 { get; set; }

        [JsonProperty("trade14")]
        public Trade Trade14 { get; set; }

        [JsonProperty("trade15")]
        public Trade Trade15 { get; set; }

        [JsonProperty("trade16")]
        public object Trade16 { get; set; }
    }

    public partial class Amulet
    {
        [JsonProperty("name")]
        public string Name { get; set; }

        [JsonProperty("level")]
        public long Level { get; set; }
    }

    public partial class Helmet
    {
        [JsonProperty("name")]
        public string Name { get; set; }

        [JsonProperty("gift")]
        public long Gift { get; set; }

        [JsonProperty("level")]
        public long Level { get; set; }
    }

    public partial class Trade
    {
        [JsonProperty("price")]
        public long Price { get; set; }

        [JsonProperty("level")]
        public long Level { get; set; }

        [JsonProperty("rid")]
        public string Rid { get; set; }

        [JsonProperty("name")]
        public string Name { get; set; }

        [JsonProperty("gift", NullValueHandling = NullValueHandling.Ignore)]
        public long? Gift { get; set; }
    }

    public partial class Stats
    {
        [JsonProperty("str")]
        public long Str { get; set; }

        [JsonProperty("dex")]
        public long Dex { get; set; }

        [JsonProperty("int")]
        public long Int { get; set; }

        [JsonProperty("vit")]
        public long Vit { get; set; }

        [JsonProperty("for")]
        public long For { get; set; }
    }
}
