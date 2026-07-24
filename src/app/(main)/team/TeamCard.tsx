import Image from 'next/image';
import { FaUser, FaEnvelope } from 'react-icons/fa';

interface Member {
  id: number;
  name: string;
  image: string | null;
  contactLink: string | null;
}

interface CommitteeMember {
  id: number;
  memberId: number;
  committeeName: string;
  role: string;
  isConvenor: boolean;
  member: Member;
}

interface TeamCardProps {
  committeeMember?: CommitteeMember;
  member?: Member;
}

export default function TeamCard({ committeeMember, member }: TeamCardProps) {
  const memberData = committeeMember?.member || member;
  const role = committeeMember?.role;
  const isConvenor = committeeMember?.isConvenor || false;
  
  if (!memberData) return null;

  const { name, image: pic, contactLink } = memberData;
  
  const primaryEmail = contactLink?.includes('@') ? contactLink : null;
  const secondaryEmail = null; // This would need to be extracted based on your data structure

  return (
    <div className={`
      relative overflow-hidden rounded-lg border p-6 flex flex-col
      ${isConvenor 
        ? 'bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-300 shadow-md' 
        : 'bg-white border-gray-300 shadow-sm'
      }
      hover:shadow-xl transition-all duration-300
    `}>
      
      {/* Convenor Badge */}
      {isConvenor && (
        <div className="absolute top-0 right-0 bg-amber-600 text-white px-3 py-1 rounded-bl-lg text-xs font-semibold shadow-sm">
          {role === 'Vice President' ? 'VP' : (role === 'Assistant Vice President' ? 'AVP' : 'Convenor')}
        </div>
      )}
      
      {/* Card Content */}
      <div className="flex flex-col items-center text-center flex-grow">
        
        {/* Profile Image */}
        <div className={`
          w-24 h-24 rounded-full mb-4 shadow-md overflow-hidden flex-shrink-0
          flex items-center justify-center
          ${isConvenor 
            ? 'bg-gradient-to-br from-amber-100 to-yellow-100 border-2 border-amber-400' 
            : 'bg-gray-50 border-2 border-gray-300'
          }
        `}>
          {pic && !pic.includes("image") ? (
            <Image src={pic} alt={`Profile picture of ${name}`} className="w-full h-full object-cover" width={96} height={96} />
          ) : (
            <FaUser className={`w-12 h-12 ${isConvenor ? 'text-amber-600' : 'text-gray-600'}`} />
          )}
        </div>
        
        {/* Name and Role */}
        <div className="space-y-1 mb-4">
          <h3 className={`text-lg font-semibold ${isConvenor ? 'text-amber-700' : 'text-gray-900'}`}>
            {name}
          </h3>
          {role && (
            <p className={`text-sm font-medium ${isConvenor ? 'text-amber-600' : 'text-gray-700'}`}>
              {role}
            </p>
          )}
        </div>
      </div>

      {/* Email Links Section */}
      {primaryEmail && (
        <div className="mt-auto pt-4 border-t border-gray-300 flex flex-col items-center space-y-1">
          <a 
            href={`mailto:${primaryEmail}`}
            className="flex w-full items-center justify-center gap-2 text-xs text-gray-800 hover:text-amber-700 transition-colors font-medium"
            aria-label={`Email ${name} at ${primaryEmail}`}
          >
            <FaEnvelope className="w-3 h-3 flex-shrink-0" />
            <span className="truncate" title={primaryEmail}>{primaryEmail}</span>
          </a>
          {secondaryEmail && (
            <a 
              href={`mailto:${secondaryEmail}`}
              className="flex w-full items-center justify-center gap-2 text-xs font-semibold text-gray-900 hover:text-amber-700 transition-colors"
              aria-label={`Email at ${secondaryEmail}`}
            >
              <FaEnvelope className="w-3 h-3 flex-shrink-0" />
              <span className="truncate" title={secondaryEmail}>{secondaryEmail}</span>
            </a>
          )}
        </div>
      )}
    </div>
  );
}
