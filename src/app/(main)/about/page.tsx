export default function AboutPage() {
  return (
    <div className="space-y-20 md:space-y-28">
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
          <p className="font-mono text-xs text-gold tracking-[0.2em] uppercase mb-6">
            About
          </p>
          <h1 className="mb-4 max-w-3xl">
            Democratizing Student <span className="text-gold">Governance</span> at IIT BHU
          </h1>
          <div className="rostrum-rule my-8">
            ◆
          </div>
          <p className="text-lg md:text-xl text-slate max-w-2xl leading-relaxed mb-8">
            The Students Parliament IIT BHU is a democratic institution that represents the collective voice of students, fostering transparent governance, academic excellence, and comprehensive student welfare initiatives.
          </p>
          <a href="/contact" className="btn-primary inline-block">
            Join Our Mission
          </a>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-light-parchment">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="mb-6">Our Legacy</h2>
            <div className="rostrum-rule my-6 justify-center">
              ◆
            </div>
            <p className="text-lg text-slate leading-relaxed mb-6">
              Established as the democratic voice of students at IIT BHU, our Parliament has been at the forefront of student advocacy, policy reform, and institutional development for decades.
            </p>
            <p className="text-lg text-slate leading-relaxed">
              We work collaboratively with administration, faculty, and students to create an environment that promotes academic excellence, innovation, and holistic development.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            <div className="bg-light-parchment p-8 md:p-10 border-t-2 border-gold">
              <h3 className="text-2xl mb-4">Our Mission</h3>
              <p className="text-slate leading-relaxed font-body">
                To serve as the democratic voice of students, ensuring transparent governance, advocating for student rights, and fostering an environment conducive to academic excellence and personal growth.
              </p>
            </div>
            <div className="bg-ink p-8 md:p-10 border-t-2 border-gold">
              <h3 className="text-2xl mb-4 text-white">Our Vision</h3>
              <p className="text-white/80 leading-relaxed font-body">
                To create a vibrant, inclusive, and progressive campus community where every student&apos;s voice is heard, rights are protected, and opportunities for growth are maximized.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
