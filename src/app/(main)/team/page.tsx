import { db } from "@/db";
import TeamCard from "@/app/(main)/team/TeamCard";

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
    <div className="py-16 md:py-24 px-6 md:px-12 lg:px-16 max-w-7xl mx-auto">
      <div className="max-w-3xl mx-auto text-center mb-16">
        <p className="font-mono text-xs text-gold tracking-[0.2em] uppercase mb-6">Our People</p>
        <h2 className="mb-4">Parliament Members</h2>
        <div className="rostrum-rule my-6 justify-center">◆</div>
        <p className="text-lg text-slate leading-relaxed max-w-xl mx-auto">The students who make up the governing body of the Students Parliament IIT BHU.</p>
      </div>
          
          {executiveBody && (
            <div className="mb-20">
              <div className="text-center mb-12">
                <h2 className="mb-3">{executiveBody.name}</h2>
                {executiveBody.email && (
                  <p className="font-mono text-sm text-gold">{executiveBody.email}</p>
                )}
                {executiveBody.email === "vp.gymkhana@itbhu.ac.in" && (
                  <p className="font-mono text-sm text-gold mt-1">avp.gymkhana@itbhu.ac.in</p>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                {executiveBody.committeeMembers.map((cm) => (
                  <TeamCard key={cm.id} committeeMember={cm} />
                ))}
              </div>
            </div>
          )}
          
          {otherCommittees.map((committee) => (
            <div key={committee.name} className="mb-20">
              <div className="text-center mb-10">
                <h2 className="mb-3">{committee.name}</h2>
                {committee.email && (
                  <p className="font-mono text-sm text-gold mb-3">{committee.email}</p>
                )}
                {committee.description && (
                  <p className="text-slate text-base max-w-2xl mx-auto leading-relaxed font-body">{committee.description}</p>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {committee.committeeMembers.map((cm) => (
                  <TeamCard key={cm.id} committeeMember={cm} />
                ))}
              </div>
            </div>
          ))}
          
          {otherParliamentarians.length > 0 && (
            <div>
              <div className="text-center mb-10">
                <h2 className="mb-3">Other Parliamentarians</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {otherParliamentarians.map((member) => (
                  <TeamCard key={member.id} member={member} />
                ))}
              </div>
            </div>
          )}
    </div>
  );
}