import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const PrivacyPolicyPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-light-gray text-dark-gray">
      <Navbar />
      <div className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-sm">
          <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>

          <div className="space-y-6">
            <section>
              <h2 className="text-xl font-semibold mb-3">1. Introduction</h2>
              <p>
                Welcome to TheVendorsConnect. We respect your privacy and are
                committed to protecting your personal data. This privacy policy
                will inform you about how we look after your personal data when
                you visit our website and tell you about your privacy rights and
                how the law protects you.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">2. Data We Collect</h2>
              <p>
                We may collect, use, store and transfer different kinds of
                personal data about you which we have grouped together as
                follows:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>
                  Identity Data: includes first name, last name, username or
                  similar identifier
                </li>
                <li>
                  Contact Data: includes email address and telephone numbers
                </li>
                <li>
                  Technical Data: includes internet protocol (IP) address,
                  browser type and version, time zone setting and location
                </li>
                <li>
                  Profile Data: includes your username and password,
                  preferences, feedback and survey responses
                </li>
                <li>
                  Usage Data: includes information about how you use our
                  website, products and services
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">
                3. How We Use Your Data
              </h2>
              <p>
                We will only use your personal data when the law allows us to.
                Most commonly, we will use your personal data in the following
                circumstances:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>
                  Where we need to perform the contract we are about to enter
                  into or have entered into with you
                </li>
                <li>
                  Where it is necessary for our legitimate interests and your
                  interests and fundamental rights do not override those
                  interests
                </li>
                <li>Where we need to comply with a legal obligation</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">4. Data Security</h2>
              <p>
                We have put in place appropriate security measures to prevent
                your personal data from being accidentally lost, used or
                accessed in an unauthorized way, altered or disclosed. In
                addition, we limit access to your personal data to those
                employees, agents, contractors and other third parties who have
                a business need to know.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">5. Data Retention</h2>
              <p>
                We will only retain your personal data for as long as reasonably
                necessary to fulfill the purposes we collected it for, including
                for the purposes of satisfying any legal, regulatory, tax,
                accounting or reporting requirements.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">
                6. Your Legal Rights
              </h2>
              <p>
                Under certain circumstances, you have rights under data
                protection laws in relation to your personal data, including the
                right to:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Request access to your personal data</li>
                <li>Request correction of your personal data</li>
                <li>Request erasure of your personal data</li>
                <li>Object to processing of your personal data</li>
                <li>Request restriction of processing your personal data</li>
                <li>Request transfer of your personal data</li>
                <li>Right to withdraw consent</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">
                7. Changes to This Privacy Policy
              </h2>
              <p>
                We may update our privacy policy from time to time. We will
                notify you of any changes by posting the new privacy policy on
                this page and updating the "Last Updated" date at the top of
                this privacy policy.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">8. Contact Us</h2>
              <p>
                If you have any questions about this privacy policy or our
                privacy practices, please contact us at:
              </p>
              <p className="mt-2">
                <strong>Email:</strong> privacy@thevendorsconnect.com
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

export default PrivacyPolicyPage;
