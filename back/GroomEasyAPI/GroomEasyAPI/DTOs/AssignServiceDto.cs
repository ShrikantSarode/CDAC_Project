namespace GroomEasyAPI.DTOs
{
    public class AssignServiceDto
    {
        public int StaffId { get; set; }
        public List<int> ServiceIds { get; set; }
    }

    public class RemoveServiceDto
    {
        public int StaffId { get; set; }
        public int ServiceId { get; set; }
    }
}
