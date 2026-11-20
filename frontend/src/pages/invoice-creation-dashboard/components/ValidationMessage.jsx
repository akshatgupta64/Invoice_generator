import React from 'react';
import Icon from '../../../components/AppIcon';

const ValidationMessage = ({ errors, isVisible }) => {
  if (!isVisible || errors.length === 0) {
    return null;
  }

  return (
    <div className="bg-error-50 border border-error-200 rounded-lg p-4 mb-6">
      <div className="flex items-start space-x-3">
        <Icon name="AlertCircle" size={20} className="text-error-600 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-error-800 mb-2">
            Complete required fields to continue
          </h4>
          <ul className="text-sm text-error-700 space-y-1">
            {errors.map((error, index) => (
              <li key={index} className="flex items-center space-x-2">
                <span className="w-1 h-1 bg-error-600 rounded-full flex-shrink-0"></span>
                <span>{error}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ValidationMessage;