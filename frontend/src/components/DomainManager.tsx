// import React, { useState, useEffect } from 'react';
// import { , verifyDomain, listDomains, removeDomain } from '../services/api';

// interface DomainManagerProps {
//   token: string;
// }

// const DomainManager: React.FC<DomainManagerProps> = ({ token }) => {
//   const [domains, setDomains] = useState<any[]>([]);
//   const [newDomain, setNewDomain] = useState('');
//   const [verificationToken, setVerificationToken] = useState('');
//   const [selectedDomain, setSelectedDomain] = useState('');
//   const [message, setMessage] = useState<string | null>(null);

//   const fetchDomains = async () => {
//     const res = await listDomains(token);
//     setDomains((res.data as { data: any[] }).data);
//   };

//   useEffect(() => {
//     fetchDomains();
//     // eslint-disable-next-line
//   }, [token]);

//   const handleAddDomain = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setMessage(null);
//     try {
//       await addDomain(newDomain, token);
//       setMessage('Domain added. Please verify ownership.');
//       setNewDomain('');
//       fetchDomains();
//     } catch {
//       setMessage('Error adding domain.');
//     }
//   };

//   const handleVerifyDomain = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setMessage(null);
//     try {
//       await verifyDomain(selectedDomain, token, verificationToken);
//       setMessage('Domain verified!');
//       setVerificationToken('');
//       fetchDomains();
//     } catch {
//       setMessage('Error verifying domain.');
//     }
//   };

//   const handleRemoveDomain = async (domain: string) => {
//     setMessage(null);
//     try {
//       await removeDomain(domain, token);
//       setMessage('Domain removed.');
//       fetchDomains();
//     } catch {
//       setMessage('Error removing domain.');
//     }
//   };

//   return (
//     <div className="max-w-xl mx-auto mt-10 p-8 bg-black bg-opacity-80 rounded shadow-md text-white">
//       <h2 className="text-2xl font-bold mb-6 text-center text-white drop-shadow-lg">Custom Domains</h2>
//       <form onSubmit={handleAddDomain} className="flex gap-2 mb-4">
//         <input
//           className="flex-1 px-4 py-2 border rounded focus:outline-none focus:ring bg-black text-white placeholder-gray-400"
//           type="text"
//           placeholder="yourdomain.com"
//           value={newDomain}
//           onChange={e => setNewDomain(e.target.value)}
//           required
//         />
//         <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition" type="submit">Add</button>
//       </form>
//       <form onSubmit={handleVerifyDomain} className="flex gap-2 mb-4">
//         <select
//           aria-label="Select domain to verify"
//           className="flex-1 px-4 py-2 border rounded focus:outline-none focus:ring bg-black text-white"
//           value={selectedDomain}
//           onChange={e => setSelectedDomain(e.target.value)}
//         >
//           <option value="">Select domain to verify</option>
//           {domains.filter(d => !d.verified).map(d => (
//             <option key={d.domain} value={d.domain}>{d.domain}</option>
//           ))}
//         </select>
//         <input
//           className="flex-1 px-4 py-2 border rounded focus:outline-none focus:ring bg-black text-white placeholder-gray-400"
//           type="text"
//           placeholder="Verification Token"
//           value={verificationToken}
//           onChange={e => setVerificationToken(e.target.value)}
//         />
//         <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition" type="submit">Verify</button>
//       </form>
//       <div className="mb-2 font-bold">Your Domains:</div>
//       <ul className="space-y-2">
//         {domains.map(d => (
//           <li key={d.domain} className={`p-2 rounded flex items-center justify-between ${d.verified ? 'bg-green-900' : 'bg-yellow-900'}`}>
//             <span>{d.domain} {d.verified ? <span className="text-green-400">(Verified)</span> : <span className="text-yellow-400">(Pending)</span>}</span>
//             <button className="ml-4 bg-red-700 text-white px-2 py-1 rounded hover:bg-red-800 transition" onClick={() => handleRemoveDomain(d.domain)}>Remove</button>
//           </li>
//         ))}
//       </ul>
//       {message && <div className="mt-4 text-center text-red-400">{message}</div>}
//     </div>
//   );
// };

// export default DomainManager;
