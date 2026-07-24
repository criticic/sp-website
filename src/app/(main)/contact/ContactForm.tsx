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
    if (!selectedCommittee) {
      alert('Please select a committee.');
      return;
    }
    if (!name || !subject || !message) {
      alert('Please fill in all fields.');
      return;
    }

    const emailSubject = encodeURIComponent(subject);
    const body = encodeURIComponent(
      `${message}\n\n` +
      `Sent by: ${name}\n\n` +
      `---\n` +
      `This message was sent from the Students Parliament website contact form.`
    );

    const mailtoLink = `mailto:${selectedCommittee}?subject=${emailSubject}&body=${body}`;
    window.location.href = mailtoLink;
  };

  return (
    <div>
      <h2 className="text-3xl font-medium text-accent mb-6">Send a Message to a Committee</h2>
      <form onSubmit={handleSendEmail} className="space-y-6">
        <div>
          <label htmlFor="committee" className="block text-lg font-medium text-gray-700 mb-2">
            Committee
          </label>
          <select
            id="committee"
            name="committee"
            value={selectedCommittee}
            onChange={(e) => setSelectedCommittee(e.target.value)}
            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-colors"
          >
            <option value="">Select a committee...</option>
            {committees
              .filter(c => c.email) // Only show committees with email addresses
              .map(c => (
                <option key={c.name} value={c.email || ''}>
                  {c.name}
                </option>
              ))}
          </select>
        </div>
        
        <div>
          <label htmlFor="name" className="block text-lg font-medium text-gray-700 mb-2">
            Your Name
          </label>
          <input 
            type="text" 
            id="name" 
            name="name" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-colors" 
            required 
            placeholder="Enter your full name"
          />
        </div>
        
        <div>
          <label htmlFor="subject" className="block text-lg font-medium text-gray-700 mb-2">
            Subject
          </label>
          <input 
            type="text" 
            id="subject" 
            name="subject" 
            value={subject} 
            onChange={(e) => setSubject(e.target.value)} 
            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-colors" 
            required 
            placeholder="Brief description of your inquiry"
          />
        </div>
        
        <div>
          <label htmlFor="message" className="block text-lg font-medium text-gray-700 mb-2">
            Message
          </label>
          <textarea 
            id="message" 
            name="message" 
            rows={6} 
            value={message} 
            onChange={(e) => setMessage(e.target.value)} 
            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-colors resize-vertical" 
            required
            placeholder="Describe your question or concern in detail..."
          />
        </div>
        
        <button 
          type="submit" 
          className="w-full py-3 px-6 bg-accent text-white font-medium rounded-lg shadow-sm hover:bg-primary hover:text-dark transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
        >
          Send Message
        </button>
      </form>
    </div>
  );
}
