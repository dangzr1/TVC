import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const TermsOfServicePage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-light-gray text-dark-gray">
      <Navbar />
      <div className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-sm">
          <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>

          <div className="space-y-6">
            <section>
              <h2 className="text-xl font-semibold mb-3">1. Introduction</h2>
              <p>
                Welcome to TheVendorsConnect. These Terms of Service govern your
                use of our website and services. By accessing or using our
                services, you agree to be bound by these Terms. If you disagree
                with any part of the terms, you may not access the service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">2. Accounts</h2>
              <p>
                When you create an account with us, you guarantee that the
                information you provide is accurate, complete, and current at
                all times. Inaccurate, incomplete, or obsolete information may
                result in the immediate termination of your account on the
                service.
              </p>
              <p className="mt-2">
                You are responsible for maintaining the confidentiality of your
                account and password, including but not limited to the
                restriction of access to your computer and/or account. You agree
                to accept responsibility for any and all activities or actions
                that occur under your account and/or password.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">3. Service Usage</h2>
              <p>
                Our service allows clients to post job listings and vendors to
                apply for those jobs. We do not guarantee that any jobs posted
                will be filled, nor do we guarantee that vendors will receive
                job offers through our platform.
              </p>
              <p className="mt-2">
                We are not responsible for the content posted by users on our
                platform. However, we reserve the right to remove any content
                that violates these Terms or is otherwise objectionable.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">
                4. Payments and Fees
              </h2>
              <p>
                Basic accounts are free. Premium features require payment of
                subscription fees as described on our pricing page. All fees are
                exclusive of all taxes, levies, or duties imposed by taxing
                authorities.
              </p>
              <p className="mt-2">
                You are responsible for paying all fees associated with using
                our premium services. You agree to provide us with accurate and
                complete billing information.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">
                5. Intellectual Property
              </h2>
              <p>
                The Service and its original content, features, and
                functionality are and will remain the exclusive property of
                TheVendorsConnect and its licensors. The Service is protected by
                copyright, trademark, and other laws of both the United States
                and foreign countries.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">6. Termination</h2>
              <p>
                We may terminate or suspend your account and bar access to the
                Service immediately, without prior notice or liability, under
                our sole discretion, for any reason whatsoever and without
                limitation, including but not limited to a breach of the Terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">
                7. Limitation of Liability
              </h2>
              <p>
                In no event shall TheVendorsConnect, nor its directors,
                employees, partners, agents, suppliers, or affiliates, be liable
                for any indirect, incidental, special, consequential or punitive
                damages, including without limitation, loss of profits, data,
                use, goodwill, or other intangible losses, resulting from your
                access to or use of or inability to access or use the Service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">
                8. Changes to Terms
              </h2>
              <p>
                We reserve the right, at our sole discretion, to modify or
                replace these Terms at any time. If a revision is material we
                will provide at least 30 days' notice prior to any new terms
                taking effect. What constitutes a material change will be
                determined at our sole discretion.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">9. Contact Us</h2>
              <p>
                If you have any questions about these Terms, please contact us
                at:
              </p>
              <p className="mt-2">
                <strong>Email:</strong> terms@thevendorsconnect.com
                <br />
                <strong>Address:</strong> 123 Wedding Street, Suite 100, New
                York, NY 10001
              </p>
            </section>

            <p className="text-sm text-gray-500 mt-8">
              Last Updated: June 1, 2023
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default TermsOfServicePage;
