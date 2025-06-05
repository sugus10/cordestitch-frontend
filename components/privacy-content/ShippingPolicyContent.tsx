import Link from "next/link";

export default function ShippingPolicyContent() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight mb-2">Shipping Policy</h2>
        <div className="h-1 w-16 bg-primary/70 rounded-full mb-4"></div>
        <p className="text-muted-foreground">
          At Cordestitch, we strive to provide fast, reliable shipping for all your custom t-shirt orders. This policy outlines our shipping processes, timeframes, and options.
        </p>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-xl font-semibold flex items-center">
          <span className="bg-primary/10 text-primary w-8 h-8 inline-flex items-center justify-center rounded-full mr-2 text-sm font-bold">1</span>
          Processing Times
        </h3>
        <p>
          Custom t-shirt orders require time for design verification, production, and quality control before shipping:
        </p>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-card border-l-4 border-l-primary/70 shadow-sm rounded-lg p-5 hover:shadow-md transition-shadow">
            <h4 className="font-semibold mb-2 text-primary/90">Standard Orders</h4>
            <p className="text-muted-foreground">
              3-5 business days processing time
            </p>
          </div>
          
          <div className="bg-card border-l-4 border-l-primary/70 shadow-sm rounded-lg p-5 hover:shadow-md transition-shadow">
            <h4 className="font-semibold mb-2 text-primary/90">Bulk Orders (10+ items)</h4>
            <p className="text-muted-foreground">
              5-7 business days processing time
            </p>
          </div>
          
          <div className="bg-card border-l-4 border-l-primary/70 shadow-sm rounded-lg p-5 hover:shadow-md transition-shadow">
            <h4 className="font-semibold mb-2 text-primary/90">Complex Custom Designs</h4>
            <p className="text-muted-foreground">
              May require additional processing time
            </p>
          </div>
        </div>
        <p className="mt-4 italic">
          Processing time begins once your order and payment are confirmed and any design approvals are complete.
        </p>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-xl font-semibold flex items-center">
          <span className="bg-primary/10 text-primary w-8 h-8 inline-flex items-center justify-center rounded-full mr-2 text-sm font-bold">2</span>
          Shipping Methods and Timeframes
        </h3>
        <div className="bg-card border shadow-sm rounded-lg overflow-hidden mt-4">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead className="bg-muted/50">
                <tr>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Shipping Method
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Estimated Delivery
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Cost
                  </th>
                </tr>
              </thead>
              <tbody className="bg-card divide-y divide-border">
                <tr className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">Standard Shipping</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">5-7 business days</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">₹ 200 <span className="text-green-600 text-xs ml-1">(Free for orders over ₹ 2000)</span></td>
                </tr>
                <tr className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">Expedited Shipping</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">2-3 business days</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">₹ 200</td>
                </tr>
                <tr className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">Express Shipping</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">1-2 business days</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">₹ 2000</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mt-2 italic">
          Note: Shipping timeframes are estimates and do not include processing times.
        </p>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-xl font-semibold flex items-center">
          <span className="bg-primary/10 text-primary w-8 h-8 inline-flex items-center justify-center rounded-full mr-2 text-sm font-bold">3</span>
          Tracking Your Order
        </h3>
        <p>
          Once your order ships, you will receive a confirmation email with tracking information. You can also track your order by:
        </p>
        <div className="bg-muted/30 rounded-lg p-6 space-y-4">
          <div className="flex items-start">
            <div className="bg-primary/10 text-primary w-8 h-8 inline-flex items-center justify-center rounded-full mr-2 text-sm font-bold">1</div>
            <p>Logging into your Cordestitch account</p>
          </div>
          <div className="flex items-start">
            <div className="bg-primary/10 text-primary w-8 h-8 inline-flex items-center justify-center rounded-full mr-2 text-sm font-bold">2</div>
            <p>Using the tracking link in your shipping confirmation email</p>
          </div>
          <div className="flex items-start">
            <div className="bg-primary/10 text-primary w-8 h-8 inline-flex items-center justify-center rounded-full mr-2 text-sm font-bold">3</div>
            <p>Contacting our customer service team</p>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-xl font-semibold flex items-center">
          <span className="bg-primary/10 text-primary w-8 h-8 inline-flex items-center justify-center rounded-full mr-2 text-sm font-bold">4</span>
          International Shipping
        </h3>
        <p>
          We ship to most countries worldwide. Please note:
        </p>
        <div className="bg-muted/30 rounded-lg p-5 space-y-3 mt-2">
          <div className="flex items-start">
            <span className="mr-2 text-primary font-bold">•</span>
            <p>International orders may be subject to customs fees, taxes, or duties upon arrival. These charges are the responsibility of the recipient.</p>
          </div>
          <div className="flex items-start">
            <span className="mr-2 text-primary font-bold">•</span>
            <p>Delivery times for international orders may vary due to customs processing and local delivery conditions.</p>
          </div>
          <div className="flex items-start">
            <span className="mr-2 text-primary font-bold">•</span>
            <p>Some countries may have restrictions on textile imports. Please check your local regulations before placing an order.</p>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-xl font-semibold flex items-center">
          <span className="bg-primary/10 text-primary w-8 h-8 inline-flex items-center justify-center rounded-full mr-2 text-sm font-bold">5</span>
          Shipping Restrictions
        </h3>
        <div className="bg-card rounded-lg p-5 border shadow-sm">
          <p>
            We currently cannot ship to P.O. boxes or APO/FPO addresses. For certain remote locations, additional shipping charges may apply.
          </p>
        </div>
      </div>
      
      <div className="space-y-4 bg-amber-50 dark:bg-amber-950/20 p-6 rounded-lg border border-amber-200 dark:border-amber-800/30">
        <h3 className="text-xl font-semibold flex items-center text-amber-800 dark:text-amber-500">
          <span className="bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-500 w-8 h-8 inline-flex items-center justify-center rounded-full mr-2 text-sm font-bold">!</span>
          Order Issues
        </h3>
        <p>
          If you encounter any issues with your shipment, please contact us within 7 days of delivery. We address the following situations:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="bg-white dark:bg-black/20 rounded-lg p-4 border border-amber-100 dark:border-amber-900/30 shadow-sm">
            <h4 className="font-semibold mb-2 text-amber-700 dark:text-amber-500">Lost Packages</h4>
            <p className="text-sm">If tracking shows no movement for 7 days, please contact us.</p>
          </div>
          <div className="bg-white dark:bg-black/20 rounded-lg p-4 border border-amber-100 dark:border-amber-900/30 shadow-sm">
            <h4 className="font-semibold mb-2 text-amber-700 dark:text-amber-500">Damaged Packages</h4>
            <p className="text-sm">Please take photos of the damaged packaging and contents and contact us immediately.</p>
          </div>
          <div className="bg-white dark:bg-black/20 rounded-lg p-4 border border-amber-100 dark:border-amber-900/30 shadow-sm">
            <h4 className="font-semibold mb-2 text-amber-700 dark:text-amber-500">Incorrect Items</h4>
            <p className="text-sm">Contact us with your order number and details of the issue.</p>
          </div>
        </div>
      </div>
      
      <div className="space-y-4 bg-primary/5 p-6 rounded-lg mt-8">
        <h3 className="text-xl font-semibold">Contact Us</h3>
        <p>
          For shipping-related questions or concerns, please contact our customer service team:
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
              <a href="mailto:shipping@cordestitch.com" className="text-primary hover:underline font-medium">
                shipping@cordestitch.com
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