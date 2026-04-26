import { useState } from 'react';
import { Globe } from 'lucide-react';

const TIMEZONES = [
  "UTC",
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "America/Sao_Paulo",
  "Europe/London",
  "Europe/Paris",
  "Europe/Berlin",
  "Europe/Moscow",
  "Asia/Dubai",
  "Asia/Kolkata",
  "Asia/Shanghai",
  "Asia/Tokyo",
  "Asia/Singapore",
  "Australia/Sydney",
  "Pacific/Auckland"
];

export default function TimeZoneConverter() {
  const [localTime, setLocalTime] = useState('');
  const [targetTz, setTargetTz] = useState('UTC');

  let convertedTime = '';
  let convertedDate = '';

  if (localTime) {
    try {
      const d = new Date(localTime);
      convertedTime = d.toLocaleTimeString('en-US', { timeZone: targetTz, hour: '2-digit', minute: '2-digit', hour12: true });
      convertedDate = d.toLocaleDateString('en-US', { timeZone: targetTz, weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    } catch (e) {
      // Invalid date
    }
  }

  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
      <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-8">
        <Globe className="w-8 h-8 text-blue-600 dark:text-blue-400" />
      </div>

      <div className="space-y-8">
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 ml-1">Your Local Time</label>
          <input
            type="datetime-local"
            value={localTime}
            onChange={(e) => setLocalTime(e.target.value)}
            className="w-full p-4 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-2xl dark:text-white focus:border-blue-500 outline-none text-lg font-bold"
          />
        </div>

        <div className="flex justify-center">
          <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-gray-400">
            ↓
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 ml-1">Target Time Zone</label>
          <select
            value={targetTz}
            onChange={(e) => setTargetTz(e.target.value)}
            className="w-full p-4 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-2xl dark:text-white focus:border-blue-500 outline-none text-lg font-bold cursor-pointer"
          >
            {TIMEZONES.map(tz => <option key={tz} value={tz}>{tz.replace('_', ' ')}</option>)}
          </select>
        </div>
      </div>

      {convertedTime && (
        <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 p-8 rounded-2xl border border-blue-100 dark:border-blue-800/30 text-center">
          <div className="text-sm font-bold text-blue-800 dark:text-blue-300 uppercase tracking-wider mb-2">{targetTz.replace('_', ' ')} Time</div>
          <div className="text-5xl font-black text-blue-600 dark:text-blue-400 mb-2">{convertedTime}</div>
          <div className="text-gray-600 dark:text-gray-400 font-medium">{convertedDate}</div>
        </div>
      )}
    </div>
  );
}
