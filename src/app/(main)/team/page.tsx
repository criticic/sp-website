import { db } from "@/db";
import TeamCard from "@/components/TeamCard";

export const revalidate = 3600; // Revalidate every hour

async function getTeamData() {
  const allCommittees = await db.query.committees.findMany({
    with: {
      committeeMembers: {
        with: {
          member: true,
        },
        orderBy: (committeeMembers, { desc }) => [desc(committeeMembers.isConvenor)],
      },
    },
  });

  const executiveBody = allCommittees.find(c => c.name === "Executive Body");
  const otherCommittees = allCommittees.filter(c => c.name !== "Executive Body");
  
  // Find members who are not in any committee
  const allMembersInCommittees = new Set(
    allCommittees.flatMap(c => c.committeeMembers.map(cm => cm.memberId))
  );

  const allMembersFromDB = await db.query.members.findMany();

  const otherParliamentarians = allMembersFromDB.filter(
    member => !allMembersInCommittees.has(member.id)
  );

  if (!executiveBody) {
    console.warn("Executive Body committee not found in the database.");
  }
  
  return { executiveBody, otherCommittees, otherParliamentarians };
}

export default async function TeamPage() {
  const { executiveBody, otherCommittees, otherParliamentarians } = await getTeamData();

  return (
    <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-3">
      <div className="w-full max-w-[1280px] mx-auto">
          <div className="mx-auto max-w-screen-sm text-center lg:mb-16 mb-8">
        <h2 className="mb-4 text-3xl lg:text-4xl tracking-tight font-extrabold">Our Parliament Members</h2>
        <p className="font-light sm:text-xl">Browse and read our newsletters featuring campus updates, student achievements, and important announcements.</p>
      </div>
          
          {executiveBody && (
            <div className="mt-16">
              <h2 className="text-3xl font-semibold text-gray-900 mb-8 text-center">{executiveBody.name}</h2>
              {executiveBody.email && (
                <div className="text-center mb-8">
                  <a 
                    href={`mailto:${executiveBody.email}`}
                    className="text-blue-600 hover:text-blue-800 font-medium text-lg transition-colors"
                  >
                    {executiveBody.email}
                  </a>
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {executiveBody.committeeMembers.map((cm) => (
                  <TeamCard key={cm.id} committeeMember={cm} />
                ))}
              </div>
            </div>
          )}
          
          {otherCommittees.map((committee) => (
            <div key={committee.name} className="mt-20">
              <h2 className="text-3xl font-semibold text-gray-900 mb-4 text-center">{committee.name}</h2>
              {committee.email && (
                <div className="text-center mb-4">
                  <a 
                    href={`mailto:${committee.email}`}
                    className="text-blue-600 hover:text-blue-800 font-medium text-lg transition-colors"
                  >
                    {committee.email}
                  </a>
                </div>
              )}
              <p className="text-gray-700 text-center mb-8 max-w-3xl mx-auto leading-relaxed">{committee.description}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {committee.committeeMembers.map((cm) => (
                  <TeamCard key={cm.id} committeeMember={cm} />
                ))}
              </div>
            </div>
          ))}
          
          {otherParliamentarians.length > 0 && (
            <div className="mt-20">
              <h2 className="text-3xl font-semibold text-gray-900 mb-8 text-center">Other Parliamentarians</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {otherParliamentarians.map((member) => (
                  <TeamCard key={member.id} member={member} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
  );
}