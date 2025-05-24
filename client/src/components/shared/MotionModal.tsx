// 'use client';

// import { motion, AnimatePresence } from 'framer-motion';

// type Props = {
//   show: boolean;
//   onClose: () => void;
// };

// export default function MinimalCenteredModal({ show, onClose }: Props) {
//   return (
//     <AnimatePresence>
//       {show && (
//         <div
//           className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
//           onClick={onClose}
//         >
//           <motion.div
//             onClick={(e) => e.stopPropagation()}
//             initial={{ scale: 0.95, opacity: 0 }}
//             animate={{ scale: 1, opacity: 1 }}
//             exit={{ scale: 0.95, opacity: 0 }}
//             transition={{ duration: 0.2 }}
//             className="bg-[#131313] border border-[#202020] rounded-xl w-full max-w-md p-6 text-white"
//           >
//             <p className="text-center font-bold mb-3">May 17  - Early state notice 🟢</p>
//             <p className="text-center  mb-4">To make testing and development easier, sign-ups do not require real emails, just use any unique one. No email verification is needed.
//             Thanks for trying out the app!</p>
//             <div className="flex justify-center">
//               <button
//                 onClick={onClose}
//                 className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 hover:cursor-pointer"
//               >
//                 Got it
//               </button>
//             </div>
//           </motion.div>
//         </div>
//       )}
//     </AnimatePresence>
//   );
// }




'use client';

import { motion, AnimatePresence } from 'framer-motion';

type Props = {
  show: boolean;
  onClose: () => void;
};

export function MinimalCenteredModal({ show, onClose }: Props) {
  return (
    <AnimatePresence>
      {show && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
          onClick={onClose}
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-[#131313] border border-[#202020] rounded-xl w-full max-w-md p-6 text-white"
          >
            <p className="text-center font-bold mb-3">May 20  - Inactive Sockets notice 🔴</p>
            <p className="text-center  mb-4"> Thanks to everyone who tried the app. The Socket server will be down after May 20th. I cannot moderate the content shared on this app alone without a team.  It will be see-only  (TEST CHANGE).  </p>
            <div className="flex justify-center">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 hover:cursor-pointer"
              >
                Got it
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
