import { db } from '@/db';
import ContactForm from './ContactForm';

interface Committee {
    name: string;
    description: string | null;
    email: string | null;
}

async function getCommittees(): Promise<Committee[]> {
    const committees = await db.query.committees.findMany({
        columns: { name: true, description: true, email: true },
    });
    return committees;
}

export default async function ContactPage() {
    const committees = await getCommittees();

    return (
        <div className="py-16 md:py-24 px-6 md:px-12 lg:px-16 max-w-7xl mx-auto">
            <div className="max-w-3xl mx-auto text-center mb-16">
                <p className="font-mono text-xs text-gold tracking-[0.2em] uppercase mb-6">Contact</p>
                <h2 className="mb-4">Get in Touch</h2>
                <div className="rostrum-rule my-6 justify-center">◆</div>
                <p className="text-lg text-slate leading-relaxed max-w-xl mx-auto">
                    Have a question, concern, or feedback? We&apos;re here to help.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
                <div>
                    <h3 className="text-xl mb-6">General Inquiries</h3>
                    <p className="text-slate leading-relaxed font-body mb-4">
                        For general questions about student representation, welfare issues, or any other matters.
                    </p>
                    <a
                        href="mailto:vp.parliament@itbhu.ac.in"
                        className="font-mono text-sm text-ink underline underline-offset-4 decoration-gold/50 hover:text-gold transition-colors"
                    >
                        vp.parliament@itbhu.ac.in
                    </a>
                </div>

                <div>
                    <ContactForm committees={committees} />
                </div>
            </div>
        </div>
    );
}
