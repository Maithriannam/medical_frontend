import React from 'react';

const MedicalCard = ({ icon: Icon, title, children, className = '' }) => {
  return (
    <div className={`medical-card flex flex-col gap-4 ${className}`}>
      {(Icon || title) && (
        <div className="flex items-center gap-3 mb-2">
          {Icon && (
            <div className="p-2 bg-teal-50 dark:bg-gray-700 rounded-lg text-primary-teal dark:text-teal-400">
              <Icon size={24} />
            </div>
          )}
          {title && <h3 className="text-xl font-semibold text-text-dark dark:text-white">{title}</h3>}
        </div>
      )}
      <div className="flex-1 text-gray-600 dark:text-gray-300">
        {children}
      </div>
    </div>
  );
};

export default MedicalCard;
