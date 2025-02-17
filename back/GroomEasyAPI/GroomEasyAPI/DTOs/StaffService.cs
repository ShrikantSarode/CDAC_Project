namespace GroomEasyAPI.Models
{
    public class StaffService
    {
        public int Id { get; set; }
        public int StaffId { get; set; }
        public int ServiceId { get; set; }

        public virtual User Staff { get; set; }
        public virtual Service Service { get; set; }
    }
}
