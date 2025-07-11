import { db } from '@/db';
import ContactForm from './ContactForm';

interface Committee {
    name: string;
    description: string | null;
    email: string | null;
}

async function getCommittees(): Promise<Committee[]> {
    const committees = await db.query.committees.findMany({
        columns: {
            name: true,
            description: true,
            email: true,
        },
    });
    return committees;
}

export default async function ContactPage() {
    const committees = await getCommittees();

    return (
        <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-3">
            <div className="w-full max-w-[1280px] mx-auto">
                <div className="container mx-auto px-4 py-16">
                    <div className="mx-auto max-w-screen-sm text-center lg:mb-16 mb-8">
                        <h2 className="mb-4 text-3xl lg:text-4xl tracking-tight font-extrabold">Contact Us</h2>
                        <p className="font-light sm:text-xl">Get in touch with us for any questions, concerns, or feedback.</p>
                    </div>


                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-16">
                        <div>
                            <h2 className="text-3xl font-medium text-accent mb-6">Get in Touch</h2>
                            <p className="text-lg text-gray-600 mb-6">
                                We are here to help you with any questions you may have. Feel free to reach out to us
                                for inquiries about student representation, welfare issues, or any other matters.
                            </p>

                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-xl font-medium text-gray-800 mb-2">General Inquiries</h3>
                                    <p className="text-gray-600">
                                        For general questions and information:
                                    </p>
                                    <a
                                        href="mailto:vp.parliament@itbhu.ac.in"
                                        className="text-accent hover:underline font-medium"
                                    >
                                        vp.parliament@itbhu.ac.in
                                    </a>
                                </div>
                            </div>
                        </div>

                        <div>
                            <ContactForm committees={committees} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
