import React, { useState } from 'react';

// --- Types ---
interface BookLink {
  pdf: string | null;
  epub: string | null;
}

interface SubjectData {
  name: string;
  english: BookLink;
  tamil: BookLink;
}

// --- Data ---
// Links combined from the provided English and Tamil medium tables
const textbookData: SubjectData[] = [
  {
    name: "Accountancy",
    english: { pdf: "1eLhaQRA6fbVbWw95V2_wKcwpXNYeZtPE", epub: "1jODYA96wrHZ6MjIsrDTkv_tA2wKE45_J" },
    tamil: { pdf: "141fKnksSn5MXhRR365QVrtTYbIHjYUbS", epub: "1HO42Z_Z_TY0wThwhrIOiBDzJKA1rEguH" }
  },
  {
    name: "Advance Tamil",
    english: { pdf: "1Txs5lk7PAoJA2YQO9ksgHQcmdCNGM9vh", epub: "1UChzYD0GPGNpB3Af85h6cyjyhidTMGij" },
    tamil: { pdf: "1Txs5lk7PAoJA2YQO9ksgHQcmdCNGM9vh", epub: "1UChzYD0GPGNpB3Af85h6cyjyhidTMGij" }
  },
  {
    name: "Auditing",
    english: { pdf: "1F5pJqyz4HuBLfgkuSPH89kBGqNJYUoPS", epub: "1I8irIP-iAZ7BWq4NgDfAVZPgd0iYezsG" },
    tamil: { pdf: "17PJS8K8IJnzzzMLzsQ15kVHB3GcBJZSP", epub: "1eaUNeGkTyMZHnuRrJWxrMmZhbWHgOevu" }
  },
  {
    name: "Basic Automobile Engineering",
    english: { pdf: "1EPvOXVyRst3hfixkDmWuQeKRdT0dTQrh", epub: "1qnzvEB5MGxTv2icWD_5_XHK7IDOMItDV" },
    tamil: { pdf: "130X_1FAywhOCchQXAzD0ki_d3ivxBb-c", epub: "1r3AZsHYrIcSgcrQMMqA24rbYBj0jQ1N-" }
  },
  {
    name: "Basic Civil Engineering",
    english: { pdf: "1Qf5yueEK6rjY267GNv-TuQXhlx6wyDgT", epub: "1LIVv0auKN8omyP26kjToKrj-MXsal-Gb" },
    tamil: { pdf: "1D6kogT46yEGwpN7q6dPwibp5GNVnk4Xa", epub: "1xycbULTHv15lwwZAbGxlpKuxVcwskjuR" }
  },
  {
    name: "Basic Electrical Engineering",
    english: { pdf: "125v64f5RonWVPR6D5U1dYJf3DIAkiWZo", epub: "1bpBnSUhlLHgkU4c2ud1NWucSARy7EFrT" },
    tamil: { pdf: "1-FIn4TdlnXcK3Vc3fwrWg7QSbTd3QH5_", epub: "17M8CZhTet2RYQ7eLrcYPNId1px6N51kV" }
  },
  {
    name: "Basic Electronics Engineering",
    english: { pdf: "1iMsmL8M6hfbPDyBfWN7X1SJeABEfRxpW", epub: "1mzyg2fXWoWudUugM5XKD9NG0u9eOETiO" },
    tamil: { pdf: "1FaGtLeNlEbgTXC19hGSAcIeQZ2EW9Mtp", epub: null }
  },
  {
    name: "Basic Mechanical Engineering",
    english: { pdf: "1VrD9F9prnAABSPT72hTI25buYtCEqGyf", epub: "1adPoJKYrno27vVbmqyYYWntESiUj2gDr" },
    tamil: { pdf: "1c6SJcQ-gdgPQK_x98GYgwZJ8zAkoEqSo", epub: "1_RwAuU3_nJfqf3r3rpj86ljTkOXyjd4W" }
  },
  {
    name: "Bio Botany",
    english: { pdf: "1XYCv-aPGvX5oRwZtRLcXq9T4YSAUC8DP", epub: "13-TGj-YG6SwuVDyc8IhLmSQiovdr7vWV" },
    tamil: { pdf: "1pfq2aInRk1E-CFjabwCb3APV0wNEfs2x", epub: "104FPhBWNEt3X7Z6Mff3t33VFqQV22l90" }
  },
  {
    name: "Bio Chemistry",
    english: { pdf: "1mwlk7L7fgsFpblAfmUj_L8ET4fwddywg", epub: "1UGS9sG5ZU1RmbRdnXF6PnsN0qid9-eC9" },
    tamil: { pdf: "1aI5V7qhby5_w1jpGYtmsM4gS0Es1om91", epub: "1fWMHqkv6hJ8o61hxv4W8a5wiwlUq8IDm" }
  },
  {
    name: "Bio Zoology",
    english: { pdf: "14RU-BpdOeFzXz_5EEoG_od36_6NSB2BO", epub: "1H0BtTL40zj1hqih1exSDPxFTQIR0mc2z" },
    tamil: { pdf: "1WxpPH-nh3Lp1fyY19bQNaS9H2B1rzv4P", epub: "1SpsRTiS1JaudL_50Jn66KOKmJ6t8GN-A" }
  },
  {
    name: "Botany",
    english: { pdf: "1lx3v56AdZ4heCqNLTiwuZJgTCfNWtaJT", epub: "19l2qf7qTXlZmD0rQ3qQWjgcxmkzQT0aj" },
    tamil: { pdf: "1K7bJ4ugqYfnj-yj-rY3KwNZnNM94hPYg", epub: "1t1QuxJZYsJLsShxOHOFaLc7tz15KVEm0" }
  },
  {
    name: "Business Mathematics and Statistics",
    english: { pdf: "1YiteFy4mldubJKWjUKtcf1kRYlN4jyyT", epub: "1KsDzk7zO59haAKc4Jwx2y-ymjM27tCfH" },
    tamil: { pdf: "1KZU5YD3oclJKrwE6mS-aEBIIto6nc4Yz", epub: "1mPyWZYZg_KtFoig3IIRZlM_TzMzyAeb0" }
  },
  {
    name: "Chemistry Volume 1",
    english: { pdf: "1KWtBVDVWbnYk3DQN4iDXmz0A7vulrVm0", epub: "1ccbMFwxbuMb2faR1grzllxeu9PWbyXqZ" },
    tamil: { pdf: "1rTqMSG006EbBr3VJS70Cdkc9HOq2Emk_", epub: "1K9w86b9yaIyFAg-gcN2KkMFJnBMF_rf4" }
  },
  {
    name: "Chemistry Volume 2",
    english: { pdf: "1xgADsJ_eEO70BYhE2UHtLtYlL1H18Mfv", epub: "1gVJ82Mw8At8Dxedk-UYWBBL6ahazzOEq" },
    tamil: { pdf: "1JF-l39S7d9zsml5n32oGmGFku2Id4MbR", epub: "1Xt6aiwyFKo3BF-GIwcLmU_6eZmQHmaba" }
  },
  {
    name: "Commerce",
    english: { pdf: "132xHRYGirXtqGJDUmZ1ACW8SZPeie4PD", epub: "1KqPUejeINqQDnlrcP-lnXhl7XpqEloaj" },
    tamil: { pdf: "1gYHsYiAlJwad8sZt6rhK-_K0Q3msN2hQ", epub: "1Jw4_wf_Yf972NXXVNOxmw7aKW20ptUkF" }
  },
  {
    name: "Computer Applications",
    english: { pdf: "1kbU2Uxg6gtSh_OzH8SZ_ObEWTxkDrahk", epub: "1c-nh1FAhzQJkkKgJ9-FlTmgrJWZd-mtG" },
    tamil: { pdf: "1kGcURUrshkTWOFsbvpJ-0A4jf2Xv9FZz", epub: "1udVqjG_c1msGDSLHBFZgwj1v5KlgYi0e" }
  },
  {
    name: "Computer Science",
    english: { pdf: "1MVd5CiTqlkf47d5MVJlCuYHzuvvyzaps", epub: "14CeFL-4blCD4_eNlX5LZ_rfcK86IWsuB" },
    tamil: { pdf: "1fomidm-ZE996YCP18ZENp1bsO-hkibjh", epub: "1FFy4-4J_w4ochV9UypwjycPNQqsIpd2c" }
  },
  {
    name: "Economics",
    english: { pdf: "1d1qixVtbC6Jk1cAjN89RqM-CEq58KF9P", epub: "1twH0d4YOmRtcC8LCZcPlWFYYzc7u4i4Z" },
    tamil: { pdf: "19_O1kokpJiN_7CdPlA2wddNTe1Gs3kPc", epub: "1dPYn2VZry6aY2TEMQHFmHoBYaqFkAoOk" }
  },
  {
    name: "Mathematics Volume 1",
    english: { pdf: "1_auJ33Wb1pI2_DxahdqJ1poiRUh6hqvm", epub: "1bqvhf4I90dxYhc9t2-rUJZ_e3O1cEG9Z" },
    tamil: { pdf: "1fzvsKbCtL8QoqXO7bO-VzcPEez5L4Q2c", epub: "1PT6WSg2WZBz2_FJfV1OwEFHowx0RGz6G" }
  },
  {
    name: "Mathematics Volume 2",
    english: { pdf: "1EpNZmRikhWY6zsYRMnAtC4N_K6S3iB34", epub: "1K_9vIHAodERyxUyoDiBU7VlWxPhY5C7P" },
    tamil: { pdf: "1XdaQTr6BsERWUJNQr-yUsxr7bKnfMxtw", epub: "1iXQc1EdGfsFG8bhFxOzxVQ7UmKIvM_MQ" }
  },
  {
    name: "Physics Volume 1",
    english: { pdf: "1fCGFMpgWHYwnDwj1C2q7ZnKzSvuJnTpC", epub: "1nzxJjUlCVT1zq9AUpsKt_U0WodvdwN0i" },
    tamil: { pdf: "14FUtTFH7mSh2JXLzITGD5B2ZQ_AV0JpN", epub: "1k9r6BQYs-X_56-elx-iDRhysRb4GbnsN" }
  },
  {
    name: "Physics Volume 2",
    english: { pdf: "1Wym407rJT8FWOOwnwGEOLVrA0VDJmQYv", epub: "1p35m1UvmQ0dOuSeIkb85Ts61c9wUnAWu" },
    tamil: { pdf: "1NLTmtWajs8ddggYND5vOwPdNvp2ENbj7", epub: "1d2fipKGM0Qg4rdz75pbLDlDS7TLtYzKa" }
  },
  {
    name: "Zoology",
    english: { pdf: "1ZB_QWhgaxbwQAJtduDEou1l-eah7i-uR", epub: "10UUNOkr2EvIxImNtJLrAyTcq7LMZNVgu" },
    tamil: { pdf: "1wqwHobasDzct80YtalPH_ME3DIOesfgz", epub: "1dbM9fAyzevwMIbcjdUAhC8JYoXtGCH3K" }
  }
];

// --- Helper Component for Links ---
const DownloadLink = ({ id, type }: { id: string | null; type: 'PDF' | 'EPUB' }) => {
  if (!id) return <span className="text-gray-400 italic text-sm">N/A</span>;
  
  const baseUrl = "https://drive.google.com/file/d/";
  const suffix = "/view?usp=drivesdk";
  const url = `${baseUrl}${id}${suffix}`;

  const colors = type === 'PDF' 
    ? 'bg-red-50 text-red-600 hover:bg-red-100 border-red-200' 
    : 'bg-blue-50 text-blue-600 hover:bg-blue-100 border-blue-200';

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`px-3 py-1.5 text-xs font-semibold rounded border transition-colors inline-block text-center w-20 ${colors}`}
    >
      {type}
    </a>
  );
};

// --- Main Component ---
export default function TextbookDirectory() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredBooks = textbookData.filter((book) =>
    book.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">12th Standard Textbooks</h1>
            <p className="text-gray-500 mt-1">Download PDF and EPUB versions for English and Tamil Mediums.</p>
          </div>
          
          {/* Search Bar */}
          <div className="relative w-full md:w-72">
            <input
              type="text"
              placeholder="Search subjects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow"
            />
          </div>
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-100 border-b border-gray-200">
                  <th className="p-4 font-semibold text-gray-700 w-1/3">Subject Name</th>
                  <th className="p-4 font-semibold text-gray-700 text-center w-1/3 border-l border-gray-200">English Medium</th>
                  <th className="p-4 font-semibold text-gray-700 text-center w-1/3 border-l border-gray-200">Tamil Medium</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredBooks.length > 0 ? (
                  filteredBooks.map((book, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4 font-medium text-gray-800">{book.name}</td>
                      
                      {/* English Links */}
                      <td className="p-4 border-l border-gray-100">
                        <div className="flex justify-center items-center gap-3">
                          <DownloadLink id={book.english.pdf} type="PDF" />
                          <DownloadLink id={book.english.epub} type="EPUB" />
                        </div>
                      </td>
                      
                      {/* Tamil Links */}
                      <td className="p-4 border-l border-gray-100">
                        <div className="flex justify-center items-center gap-3">
                          <DownloadLink id={book.tamil.pdf} type="PDF" />
                          <DownloadLink id={book.tamil.epub} type="EPUB" />
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="p-8 text-center text-gray-500">
                      No subjects found matching "{searchTerm}".
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        
      </div>
    </div>
  );
}