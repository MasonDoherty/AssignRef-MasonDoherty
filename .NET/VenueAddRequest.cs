using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Requests.Venues
{
    public class VenueAddRequest
    {
        [Required]
        [MaxLength(255)]
        public string Name { get; set; }
        
        [MaxLength(4000)]
        public string Description { get; set; }
        [Required]
        [Range(1, int.MaxValue)]
        public int LocationId { get; set; }
        
        [MaxLength(255)]
        public string Url { get; set; }
        [Required]
        [MaxLength (255)]
        public string PrimaryImageUrL { get; set; }

    }
}
