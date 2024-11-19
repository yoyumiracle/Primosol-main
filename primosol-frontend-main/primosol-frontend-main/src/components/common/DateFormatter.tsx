import React from 'react';

interface DateFormatterProps {
  timestamp: number; // Expecting timestamp in milliseconds
}

const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp);

  // Format options
  const options: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  };

  // Formatter
  const formatter = new Intl.DateTimeFormat('en-US', options);

  // Format the date
  const parts = formatter.formatToParts(date);

  // Combine the parts to get the desired format
  const formattedDate = `${parts.find(part => part.type === 'month')?.value} ${parts.find(part => part.type === 'day')?.value} ${parts.find(part => part.type === 'hour')?.value}:${parts.find(part => part.type === 'minute')?.value}:${parts.find(part => part.type === 'second')?.value}`;

  return formattedDate;
};

const DateFormatter: React.FC<DateFormatterProps> = ({ timestamp }) => {
  return <div>{formatDate(timestamp)}</div>;
};

export default DateFormatter;
