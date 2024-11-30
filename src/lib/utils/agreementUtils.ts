export const getAgreementWarningSettings = () => {
  const saved = localStorage.getItem('agreementWarningSettings');
  return saved ? JSON.parse(saved) : {
    warningDays: 180,
    criticalDays: 90,
    warningColor: '#FEF08A',
    criticalColor: '#FCA5A5'
  };
};

export const getDaysUntilExpiry = (expiryDate: string) => {
  const expiry = new Date(expiryDate);
  const today = new Date();
  const diffTime = expiry.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const getExpiryWarningColor = (expiryDate: string) => {
  const settings = getAgreementWarningSettings();
  const daysUntil = getDaysUntilExpiry(expiryDate);
  
  if (daysUntil <= settings.criticalDays) {
    return `bg-red-500/10 border-red-500`;
  }
  if (daysUntil <= settings.warningDays) {
    return `bg-yellow-500/10 border-yellow-500`;
  }
  return '';
};

export const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString();
};