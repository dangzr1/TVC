import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ = () => {
  const faqItems = [
    {
      question: "How does TheVendorsConnect work?",
      answer:
        "TheVendorsConnect simplifies wedding planning by connecting couples with pre-vetted vendors. Create a profile, browse vendors by category, view their portfolios, check availability for your date, and book directly through our platform.",
    },
    {
      question: "Is it free to use TheVendorsConnect?",
      answer:
        "Yes! TheVendorsConnect is completely free for couples planning their wedding. Vendors pay a small subscription fee to be listed on our platform, which allows us to offer a premium experience to couples at no cost.",
    },
    {
      question: "How do I know the vendors are reliable?",
      answer:
        "All vendors on TheVendorsConnect go through a verification process before being listed. We check their credentials, review their past work, and collect authentic reviews from couples who have used their services.",
    },
    {
      question: "Can I see vendor availability for my wedding date?",
      answer:
        "Absolutely! Our real-time availability calendar shows you which vendors are free on your wedding date, saving you time by only showing available options.",
    },
    {
      question: "What if I need to cancel or change my booking?",
      answer:
        "Each vendor has their own cancellation policy which is clearly displayed on their profile. Most vendors allow changes with sufficient notice. You can manage all your bookings directly through your dashboard.",
    },
    {
      question: "How do payments work?",
      answer:
        "TheVendorsConnect offers secure payment processing. You can pay deposits to secure your booking and make final payments according to the vendor's payment schedule, all through our platform with payment protection.",
    },
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50" id="faq">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-4 bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-indigo-600">
          Frequently Asked Questions
        </h2>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Everything you need to know about our platform
        </p>
        <Accordion type="single" collapsible className="w-full">
          {faqItems.map((item, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="border border-white/50 mb-4 rounded-lg bg-white/90 backdrop-blur-sm shadow-md hover:shadow-lg transition-all duration-300"
            >
              <AccordionTrigger className="text-left font-medium text-lg px-6 py-4 hover:bg-gradient-to-r hover:from-teal-50 hover:to-indigo-50 rounded-t-lg">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 px-6 py-4">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQ;
