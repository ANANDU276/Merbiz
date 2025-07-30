import { FaFacebookF, FaPinterestP, FaXTwitter } from 'react-icons/fa6';
import { FaInstagram } from 'react-icons/fa';
import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 text-sm text-gray-600 px-6 pt-10 pb-6">
      <div className=" mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Logo & copyright */}
          <div className="space-y-3">
            <h2 className="text-xl font-bold text-gray-900">StockMark</h2>
            <p>
              © {currentYear} Stockmart Modern by{' '}
              <a 
                href="#" 
                className="underline hover:text-gray-900 transition-colors"
                aria-label="Visit Devsphere Labs"
              >
                Devsphere labs
              </a>
            </p>
            <div className="flex space-x-4 pt-2 md:hidden">
              <a href="#" aria-label="Facebook">
                <FaFacebookF className="hover:text-blue-600 transition-colors" />
              </a>
              <a href="#" aria-label="Twitter">
                <FaXTwitter className="hover:text-black transition-colors" />
              </a>
              <a href="#" aria-label="Pinterest">
                <FaPinterestP className="hover:text-red-600 transition-colors" />
              </a>
              <a href="#" aria-label="Instagram">
                <FaInstagram className="hover:text-pink-600 transition-colors" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Starter Sites</h4>
            <ul className="space-y-2">
              {['Home', 'Collections', 'Cart', 'Checkout', 'Blogs'].map((item) => (
                <li key={item}>
                  <a 
                    href="#" 
                    className="hover:text-gray-900 transition-colors"
                    aria-label={`Go to ${item}`}
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Utilities</h4>
            <ul className="space-y-2">
              {['Contact', 'Login', 'Signup', 'Account', 'FAQ'].map((item) => (
                <li key={item}>
                  <a 
                    href="#" 
                    className="hover:text-gray-900 transition-colors"
                    aria-label={`Go to ${item}`}
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Single Pages</h4>
            <ul className="space-y-2">
              {['Product Single', 'Blog Post', 'About Us', 'Privacy Policy', 'Terms'].map((item) => (
                <li key={item}>
                  <a 
                    href="#" 
                    className="hover:text-gray-900 transition-colors"
                    aria-label={`Go to ${item}`}
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-3">
            <p>Have questions? Contact us 24/7:</p>
            <a 
              href="tel:+84123455577" 
              className="font-bold text-black hover:text-blue-600 transition-colors block"
              aria-label="Call us at +84 1234 555 77"
            >
              +84 1234 555 77
            </a>
            <p className="pt-2">Email: support@stockmark.com</p>
            <div className="flex space-x-4 pt-2">
              {[
                { icon: <FaFacebookF />, label: 'Facebook', color: 'hover:text-blue-600' },
                { icon: <FaXTwitter />, label: 'Twitter', color: 'hover:text-black' },
                { icon: <FaPinterestP />, label: 'Pinterest', color: 'hover:text-red-600' },
                { icon: <FaInstagram />, label: 'Instagram', color: 'hover:text-pink-600' },
              ].map((social) => (
                <a 
                  key={social.label}
                  href="#" 
                  className={`${social.color} transition-colors`}
                  aria-label={`Visit our ${social.label}`}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        <hr className="my-8 border-gray-300" />

        <div className="flex flex-col md:flex-row md:justify-between gap-6 items-center">
          {/* Language Selector */}
          <div className="w-full md:w-auto">
            <label htmlFor="language-select" className="block text-sm font-medium mb-1">
              Language
            </label>
            <select 
              id="language-select"
              className="mt-1 border px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {['English', 'Hindi', 'Spanish', 'French', 'German'].map((lang) => (
                <option key={lang} value={lang.toLowerCase()}>
                  {lang}
                </option>
              ))}
            </select>
          </div>

          {/* Newsletter */}
          <div className="w-full md:w-auto space-y-2">
            <span className="block text-sm">Subscribe to Our Newsletter</span>
            <div className="flex max-w-md">
              <input
                type="email"
                placeholder="Your email@email.com"
                className="px-4 py-2 border rounded-l-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
                aria-label="Email for newsletter subscription"
              />
              <button 
                className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 transition-colors"
                aria-label="Subscribe to newsletter"
              >
                Subscribe
              </button>
            </div>
          </div>

          {/* Payment methods */}
          <div className="flex items-center space-x-3">
            {['visa', 'mastercard', 'paypal', 'amex'].map((method) => (
              <img 
                key={method}
                src={`https://img.icons8.com/color/32/${method}.png`} 
                alt={method} 
                className="hover:opacity-80 transition-opacity"
                loading="lazy"
              />
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;