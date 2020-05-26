using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace Adventure.Land.CS.Automation
{
    public class CreateImages
    {
        public void Create()
        {
            string itemsTilesetPath = @"D:\Steam\steamapps\common\adventureland\resources\app\files\images\tiles\items\pack_20.png";
            string imagePositionsPath = @"C:\Users\Patrick\Documents\AdventureLand\AL.CS\Adventure.Land.CS\Adventure.Land.CS\wwwroot\imagePositions.json";
            string itemsDataPath = @"C:\Users\Patrick\Documents\AdventureLand\AL.CS\Adventure.Land.CS\Adventure.Land.CS\wwwroot\items.json";
            string imagesOutFolderPath = @"C:\Users\Patrick\Documents\AdventureLand\AL.CS\Adventure.Land.CS\Adventure.Land.CS\wwwroot\images\";
            string itemImagesOutFolderPath = Path.Combine(imagesOutFolderPath, "items");

            // Make sure the out dir exists
            Directory.CreateDirectory(itemImagesOutFolderPath);

            ImagePosition[] imagePositions = JsonConvert.DeserializeObject<ImagePosition[]>(File.ReadAllText(imagePositionsPath));
            Bitmap imagesTileset = new Bitmap(itemsTilesetPath);
            Items[] items = JsonConvert.DeserializeObject<Items[]>(File.ReadAllText(itemsDataPath));


            foreach(Items item in items)
            {
                try
                {
                    // Cut out the sub image for this item
                    Bitmap itemImage = imagesTileset.Clone(GetItemImageRect(item, imagePositions), imagesTileset.PixelFormat);

                    // Save the image
                    string imageFilePath = Path.Combine(itemImagesOutFolderPath, $"{item.Name}.png");
                    itemImage.Save(imageFilePath);
                }
                catch (Exception ex)
                {

                }
            }
        }

        private Rectangle GetItemImageRect(Items item, ImagePosition[] imagePositions)
        {
            ImagePosition itemImagePosition = imagePositions.FirstOrDefault(pos => pos.Name == item.Name);

            if(null == itemImagePosition)
            {
                throw new Exception();
            }

            return new Rectangle(
                int.Parse(itemImagePosition.X) * 20,
                int.Parse(itemImagePosition.Y) * 20, 
                20, 20);
        }
    }
}

