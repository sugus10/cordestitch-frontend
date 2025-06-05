import Link from "next/link";

export default function PrivacyPolicyContent() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight mb-2">Privacy Policy</h2>
        <div className="h-1 w-16 bg-primary/70 rounded-full mb-4"></div>
        <p className="text-muted-foreground">
          This Privacy Policy explains how Cordestitch collects, uses, and protects your personal information when you use our website and services.
        </p>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-xl font-semibold flex items-center">
          <span className="bg-primary/10 text-primary w-8 h-8 inline-flex items-center justify-center rounded-full mr-2 text-sm font-bold">1</span>
          Information We Collect
        </h3>
        <p>
          We collect information you provide when you:
        </p>
        <div className="bg-muted/30 rounded-lg p-5 space-y-3 mt-2">
          <div className="flex items-start">
            <span className="mr-2 text-primary font-bold">•</span>
            <p>Create an account or place an order</p>
          </div>
          <div className="flex items-start">
            <span className="mr-2 text-primary font-bold">•</span>
            <p>Contact our customer service team</p>
          </div>
          <div className="flex items-start">
            <span className="mr-2 text-primary font-bold">•</span>
            <p>Participate in surveys or promotions</p>
          </div>
          <div className="flex items-start">
            <span className="mr-2 text-primary font-bold">•</span>
            <p>Upload designs for custom t-shirts</p>
          </div>
          <div className="flex items-start">
            <span className="mr-2 text-primary font-bold">•</span>
            <p>Sign up for our newsletter</p>
          </div>
        </div>
        <div className="bg-card rounded-lg p-5 border shadow-sm mt-4">
          <p>
            This information may include your name, email address, phone number, billing and shipping addresses, payment details, and any personalization data for your custom t-shirt designs.
          </p>
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-xl font-semibold flex items-center">
          <span className="bg-primary/10 text-primary w-8 h-8 inline-flex items-center justify-center rounded-full mr-2 text-sm font-bold">2</span>
          How We Use Your Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
          <div className="bg-card border-l-4 border-l-primary/70 shadow-sm rounded-lg p-5 hover:shadow-md transition-shadow">
            <h4 className="font-semibold mb-2 text-primary/90">Order Processing</h4>
            <p className="text-muted-foreground">
              Process and fulfill your orders and communicate about your account
            </p>
          </div>
          
          <div className="bg-card border-l-4 border-l-primary/70 shadow-sm rounded-lg p-5 hover:shadow-md transition-shadow">
            <h4 className="font-semibold mb-2 text-primary/90">Service Improvement</h4>
            <p className="text-muted-foreground">
              Improve our website and personalize your shopping experience
            </p>
          </div>
          
          <div className="bg-card border-l-4 border-l-primary/70 shadow-sm rounded-lg p-5 hover:shadow-md transition-shadow">
            <h4 className="font-semibold mb-2 text-primary/90">Marketing</h4>
            <p className="text-muted-foreground">
              Send marketing communications (with your consent)
            </p>
          </div>
        </div>
        <div className="bg-card rounded-lg p-5 border shadow-sm mt-4">
          <p>
            We also use your information to comply with legal obligations and protect against fraudulent activities.
          </p>
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-xl font-semibold flex items-center">
          <span className="bg-primary/10 text-primary w-8 h-8 inline-flex items-center justify-center rounded-full mr-2 text-sm font-bold">3</span>
          Cookies and Tracking Technologies
        </h3>
        <div className="bg-card border shadow-sm rounded-lg overflow-hidden mt-4">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead className="bg-muted/50">
                <tr>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Technology
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Purpose
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Control
                  </th>
                </tr>
              </thead>
              <tbody className="bg-card divide-y divide-border">
                <tr className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">Essential Cookies</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">Website functionality and security</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">Cannot be disabled</td>
                </tr>
                <tr className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">Analytics Cookies</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">Understand user behavior</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">Manage in cookie settings</td>
                </tr>
                <tr className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">Marketing Cookies</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">Personalized advertising</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">Manage in cookie settings</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mt-2 italic">
          You can manage your cookie preferences through your browser settings or our cookie consent tool.
        </p>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-xl font-semibold flex items-center">
          <span className="bg-primary/10 text-primary w-8 h-8 inline-flex items-center justify-center rounded-full mr-2 text-sm font-bold">4</span>
          Sharing Your Information
        </h3>
        <p>
          We may share your information with:
        </p>
        <div className="bg-muted/30 rounded-lg p-6 space-y-4">
          <div className="flex items-start">
            <div className="bg-primary/10 text-primary w-8 h-8 inline-flex items-center justify-center rounded-full mr-2 text-sm font-bold">1</div>
            <p><strong>Service providers</strong> who help us operate our business (payment processors, shipping companies)</p>
          </div>
          <div className="flex items-start">
            <div className="bg-primary/10 text-primary w-8 h-8 inline-flex items-center justify-center rounded-full mr-2 text-sm font-bold">2</div>
            <p><strong>Professional advisors</strong> (lawyers, accountants) when required</p>
          </div>
          <div className="flex items-start">
            <div className="bg-primary/10 text-primary w-8 h-8 inline-flex items-center justify-center rounded-full mr-2 text-sm font-bold">3</div>
            <p><strong>Government authorities</strong> when required by law</p>
          </div>
        </div>
        <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg border border-green-200 dark:border-green-800/30 mt-4">
          <p className="text-green-800 dark:text-green-500 font-medium">
            We do not sell your personal information to third parties.
          </p>
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-xl font-semibold flex items-center">
          <span className="bg-primary/10 text-primary w-8 h-8 inline-flex items-center justify-center rounded-full mr-2 text-sm font-bold">5</span>
          Your Rights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div className="bg-card border-l-4 border-l-primary/70 shadow-sm rounded-lg p-5 hover:shadow-md transition-shadow">
            <h4 className="font-semibold mb-2 text-primary/90">Access & Correction</h4>
            <p className="text-muted-foreground">
              Access the personal information we hold about you and correct inaccuracies
            </p>
          </div>
          
          <div className="bg-card border-l-4 border-l-primary/70 shadow-sm rounded-lg p-5 hover:shadow-md transition-shadow">
            <h4 className="font-semibold mb-2 text-primary/90">Deletion</h4>
            <p className="text-muted-foreground">
              Request deletion of your personal information in certain circumstances
            </p>
          </div>
          
          <div className="bg-card border-l-4 border-l-primary/70 shadow-sm rounded-lg p-5 hover:shadow-md transition-shadow">
            <h4 className="font-semibold mb-2 text-primary/90">Objection</h4>
            <p className="text-muted-foreground">
              Object to or restrict processing of your personal information
            </p>
          </div>
          
          <div className="bg-card border-l-4 border-l-primary/70 shadow-sm rounded-lg p-5 hover:shadow-md transition-shadow">
            <h4 className="font-semibold mb-2 text-primary/90">Data Portability</h4>
            <p className="text-muted-foreground">
              Receive a copy of your data in a structured, machine-readable format
            </p>
          </div>
        </div>
        <div className="bg-card rounded-lg p-5 border shadow-sm mt-4">
          <p>
            To exercise these rights, please contact us at <a href="mailto:privacy@cordestitch.com" className="text-primary hover:underline">privacy@cordestitch.com</a>.
          </p>
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-xl font-semibold flex items-center">
          <span className="bg-primary/10 text-primary w-8 h-8 inline-flex items-center justify-center rounded-full mr-2 text-sm font-bold">6</span>
          Data Security
        </h3>
        <div className="bg-card rounded-lg p-5 border shadow-sm">
          <p>
            We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, accidental loss, or damage. These include:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="bg-white dark:bg-black/20 rounded-lg p-4 border border-primary/20 shadow-sm">
              <h4 className="font-semibold mb-2 text-primary/90">Encryption</h4>
              <p className="text-sm text-muted-foreground">Data encryption in transit and at rest</p>
            </div>
            <div className="bg-white dark:bg-black/20 rounded-lg p-4 border border-primary/20 shadow-sm">
              <h4 className="font-semibold mb-2 text-primary/90">Access Controls</h4>
              <p className="text-sm text-muted-foreground">Strict access controls to personal data</p>
            </div>
            <div className="bg-white dark:bg-black/20 rounded-lg p-4 border border-primary/20 shadow-sm">
              <h4 className="font-semibold mb-2 text-primary/90">Regular Audits</h4>
              <p className="text-sm text-muted-foreground">Regular security assessments and audits</p>
            </div>
          </div>
          <p className="mt-4 italic text-sm text-muted-foreground">
            While we implement these security measures, no internet transmission is ever completely secure, so we cannot guarantee absolute security.
          </p>
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-xl font-semibold flex items-center">
          <span className="bg-primary/10 text-primary w-8 h-8 inline-flex items-center justify-center rounded-full mr-2 text-sm font-bold">7</span>
          Policy Updates
        </h3>
        <div className="bg-amber-50 dark:bg-amber-950/20 p-6 rounded-lg border border-amber-200 dark:border-amber-800/30">
          <p>
            We may update this Privacy Policy from time to time. When we do, we'll:
          </p>
          <div className="mt-4 space-y-3">
            <div className="flex items-start">
              <span className="mr-2 text-amber-700 dark:text-amber-500 font-bold">•</span>
              <p>Post the new policy on our website</p>
            </div>
            <div className="flex items-start">
              <span className="mr-2 text-amber-700 dark:text-amber-500 font-bold">•</span>
              <p>Update the "Last Updated" date</p>
            </div>
            <div className="flex items-start">
              <span className="mr-2 text-amber-700 dark:text-amber-500 font-bold">•</span>
              <p>Notify you of material changes via email (if we have your contact information)</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="space-y-4 bg-primary/5 p-6 rounded-lg mt-8">
        <h3 className="text-xl font-semibold">Contact Us</h3>
        <p>
          For privacy-related questions or concerns, please contact our Data Protection Officer:
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
              <a href="mailto:privacy@cordestitch.com" className="text-primary hover:underline font-medium">
                privacy@cordestitch.com
              </a>
            </div>
          </div>
          <div className="flex items-center">
            <div className="bg-primary/10 p-3 rounded-full mr-3">
              <svg className="h-5 w-5 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Address</p>
              <p className="font-medium">
                584, 1st floor, RD Rajanna Complex,<br/>
                Rajanukunte, Yelahanka Taluk,<br/>
                Bengaluru North 560064
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}