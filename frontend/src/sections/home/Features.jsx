import React from 'react';
import { FaTruck, FaMoneyBillWave, FaHeadset, FaPercent } from 'react-icons/fa';

const Features = () => {
  const features = [
    {
      icon: <FaTruck className="text-xl text-blue-600" />,
      title: "Free Shipping & Returns",
      description: "Shop with confidence and have your favorite electronics delivered right to your doorstep without any additional cost."
    },
    {
      icon: <FaMoneyBillWave className="text-xl text-blue-600" />,
      title: "Money Back Guarantee",
      description: "If you're not completely satisfied with your purchase, we'll make it right. No questions asked."
    },
    {
      icon: <FaHeadset className="text-xl text-blue-600" />,
      title: "Online Support 24/7",
      description: "Need help with your electronics? Get in touch with us anytime, anywhere, and let's get your tech sorted."
    },
    {
      icon: <FaPercent className="text-xl text-blue-600" />,
      title: "Regular Sales",
      description: "Don't miss out on our amazing deals with regular sales on our top-of-the-line electronics."
    }
  ];

  return (
    <div className=" py-16 px-4 sm:px-6 lg:px-8">
      <div className=" mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-gray-200">
        {features.map((feature, index) => (
          <div
            key={index}
            className="flex items-start gap-4 px-6 py-8 text-left"
          >
            <div className="bg-white rounded-md p-2">
              {feature.icon}
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-600">
                {feature.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Features;
