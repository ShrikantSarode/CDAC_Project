namespace GroomEasyAPI.DTOs
{
    public class PaymentVerificationDTO
    {
        public int AppointmentId { get; set; }
        public string OrderId { get; set; }
        public string PaymentId { get; set; }
        public string Signature { get; set; }
    }
}
