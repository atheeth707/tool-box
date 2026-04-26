import { useState, useEffect } from 'react';
import { Network, MapPin, Globe, Shield } from 'lucide-react';

export default function IpChecker() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('https://ipapi.co/json/')
      .then(res => res.json())
      .then(json => {
        if (json.error) setError(json.reason);
        else setData(json);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch IP data. Ad-blockers may block this request.');
        setLoading(false);
      });
  }, []);

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white dark:bg-gray-800 p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 text-center">
        <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-8">
          <Network className="w-10 h-10 text-blue-600 dark:text-blue-400" />
        </div>

        <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-2">Your Public IP Address</h2>
        
        {loading ? (
          <div className="h-16 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="text-red-500 font-bold p-4 bg-red-50 dark:bg-red-900/20 rounded-xl">{error}</div>
        ) : data ? (
          <>
            <div className="text-5xl md:text-6xl font-black text-gray-900 dark:text-white font-mono tracking-tight mb-10">
              {data.ip}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
              <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 flex items-start space-x-4">
                <MapPin className="text-blue-500 shrink-0 mt-1" size={24} />
                <div>
                  <div className="text-xs font-bold text-gray-500 uppercase mb-1">Location</div>
                  <div className="font-semibold text-gray-900 dark:text-white">{data.city}, {data.region}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{data.country_name}</div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 flex items-start space-x-4">
                <Shield className="text-green-500 shrink-0 mt-1" size={24} />
                <div>
                  <div className="text-xs font-bold text-gray-500 uppercase mb-1">ISP / Provider</div>
                  <div className="font-semibold text-gray-900 dark:text-white">{data.org || data.asn}</div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 flex items-start space-x-4">
                <Globe className="text-purple-500 shrink-0 mt-1" size={24} />
                <div>
                  <div className="text-xs font-bold text-gray-500 uppercase mb-1">Timezone</div>
                  <div className="font-semibold text-gray-900 dark:text-white">{data.timezone}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{data.utc_offset}</div>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
