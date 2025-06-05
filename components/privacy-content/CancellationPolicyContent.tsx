export default function CancellationPolicyContent() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight mb-2">Cancellation Policy</h2>
        <div className="h-1 w-16 bg-primary/70 rounded-full mb-4"></div>
        <p className="text-muted-foreground">
          We understand that circumstances change. This policy explains how to cancel an order and what limitations may apply.
        </p>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-xl font-semibold flex items-center">
          <span className="bg-primary/10 text-primary w-8 h-8 inline-flex items-center justify-center rounded-full mr-2 text-sm font-bold">1</span>
          Order Cancellation Window
        </h3>
        <p>
          You may cancel your order without penalty under these conditions:
        </p>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-card border-l-4 border-l-primary/70 shadow-sm rounded-lg p-5 hover:shadow-md transition-shadow">
            <h4 className="font-semibold mb-2 text-primary/90">Standard Orders</h4>
            <p className="text-muted-foreground">
              Can be cancelled within 2 hours of placing the order
            </p>
          </div>
          
          <div className="bg-card border-l-4 border-l-primary/70 shadow-sm rounded-lg p-5 hover:shadow-md transition-shadow">
            <h4 className="font-semibold mb-2 text-primary/90">Bulk Orders</h4>
            <p className="text-muted-foreground">
              Can be cancelled within 24 hours of placing the order
            </p>
          </div>
          
          <div className="bg-card border-l-4 border-l-primary/70 shadow-sm rounded-lg p-5 hover:shadow-md transition-shadow">
            <h4 className="font-semibold mb-2 text-primary/90">Pre-designed Items</h4>
            <p className="text-muted-foreground">
              Can be cancelled until the order status changes to "Processing"
            </p>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-xl font-semibold flex items-center">
          <span className="bg-primary/10 text-primary w-8 h-8 inline-flex items-center justify-center rounded-full mr-2 text-sm font-bold">2</span>
          How to Cancel an Order
        </h3>
        <p>
          To cancel an order within the eligible timeframe:
        </p>
        <div className="bg-muted/30 rounded-lg p-6 space-y-4">
          <div className="flex items-start">
            <div className="bg-primary/10 text-primary w-8 h-8 inline-flex items-center justify-center rounded-full mr-2 text-sm font-bold">1</div>
            <p>Log into your Cordestitch account and navigate to "Order History"</p>
          </div>
          <div className="flex items-start">
            <div className="bg-primary/10 text-primary w-8 h-8 inline-flex items-center justify-center rounded-full mr-2 text-sm font-bold">2</div>
            <p>Find the order you wish to cancel and select "Cancel Order"</p>
          </div>
          <div className="flex items-start">
            <div className="bg-primary/10 text-primary w-8 h-8 inline-flex items-center justify-center rounded-full mr-2 text-sm font-bold">3</div>
            <p>Provide a reason for cancellation when prompted</p>
          </div>
          <div className="flex items-start">
            <div className="bg-primary/10 text-primary w-8 h-8 inline-flex items-center justify-center rounded-full mr-2 text-sm font-bold">4</div>
            <p>Confirm your cancellation request</p>
          </div>
        </div>
        <p className="mt-4 italic">
          Alternatively, you can contact our customer service team via email or phone with your order number and cancellation request.
        </p>
      </div>
      
      <div className="space-y-4 bg-destructive/5 p-6 rounded-lg border border-destructive/20">
        <h3 className="text-xl font-semibold flex items-center text-destructive/80">
          <span className="bg-destructive/10 text-destructive w-8 h-8 inline-flex items-center justify-center rounded-full mr-2 text-sm font-bold">!</span>
          Cancellation Limitations
        </h3>
        <p className="font-medium">
          Orders cannot be cancelled once:
        </p>
        <ul className="space-y-2">
          {[
            "Production has begun",
            "The design has been approved and sent to printing",
            "The order status shows In Production or later stages"
          ].map((item, i) => (
            <li key={i} className="flex items-center">
              <span className="mr-2 text-destructive">•</span>
              {item}
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm border-t border-destructive/10 pt-4">
          For custom designs, once your design approval has been submitted, the order enters production and cannot be cancelled.
        </p>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-xl font-semibold flex items-center">
          <span className="bg-primary/10 text-primary w-8 h-8 inline-flex items-center justify-center rounded-full mr-2 text-sm font-bold">3</span>
          Refunds for Cancelled Orders
        </h3>
        <p>
          When an order is successfully cancelled:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {[
            "The full purchase amount will be refunded to your original payment method",
            "Refunds typically process within 3-5 business days, depending on your payment provider",
            "You will receive an email confirmation once the refund is processed"
          ].map((item, i) => (
            <div key={i} className="bg-card rounded-lg p-4 border shadow-sm">
              <p className="text-center">{item}</p>
            </div>
          ))}
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-xl font-semibold flex items-center">
          <span className="bg-primary/10 text-primary w-8 h-8 inline-flex items-center justify-center rounded-full mr-2 text-sm font-bold">4</span>
          Cancellation Fees
        </h3>
        <p>
          Cordestitch does not charge cancellation fees for orders cancelled within the eligible timeframes. However:
        </p>
        <div className="bg-muted/30 rounded-lg p-5 space-y-3 mt-2">
          <div className="flex items-start">
            <span className="mr-2 text-primary font-bold">•</span>
            <p>For bulk orders cancelled after 24 hours but before production, a 10% administrative fee may apply</p>
          </div>
          <div className="flex items-start">
            <span className="mr-2 text-primary font-bold">•</span>
            <p>For rush orders that have incurred prioritization costs, these costs may be non-refundable even if the order is cancelled</p>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-xl font-semibold flex items-center">
          <span className="bg-primary/10 text-primary w-8 h-8 inline-flex items-center justify-center rounded-full mr-2 text-sm font-bold">5</span>
          Order Modifications
        </h3>
        <p>
          If you need to modify rather than cancel your order:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
          <div className="bg-card rounded-lg p-4 border flex items-start">
            <span className="mr-2 text-primary">•</span>
            <p>Contact us as soon as possible</p>
          </div>
          <div className="bg-card rounded-lg p-4 border flex items-start">
            <span className="mr-2 text-primary">•</span>
            <p>Modifications are subject to the same timeframes as cancellations</p>
          </div>
          <div className="bg-card rounded-lg p-4 border flex items-start">
            <span className="mr-2 text-primary">•</span>
            <p>Some modifications may incur additional charges</p>
          </div>
          <div className="bg-card rounded-lg p-4 border flex items-start">
            <span className="mr-2 text-primary">•</span>
            <p>Size changes for standard t-shirts may be possible even after the cancellation window has closed</p>
          </div>
        </div>
      </div>
      
      <div className="space-y-4 bg-primary/5 p-6 rounded-lg mt-8">
        <h3 className="text-xl font-semibold">Contact Us</h3>
        <p>
          For questions about cancellations or to request a cancellation:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="flex items-center">
            <div className="bg-primary/10 p-3 rounded-full mr-3">
              <svg className="h-5 w-5 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <a href="mailto:orders@cordestitch.com" className="text-primary hover:underline font-medium">
                orders@cordestitch.com
              </a>
            </div>
          </div>
          <div className="flex items-center">
            <div className="bg-primary/10 p-3 rounded-full mr-3">
              <svg className="h-5 w-5 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Phone</p>
              <p className="font-medium">+91 7090007776</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}