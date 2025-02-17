namespace GroomEasyAPI.Models
{
    public class Payment
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public User User { get; set; }
        public int AppointmentId { get; set; }
        public Appointment Appointment { get; set; }
        public float Amount { get; set; }
        public string PaymentStatus { get; set; }
        public string TransactionId { get; set; }
        public DateTime PaymentDate { get; set; }
    }
}
