import Link from "next/link";

export default function RefundPolicyContent() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight mb-2">Refund Policy</h2>
        <div className="h-1 w-16 bg-primary/70 rounded-full mb-4"></div>
        <p className="text-muted-foreground">
          At Cordestitch, we want you to be completely satisfied with your custom t-shirt purchase. This policy outlines our refund procedures and eligibility requirements.
        </p>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-xl font-semibold flex items-center">
          <span className="bg-primary/10 text-primary w-8 h-8 inline-flex items-center justify-center rounded-full mr-2 text-sm font-bold">1</span>
          Standard Refunds
        </h3>
        <p>
          We accept refund requests under the following conditions:
        </p>
        <div className="bg-muted/30 rounded-lg p-5 space-y-3 mt-2">
          <div className="flex items-start">
            <span className="mr-2 text-primary font-bold">•</span>
            <p>The item received is damaged or defective</p>
          </div>
          <div className="flex items-start">
            <span className="mr-2 text-primary font-bold">•</span>
            <p>The item received significantly differs from what was ordered</p>
          </div>
          <div className="flex items-start">
            <span className="mr-2 text-primary font-bold">•</span>
            <p>The wrong item was delivered</p>
          </div>
        </div>
        <div className="bg-card rounded-lg p-5 border shadow-sm mt-4">
          <p>
            Refund requests must be submitted within 14 days of receiving your order. To request a refund, please contact our customer service team with your order number and photos of the issue.
          </p>
        </div>
      </div>
      
      <div className="space-y-4 bg-amber-50 dark:bg-amber-950/20 p-6 rounded-lg border border-amber-200 dark:border-amber-800/30">
        <h3 className="text-xl font-semibold flex items-center text-amber-800 dark:text-amber-500">
          <span className="bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-500 w-8 h-8 inline-flex items-center justify-center rounded-full mr-2 text-sm font-bold">!</span>
          Custom Design Policy
        </h3>
        <p>
          Please note that due to the custom nature of our products:
        </p>
        <div className="mt-4 space-y-3">
          <div className="flex items-start">
            <span className="mr-2 text-amber-700 dark:text-amber-500 font-bold">•</span>
            <p><strong>We cannot accept returns or issue refunds</strong> for custom t-shirts simply because you changed your mind or made an error in your design submission.</p>
          </div>
          <div className="flex items-start">
            <span className="mr-2 text-amber-700 dark:text-amber-500 font-bold">•</span>
            <p>Before production, we will send a digital proof of your design for approval. Please review this carefully, as once approved, we are not responsible for design errors.</p>
          </div>
          <div className="flex items-start">
            <span className="mr-2 text-amber-700 dark:text-amber-500 font-bold">•</span>
            <p>Minor variations in color between your screen and the printed product are normal and not considered defects.</p>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-xl font-semibold flex items-center">
          <span className="bg-primary/10 text-primary w-8 h-8 inline-flex items-center justify-center rounded-full mr-2 text-sm font-bold">2</span>
          Refund Process
        </h3>
        <p>
          Once your refund request is approved:
        </p>
        <div className="bg-card border shadow-sm rounded-lg overflow-hidden mt-4">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead className="bg-muted/50">
                <tr>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Step
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Action
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Timeline
                  </th>
                </tr>
              </thead>
              <tbody className="bg-card divide-y divide-border">
                <tr className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">1</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">Confirmation email sent</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">Within 24 hours</td>
                </tr>
                <tr className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">2</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">Return item (if required)</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">Within 7 days</td>
                </tr>
                <tr className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">3</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">Refund processed</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">5-10 business days</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mt-2 italic">
          Refunds are issued to the original payment method.
        </p>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-xl font-semibold flex items-center">
          <span className="bg-primary/10 text-primary w-8 h-8 inline-flex items-center justify-center rounded-full mr-2 text-sm font-bold">3</span>
          Exchanges
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div className="bg-card border-l-4 border-l-primary/70 shadow-sm rounded-lg p-5 hover:shadow-md transition-shadow">
            <h4 className="font-semibold mb-2 text-primary/90">Standard Items</h4>
            <p className="text-muted-foreground">
              Exchanges available within 14 days for size or color changes
            </p>
          </div>
          
          <div className="bg-card border-l-4 border-l-primary/70 shadow-sm rounded-lg p-5 hover:shadow-md transition-shadow">
            <h4 className="font-semibold mb-2 text-primary/90">Custom Designs</h4>
            <p className="text-muted-foreground">
              Exchanges only for manufacturing defects
            </p>
          </div>
        </div>
        <div className="bg-card rounded-lg p-5 border shadow-sm mt-4">
          <p className="font-medium mb-2">Exchange process:</p>
          <div className="flex items-start">
            <span className="mr-2 text-primary font-bold">1.</span>
            <p>Contact customer service with order number and request details</p>
          </div>
          <div className="flex items-start mt-2">
            <span className="mr-2 text-primary font-bold">2.</span>
            <p>Return original item following provided instructions</p>
          </div>
          <div className="flex items-start mt-2">
            <span className="mr-2 text-primary font-bold">3.</span>
            <p>Replacement shipped after receiving returned item</p>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-xl font-semibold flex items-center">
          <span className="bg-primary/10 text-primary w-8 h-8 inline-flex items-center justify-center rounded-full mr-2 text-sm font-bold">4</span>
          Non-Refundable Items
        </h3>
        <div className="bg-card rounded-lg p-5 border shadow-sm">
          <p>
            The following items are not eligible for refunds or exchanges:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="flex items-start">
              <span className="mr-2 text-primary font-bold">•</span>
              <p>Custom designs matching approved proofs</p>
            </div>
            <div className="flex items-start">
              <span className="mr-2 text-primary font-bold">•</span>
              <p>"Final Sale" or discounted items</p>
            </div>
            <div className="flex items-start">
              <span className="mr-2 text-primary font-bold">•</span>
              <p>Delivered digital design services</p>
            </div>
            <div className="flex items-start">
              <span className="mr-2 text-primary font-bold">•</span>
              <p>Shipping fees (unless our error)</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="space-y-4 bg-green-50 dark:bg-green-950/20 p-6 rounded-lg border border-green-200 dark:border-green-800/30">
        <h3 className="text-xl font-semibold flex items-center text-green-800 dark:text-green-500">
          <span className="bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-500 w-8 h-8 inline-flex items-center justify-center rounded-full mr-2 text-sm font-bold">✓</span>
          Quality Guarantee
        </h3>
        <p>
          We stand behind the quality of our products. If your item has a manufacturing defect or premature breakdown under normal use within 30 days of purchase, we will provide a replacement or refund at our discretion.
        </p>
      </div>
      
      <div className="space-y-4 bg-primary/5 p-6 rounded-lg mt-8">
        <h3 className="text-xl font-semibold">Contact Us</h3>
        <p>
          For refund-related questions or to submit a refund request:
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
              <a href="mailto:returns@cordestitch.com" className="text-primary hover:underline font-medium">
                returns@cordestitch.com
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