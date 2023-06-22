using Sabio.Models.Domain.Locations;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Domain
{
    public class BaseVenue
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public Location Location { get; set; }
        public string PrimaryImageUrl { get; set; }

    }
}
