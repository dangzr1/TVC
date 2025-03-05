import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-light-gray text-dark-gray">
      <Navbar />
      <div className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">
            Frequently Asked Questions
          </h1>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>How do I create an account?</AccordionTrigger>
              <AccordionContent>
                To create an account, click on the "Sign Up" button in the top
                right corner of the homepage. You'll be asked to provide some
                basic information and choose whether you're a client or a
                vendor.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger>
                What's the difference between client and vendor accounts?
              </AccordionTrigger>
              <AccordionContent>
                Client accounts are for couples planning their wedding who want
                to find and hire vendors. Vendor accounts are for wedding
                professionals who want to offer their services to couples.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger>
                Is it free to create an account?
              </AccordionTrigger>
              <AccordionContent>
                Yes, creating a basic account is completely free for both
                clients and vendors. We also offer premium features for vendors
                who want to boost their visibility and access advanced tools.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger>
                How do I post a job as a client?
              </AccordionTrigger>
              <AccordionContent>
                After logging in as a client, navigate to your dashboard and
                click on "Post a Job" or "Create New Job Posting". Fill out the
                form with details about your wedding and the services you need.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5">
              <AccordionTrigger>
                How do I apply for jobs as a vendor?
              </AccordionTrigger>
              <AccordionContent>
                As a vendor, you can browse available jobs in your dashboard or
                use the "Quick Apply" feature in the community chat. You can
                also set up your profile to be discoverable by clients searching
                for your services.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6">
              <AccordionTrigger>
                What are the benefits of premium membership?
              </AccordionTrigger>
              <AccordionContent>
                Premium membership for vendors includes benefits like priority
                placement in search results, featured badges on your profile,
                advanced analytics, unlimited job applications, and dedicated
                support.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-7">
              <AccordionTrigger>
                How do I message a vendor or client?
              </AccordionTrigger>
              <AccordionContent>
                You can message vendors or clients through our secure messaging
                system. Click on their profile and select "Send Message" or use
                the messaging tab in your dashboard.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-8">
              <AccordionTrigger>How do payments work?</AccordionTrigger>
              <AccordionContent>
                Our platform facilitates connections between clients and
                vendors, but payments are arranged directly between parties. We
                recommend discussing payment terms clearly and using secure
                payment methods.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-9">
              <AccordionTrigger>Can I cancel my account?</AccordionTrigger>
              <AccordionContent>
                Yes, you can cancel your account at any time by going to your
                profile settings and selecting "Delete Account". If you have an
                active premium subscription, you may need to cancel that first.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-10">
              <AccordionTrigger>
                How can I get help if I have a problem?
              </AccordionTrigger>
              <AccordionContent>
                For any issues or questions, you can contact our support team
                through the "Contact" link in the footer, or by sending a
                message to support@thevendorsconnect.com.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default FAQPage;
