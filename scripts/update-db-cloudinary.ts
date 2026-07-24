import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import { members } from '../src/db/schema';
import { eq } from 'drizzle-orm';

const isProduction = process.env.DATABASE_ENV === 'production';
const url = isProduction
  ? process.env.TURSO_DB_REMOTE_URL!
  : process.env.TURSO_DB_LOCAL_URL || 'file:./src/db/local.db';

const client = createClient({ url, authToken: process.env.TURSO_DB_APP_TOKEN });
const db = drizzle(client);

const CLOUDINARY_BASE = 'https://res.cloudinary.com/djy7g0yj7/image/upload/v1784904154/sp-website/people';

const nameToSlug: Record<string, string> = {
  'Aaradhya Pareek': 'aaradhya-pareek',
  'Abhishek Kumar Pandey': 'abhishek-kumar-pandey',
  'Ahire Sujal Balasaheb': 'ahire-sujal-balasaheb',
  'Amarjeet Kumar': 'amarjeet-kumar',
  'Aniruddh Kumar Yadav': 'aniruddh-kumar-yadav',
  'Ankit Keshariya': 'ankit-keshariya',
  'Archita Gupta': 'archita-gupta',
  'Arjun Dixit': 'arjun-dixit',
  'Atul Jha': 'atul-jha',
  'Banothu Devender': 'banothu-devender',
  'Bhupendra Kumar Mina': 'bhupendra-kumar-mina',
  'Chandana Kumbavath': 'chandana-kumbavath',
  'Chhavi Verma': 'chhavi-verma',
  'Daravath Balaji': 'daravath-balaji',
  'Dev Gupta': 'dev-gupta',
  'Devendra Pandey': 'devendra-pandey',
  'Gaikwad Gaurav Vilas': 'gaikwad-gaurav-vilas',
  'Himanshu Kumar Dwivedi': 'himanshu-kumar-dwivedi',
  'Hitesh Khanna': 'hitesh-khanna',
  'Jitesh Kumar Mishra': 'jitesh-kumar-mishra',
  'kondapalli chakradhar': 'kondapalli-chakradhar',
  'Majji Nutana Sateesh': 'majji-nutana-sateesh',
  'Manish Deepak Shewale': 'manish-deepak-shewale',
  'Manvendra Saraswat': 'manvendra-saraswat',
  'Methari Hari Krishna': 'methari-hari-krishna',
  'Milan D Vijay': 'milan-d-vijay',
  'Moksh Tyagi': 'moksh-tyagi',
  'Mudavath Devsingh': 'mudavath-devsingh',
  'Naveen Kumar Meesala': 'naveen-kumar-meesala',
  'Nikhil Pratap Singh': 'nikhil-pratap-singh',
  'Om Tripathi': 'om-tripathi',
  'Piyush Kumar Pakad': 'piyush-kumar-pakad',
  'Prakhar Pandey': 'prakhar-pandey',
  'Prashant Kumar Pandey': 'prashant-kumar-pandey',
  'Ramanuj Agrawal': 'ramanuj-agrawal',
  'Rishabh Jangid': 'rishabh-jangid',
  'Sanj Subash Bhumanwar': 'sanj-subash-bhumanwar',
  'Sanskar Pandey': 'sanskar-pandey',
  'Sarayu K K': 'sarayu-k-k',
  'Satendra Singh': 'satendra-singh',
  'Shaneshraje Sandeep Kadu': 'shaneshraje-sandeep-kadu',
  'Shashikant Chaurasiya': 'shashikant-chaurasiya',
  'Shikha Tripathi': 'shikha-tripathi',
  'Shivam Vishwakarma': 'shivam-vishwakarma',
  'Shivansh Gupta': 'shivansh-gupta',
  'Tanisha Agarwal': 'tanisha-agarwal',
  'Umang Jain': 'umang-jain',
  'Vaibhav Agrawal': 'vaibhav-agrawal',
  'Vansh Gilhotra': 'vansh-gilhotra',
  'Vansh Sharma': 'vansh-sharma',
  'Vikram Bajiya': 'vikram-bajiya',
  'Yash Agarwal': 'yash-agarwal',
  'Yash Dilip Phalke': 'yash-dilip-phalke',
  'Yeddula Madhava Reddy': 'yeddula-madhava-reddy',
};

async function updateDb() {
  const allMembers = await db.select().from(members);
  console.log(`Found ${allMembers.length} members`);

  let updated = 0;

  for (const member of allMembers) {
    const slug = nameToSlug[member.name];
    if (!slug) {
      console.log(`  Skipping ${member.name} (no slug mapping)`);
      continue;
    }

    const cloudinaryUrl = `${CLOUDINARY_BASE}/${slug}.png`;
    
    if (member.image !== cloudinaryUrl) {
      await db.update(members).set({ image: cloudinaryUrl }).where(eq(members.id, member.id));
      console.log(`  ✓ ${member.name} -> ${cloudinaryUrl}`);
      updated++;
    } else {
      console.log(`  - ${member.name} (already up to date)`);
    }
  }

  console.log(`\nDone! ${updated} members updated`);
  client.close();
}

updateDb().catch(console.error);
