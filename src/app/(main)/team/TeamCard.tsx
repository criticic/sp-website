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

function optimizeCloudinaryUrl(url: string): string {
  if (!url.startsWith('https://res.cloudinary.com/')) return url;
  return url.replace('/image/upload/', '/image/upload/w_400,h_400,c_fill,g_face,q_auto,f_auto/');
}

export default function TeamCard({ committeeMember, member }: TeamCardProps) {
  const memberData = committeeMember?.member || member;
  const role = committeeMember?.role;
  const isConvenor = committeeMember?.isConvenor || false;

  if (!memberData) return null;

  const { name, image: pic, contactLink } = memberData;

  const primaryEmail = contactLink?.includes('@') ? contactLink : null;

  return (
    <div className="bg-light-parchment border-t-2 border-gold/30 hover:border-gold transition-colors duration-300 p-5 sm:p-6 flex flex-col">
      <div className="flex flex-col items-center text-center flex-grow">
        <div className={`
          w-20 h-20 sm:w-24 sm:h-24 rounded-full mb-4 overflow-hidden flex-shrink-0
          flex items-center justify-center border-2
          ${isConvenor ? 'border-gold' : 'border-slate/20'}
        `}>
          {pic && (pic.startsWith('http') || (!pic.includes('image') && !pic.startsWith('/assets'))) ? (
            <Image src={optimizeCloudinaryUrl(pic)} alt={`Profile picture of ${name}`} className="w-full h-full object-cover" width={96} height={96} unoptimized />
          ) : (
            <FaUser className={`w-8 h-8 sm:w-10 sm:h-10 ${isConvenor ? 'text-gold' : 'text-slate/40'}`} />
          )}
        </div>

        <div className="space-y-1 mb-3">
          <h3 className="font-body font-medium text-ink text-sm sm:text-base">{name}</h3>
          {role && (
            <p className={`font-mono text-xs ${isConvenor ? 'text-gold' : 'text-slate'}`}>
              {role}
            </p>
          )}
        </div>
      </div>

      {primaryEmail && (
        <div className="mt-auto pt-3 border-t border-slate/10">
          <a
            href={`mailto:${primaryEmail}`}
            className="flex items-center justify-center gap-2 text-xs font-mono text-slate hover:text-gold transition-colors"
          >
            <FaEnvelope className="w-3 h-3 flex-shrink-0" />
            <span className="truncate">{primaryEmail}</span>
          </a>
        </div>
      )}
    </div>
  );
}
