'use client';

import { useState, FormEvent } from 'react';

interface Committee {
  name: string;
  description: string | null;
  email: string | null;
}

interface ContactFormProps {
  committees: Committee[];
}

export default function ContactForm({ committees }: ContactFormProps) {
  const [selectedCommittee, setSelectedCommittee] = useState('');
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleSendEmail = (e: FormEvent) => {
    e.preventDefault();
    if (!selectedCommittee) { alert('Please select a committee.'); return; }
    if (!name || !subject || !message) { alert('Please fill in all fields.'); return; }

    const emailSubject = encodeURIComponent(subject);
    const body = encodeURIComponent(
      `${message}\n\nSent by: ${name}\n\n---\nThis message was sent from the Students Parliament website contact form.`
    );
    window.location.href = `mailto:${selectedCommittee}?subject=${emailSubject}&body=${body}`;
  };

  return (
    <div>
      <h3 className="text-xl mb-6">Send a Message</h3>
      <form onSubmit={handleSendEmail} className="space-y-5">
        <div>
          <label htmlFor="committee" className="block font-mono text-xs text-slate uppercase tracking-wider mb-2">Committee</label>
          <select
            id="committee" name="committee" value={selectedCommittee}
            onChange={(e) => setSelectedCommittee(e.target.value)}
            className="w-full px-4 py-3 bg-light-parchment border border-slate/20 text-ink font-body text-sm focus:outline-none focus:border-gold transition-colors"
          >
            <option value="">Select a committee...</option>
            {committees.filter(c => c.email).map(c => (
              <option key={c.name} value={c.email!}>{c.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="name" className="block font-mono text-xs text-slate uppercase tracking-wider mb-2">Your Name</label>
          <input type="text" id="name" name="name" value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 bg-light-parchment border border-slate/20 text-ink font-body text-sm focus:outline-none focus:border-gold transition-colors"
            required placeholder="Enter your full name"
          />
        </div>

        <div>
          <label htmlFor="subject" className="block font-mono text-xs text-slate uppercase tracking-wider mb-2">Subject</label>
          <input type="text" id="subject" name="subject" value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full px-4 py-3 bg-light-parchment border border-slate/20 text-ink font-body text-sm focus:outline-none focus:border-gold transition-colors"
            required placeholder="Brief description of your inquiry"
          />
        </div>

        <div>
          <label htmlFor="message" className="block font-mono text-xs text-slate uppercase tracking-wider mb-2">Message</label>
          <textarea id="message" name="message" rows={5} value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full px-4 py-3 bg-light-parchment border border-slate/20 text-ink font-body text-sm focus:outline-none focus:border-gold transition-colors resize-vertical"
            required placeholder="Describe your question or concern..."
          />
        </div>

        <button type="submit"
          className="w-full py-3 bg-ink text-white font-body font-medium text-sm tracking-wider uppercase hover:bg-gold hover:text-ink transition-colors duration-200"
        >
          Send Message
        </button>
      </form>
    </div>
  );
}
