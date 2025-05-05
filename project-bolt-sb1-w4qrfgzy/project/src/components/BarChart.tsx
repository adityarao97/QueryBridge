import React from 'react';

interface BarChartProps {
  data: {
    date: string;
    count: number;
  }[];
  title: string;
}

const BarChart: React.FC<BarChartProps> = ({ data, title }) => {
  const maxValue = Math.max(...data.map(item => item.count));
  
  return (
    <div className="bg-white p-4 rounded-lg shadow-md border border-gray-100">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      
      <div className="mt-4 space-y-2">
        {data.map((item, index) => (
          <div key={index} className="flex items-center">
            <div className="w-24 text-sm text-gray-600">{item.date}</div>
            <div className="flex-1">
              <div className="relative h-8">
                <div 
                  className="absolute inset-y-0 left-0 bg-blue-500 rounded-sm transition-all duration-500"
                  style={{ width: `${(item.count / maxValue) * 100}%` }}
                ></div>
                <div className="absolute inset-y-0 left-2 flex items-center text-white text-sm font-medium">
                  {item.count}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BarChart;