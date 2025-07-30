import React, { useState } from "react";

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "What payment methods are accepted at your store?",
      answer:
        "Our online store accepts a variety of payment methods to ensure a convenient shopping experience for our customers. We accept major credit cards, such as Visa, MasterCard, American Express, and Discover, as well as debit cards. Additionally, we offer support for digital payment platforms like PayPal, Apple Pay, and Google Pay. We are constantly working to expand our payment options to accommodate our customers' needs.",
    },
    {
      question: "How long does it take to process and ship my order?",
      answer:
        "Answer: We strive to process and ship orders as quickly as possible. Generally, orders are processed within 1-2 business days after being placed. Shipping times vary depending on the chosen shipping method and the destination of the package. Standard shipping typically takes 3-7 business days within the continental United States, while expedited shipping options are available for faster delivery. International shipping times vary depending on the country and customs processing times.",
    },
    {
      question: "Can I return or exchange an item I've purchased?",
      answer:
        "Our online store offers a hassle-free return and exchange policy. You can return or exchange any eligible items within 30 days of the delivery date, provided they are in their original, unused condition with all tags and packaging intact. To initiate a return or exchange, please contact our customer support team through our website or email, and they will guide you through the process. Please note that return shipping costs are the responsibility of the customer unless the item is faulty or an error has been made on our part.",
    },
  ];

  return (
    <section className="py-20 px-6">
      {/* Heading */}
      <div className="mb-12">
        <h2 className="text-4xl font-extrabold text-gray-900 mb-2">
          FAQ
        </h2>
        <p className="text-md text-gray-600">
          Have a question? Check out our FAQ section for answers to <br />{" "}
          common questions.
        </p>
      </div>

      {/* FAQ List */}
      <div className="divide-y divide-gray-200">
        {faqs.map((faq, index) => (
          <div key={index} className="py-4">
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full flex justify-between items-center text-left focus:outline-none"
            >
              <h3 className="text-lg font-semibold text-gray-800 flex items-start">
                <span className="text-blue-600 mr-2">{index + 1}.</span>{" "}
                {faq.question}
              </h3>
              <svg
                className={`w-5 h-5 transform transition-transform duration-300 text-gray-500 ${
                  activeIndex === index ? "rotate-180" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            <div
              className={`mt-3 transition-all duration-300 ease-in-out ${
                activeIndex === index
                  ? "max-h-96 opacity-100"
                  : "max-h-0 opacity-0 overflow-hidden"
              }`}
            >
              <p className="text-gray-600 text-sm leading-relaxed">
                {faq.answer}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FAQ;