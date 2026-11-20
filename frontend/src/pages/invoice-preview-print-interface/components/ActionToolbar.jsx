import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const ActionToolbar = ({ 
  onEdit, 
  onDownloadPDF, 
  onQuickPrint, 
  onSendEmail,
  zoomLevel,
  onZoomChange,
  className = ''
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const zoomOptions = [50, 75, 100, 125, 150];

  const handleZoomChange = (newZoom) => {
    if (onZoomChange) {
      onZoomChange(newZoom);
    }
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={`fixed right-6 top-1/2 transform -translate-y-1/2 z-50 ${className}`}>
      <div className="bg-surface border border-border rounded-lg shadow-elevation-lg overflow-hidden">
        {/* Toggle Button */}
        <div className="flex justify-between items-center p-3 bg-secondary-50 border-b border-border">
          <span className="text-sm font-medium text-text-primary">Actions</span>
          <Button
            variant="ghost"
            size="xs"
            onClick={toggleExpanded}
            className="p-1"
          >
            <Icon name={isExpanded ? 'ChevronRight' : 'ChevronLeft'} size={16} />
          </Button>
        </div>

        {/* Action Buttons */}
        {isExpanded && (
          <div className="p-4 space-y-3 w-48">
            {/* Primary Actions */}
            <div className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onEdit}
                iconName="Edit"
                fullWidth
                className="justify-start"
              >
                Edit Invoice
              </Button>
              
              <Button
                variant="primary"
                size="sm"
                onClick={onDownloadPDF}
                iconName="Download"
                fullWidth
                className="justify-start"
              >
                Download PDF
              </Button>
              
              <Button
                variant="secondary"
                size="sm"
                onClick={onQuickPrint}
                iconName="Printer"
                fullWidth
                className="justify-start"
              >
                Quick Print
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={onSendEmail}
                iconName="Mail"
                fullWidth
                className="justify-start"
              >
                Send Email
              </Button>
            </div>

            {/* Divider */}
            <div className="border-t border-border my-3"></div>

            {/* Zoom Controls */}
            <div>
              <label className="text-xs font-medium text-text-secondary uppercase tracking-wide mb-2 block">
                Zoom Level
              </label>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-primary">{zoomLevel}%</span>
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="xs"
                      onClick={() => handleZoomChange(Math.max(50, zoomLevel - 25))}
                      disabled={zoomLevel <= 50}
                      className="p-1"
                    >
                      <Icon name="Minus" size={14} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="xs"
                      onClick={() => handleZoomChange(Math.min(150, zoomLevel + 25))}
                      disabled={zoomLevel >= 150}
                      className="p-1"
                    >
                      <Icon name="Plus" size={14} />
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-1">
                  {zoomOptions.map((zoom) => (
                    <Button
                      key={zoom}
                      variant={zoomLevel === zoom ? 'primary' : 'ghost'}
                      size="xs"
                      onClick={() => handleZoomChange(zoom)}
                      className="text-xs"
                    >
                      {zoom}%
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* Additional Actions */}
            <div className="border-t border-border pt-3">
              <div className="space-y-2">
                <Button
                  variant="ghost"
                  size="sm"
                  iconName="Copy"
                  fullWidth
                  className="justify-start text-text-secondary"
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    // Could add toast notification here
                  }}
                >
                  Copy Link
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  iconName="Share"
                  fullWidth
                  className="justify-start text-text-secondary"
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: 'Invoice Preview',
                        url: window.location.href
                      });
                    }
                  }}
                >
                  Share
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActionToolbar;