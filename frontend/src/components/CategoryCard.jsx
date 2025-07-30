import React from 'react';
import { Link } from 'react-router-dom';

const CategoryCard = ({ title, subtitle, link }) => {
  return (
    <Link
      to={link}
      className="block p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md hover:shadow-xl transition"
    >
      <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300">{subtitle}</p>
    </Link>
  );
};

export default CategoryCard;
