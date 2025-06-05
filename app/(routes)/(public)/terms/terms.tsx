"use client";
import React from "react";
import { FileText, CheckCircle, AlertCircle, Info, Shield, ArrowLeft } from "lucide-react";
import Layout from "@/components/Layout";

const TermsAndConditions = () => {
  return (
    <Layout>
      <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen">
        <div className="container mx-auto max-w-5xl px-4 py-16">
          {/* Header */}
          <div className="flex flex-col mb-12">
            <div className="flex items-center gap-4">
              <div className="bg-brand-accent/10 p-3 rounded-full">
                <FileText size={28} className="text-brand-accent" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Terms and Conditions</h1>
            </div>
            <p className="text-gray-500 mt-4 max-w-2xl">
              Last Updated: June 1, 2023. These Terms govern your use of Corde Stitch's website and services. 
              By accessing or using our platform, you agree to be legally bound by these Terms.
            </p>
          </div>
          
          {/* Table of Contents */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-10">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Table of Contents</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { icon: <Info size={16} />, title: "1. Definitions & Interpretation" },
                { icon: <CheckCircle size={16} />, title: "2. Account Registration" },
                { icon: <Shield size={16} />, title: "3. User Obligations" },
                { icon: <Info size={16} />, title: "4. Intellectual Property" },
                { icon: <AlertCircle size={16} />, title: "5. Prohibited Activities" },
                { icon: <CheckCircle size={16} />, title: "6. Purchases & Payments" },
                { icon: <Shield size={16} />, title: "7. Returns & Refunds" },
                { icon: <AlertCircle size={16} />, title: "8. Limitation of Liability" },
                { icon: <Info size={16} />, title: "9. Governing Law" },
                { icon: <CheckCircle size={16} />, title: "10. Changes to Terms" },
              ].map((item, index) => (
                <a 
                  key={index}
                  href={`#section-${index + 1}`}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                >
                  <div className="text-gray-400 group-hover:text-brand-accent transition-colors">
                    {item.icon}
                  </div>
                  <span className="text-gray-700 group-hover:text-gray-900 font-medium">{item.title}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Terms Sections */}
          <div className="space-y-8">
            {/* Section 1 */}
            <section id="section-1" className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 scroll-mt-24 hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-brand-accent/10 p-3 rounded-full">
                  <Info size={20} className="text-brand-accent" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-800">1. Definitions & Interpretation</h2>
              </div>
              <div className="text-gray-600 space-y-4">
                <p>
                  <strong>1.1</strong> In these Terms:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>"Content"</strong> means text, images, audio, video, or other information</li>
                  <li><strong>"Services"</strong> refers to all products and services offered by Corde Stitch</li>
                  <li><strong>"User"</strong> means any person accessing or using our website</li>
                  <li><strong>"We/Us/Our"</strong> refers to Corde Stitch and its affiliates</li>
                </ul>
                <p>
                  <strong>1.2</strong> The headings in these Terms are for convenience only and shall not affect their interpretation.
                </p>
              </div>
            </section>

            {/* Section 2 */}
            <section id="section-2" className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 scroll-mt-24 hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-brand-accent/10 p-3 rounded-full">
                  <CheckCircle size={20} className="text-brand-accent" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-800">2. Account Registration</h2>
              </div>
              <div className="text-gray-600 space-y-4">
                <p>
                  <strong>2.1</strong> To access certain features, you must register an account by providing accurate and complete information.
                </p>
                <p>
                  <strong>2.2</strong> You must be at least 18 years old to create an account or use our Services.
                </p>
                <p>
                  <strong>2.3</strong> You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account.
                </p>
                <p>
                  <strong>2.4</strong> We reserve the right to suspend or terminate accounts that violate these Terms.
                </p>
              </div>
            </section>

            {/* Section 3 */}
            <section id="section-3" className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 scroll-mt-24 hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-brand-accent/10 p-3 rounded-full">
                  <Shield size={20} className="text-brand-accent" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-800">3. User Obligations</h2>
              </div>
              <div className="text-gray-600 space-y-4">
                <p>
                  <strong>3.1</strong> You agree to use our Services only for lawful purposes and in accordance with these Terms.
                </p>
                <p>
                  <strong>3.2</strong> You must not:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Use our Services in any way that could damage, disable, or impair them</li>
                  <li>Attempt to gain unauthorized access to any part of our systems</li>
                  <li>Use automated systems (e.g., bots) to access our Services without permission</li>
                  <li>Engage in any fraudulent activity or provide false information</li>
                </ul>
              </div>
            </section>

            {/* Section 4 */}
            <section id="section-4" className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 scroll-mt-24 hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-brand-accent/10 p-3 rounded-full">
                  <Info size={20} className="text-brand-accent" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-800">4. Intellectual Property</h2>
              </div>
              <div className="text-gray-600 space-y-4">
                <p>
                  <strong>4.1</strong> All Content, trademarks, service marks, and logos on our website are owned by or licensed to us and are protected by intellectual property laws.
                </p>
                <p>
                  <strong>4.2</strong> You may view and print Content for personal, non-commercial use only, provided you maintain all copyright notices.
                </p>
                <p>
                  <strong>4.3</strong> Any unauthorized use, reproduction, or distribution of our Content is strictly prohibited.
                </p>
              </div>
            </section>

            {/* Section 5 */}
            <section id="section-5" className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 scroll-mt-24 hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-brand-accent/10 p-3 rounded-full">
                  <AlertCircle size={20} className="text-brand-accent" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-800">5. Prohibited Activities</h2>
              </div>
              <div className="text-gray-600 space-y-4">
                <p>You may not use our Services to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Violate any laws or regulations</li>
                  <li>Infringe upon the rights of others</li>
                  <li>Distribute viruses or malicious software</li>
                  <li>Engage in harassment, discrimination, or hate speech</li>
                  <li>Collect information about others without consent</li>
                  <li>Interfere with the security or integrity of our Services</li>
                </ul>
              </div>
            </section>

            {/* Section 6 */}
            <section id="section-6" className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 scroll-mt-24 hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-brand-accent/10 p-3 rounded-full">
                  <CheckCircle size={20} className="text-brand-accent" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-800">6. Purchases & Payments</h2>
              </div>
              <div className="text-gray-600 space-y-4">
                <p>
                  <strong>6.1</strong> All prices are in USD unless otherwise stated and are subject to change without notice.
                </p>
                <p>
                  <strong>6.2</strong> You agree to pay all charges incurred under your account using a valid payment method.
                </p>
                <p>
                  <strong>6.3</strong> We reserve the right to refuse or cancel any orders for any reason, including suspected fraud.
                </p>
                <p>
                  <strong>6.4</strong> Sales taxes may be added to your order as required by law.
                </p>
              </div>
            </section>

            {/* Section 7 */}
            <section id="section-7" className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 scroll-mt-24 hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-brand-accent/10 p-3 rounded-full">
                  <Shield size={20} className="text-brand-accent" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-800">7. Returns & Refunds</h2>
              </div>
              <div className="text-gray-600 space-y-4">
                <p>
                  <strong>7.1</strong> Our Return Policy, available on our website, governs all returns and refunds.
                </p>
                <p>
                  <strong>7.2</strong> To be eligible for a return, items must be unused, in original packaging, and returned within 30 days of delivery.
                </p>
                <p>
                  <strong>7.3</strong> Refunds will be issued to the original payment method within 14 business days of receiving the returned item.
                </p>
              </div>
            </section>

            {/* Section 8 */}
            <section id="section-8" className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 scroll-mt-24 hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-brand-accent/10 p-3 rounded-full">
                  <AlertCircle size={20} className="text-brand-accent" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-800">8. Limitation of Liability</h2>
              </div>
              <div className="text-gray-600 space-y-4">
                <p>
                  <strong>8.1</strong> To the maximum extent permitted by law, we shall not be liable for any indirect, incidental, special, consequential, or punitive damages.
                </p>
                <p>
                  <strong>8.2</strong> Our total liability for any claims related to our Services shall not exceed the amount you paid us in the past 12 months.
                </p>
                <p>
                  <strong>8.3</strong> We do not guarantee that our Services will be uninterrupted, secure, or error-free.
                </p>
              </div>
            </section>

            {/* Section 9 */}
            <section id="section-9" className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 scroll-mt-24 hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-brand-accent/10 p-3 rounded-full">
                  <Info size={20} className="text-brand-accent" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-800">9. Governing Law</h2>
              </div>
              <div className="text-gray-600 space-y-4">
                <p>
                  <strong>9.1</strong> These Terms shall be governed by and construed in accordance with the laws of the State of Delaware, without regard to its conflict of law provisions.
                </p>
                <p>
                  <strong>9.2</strong> Any disputes shall be resolved exclusively in the state or federal courts located in Delaware.
                </p>
              </div>
            </section>

            {/* Section 10 */}
            <section id="section-10" className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 scroll-mt-24 hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-brand-accent/10 p-3 rounded-full">
                  <CheckCircle size={20} className="text-brand-accent" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-800">10. Changes to Terms</h2>
              </div>
              <div className="text-gray-600 space-y-4">
                <p>
                  <strong>10.1</strong> We reserve the right to modify these Terms at any time. The updated version will be posted on our website with a new "Last Updated" date.
                </p>
                <p>
                  <strong>10.2</strong> Your continued use of our Services after changes constitutes acceptance of the new Terms.
                </p>
                <p>
                  <strong>10.3</strong> Material changes will be communicated to registered users via email or through our Services.
                </p>
              </div>
            </section>
          </div>

          {/* Acceptance Section */}
          <div className="mt-12 p-6 bg-brand-accent/5 rounded-xl border border-brand-accent/20">
            <div className="flex items-start gap-4">
              <CheckCircle size={24} className="text-brand-accent mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Acceptance of Terms</h3>
                <p className="text-gray-600">
                  By using our website or services, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions. If you do not agree, you must discontinue use of our Services immediately.
                </p>
                <p className="text-gray-600 mt-2">
                  For questions about these Terms, please contact us at <a href="mailto:legal@cordestitch.com" className="text-brand-accent hover:underline">legal@cordestitch.com</a>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TermsAndConditions;