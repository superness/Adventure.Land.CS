using System;
using System.Collections.Generic;

using System.Globalization;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace Adventure.Land.CS.Automation
{
    public partial class ImagePosition
    {
        [JsonProperty("name")]
        public string Name { get; set; }

        [JsonProperty("x")]
        public string X { get; set; }

        [JsonProperty("y")]
        public string Y { get; set; }
    }
}
