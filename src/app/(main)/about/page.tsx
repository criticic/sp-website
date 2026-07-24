export default function AboutPage() {
  return (
    <main className="space-y-16 lg:space-y-20">
      <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-3">
          <div className="relative flex flex-col-reverse items-center md:flex-row">
              <div className="items-center py-5 md:pb-20 md:pt-10">
                  <div className="text-center space-y-6 sm:space-y-10">
                      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium leading-tight md:leading-none text-accent">Democratizing Student <br className="hidden sm:block" /> Governance at <br className="hidden sm:block" /> IIT BHU</h1>
                      <p className="mt-6 mb-8 text-base sm:text-lg md:text-xl font-normal leading-7 sm:mb-12 text-gray-600 max-w-3xl mx-auto">The Students Parliament IIT BHU is a democratic institution that represents the collective voice of students, fostering transparent governance, academic excellence, and comprehensive student welfare initiatives.</p>
                      <a className="px-6 sm:px-9 py-4 sm:py-5 bg-accent hover:bg-primary text-white hover:text-accent border rounded-2xl justify-items-center md:justify-items-start gap-2.5 inline-flex text-lg sm:text-xl" href="/contact">
                          Join Our Mission
                      </a>
                  </div>
              </div>
          </div>
      </div>
      
      <section className="py-16 bg-primary/10">
          <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto text-center">
                  <h3 className="text-3xl font-medium text-accent mb-8">Our Legacy</h3>
                  <p className="text-lg text-gray-600 mb-6">
                      Established as the democratic voice of students at IIT BHU, our Parliament has been at the forefront of student advocacy, policy reform, and institutional development for decades.
                  </p>
                  <p className="text-lg text-gray-600">
                      We work collaboratively with administration, faculty, and students to create an environment that promotes academic excellence, innovation, and holistic development.
                  </p>
              </div>
          </div>
      </section>
      
      <section className="py-16 px-4">
          <div className="container mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-200">
                      <h3 className="text-2xl font-medium text-accent mb-6">Our Mission</h3>
                      <p className="text-gray-600 leading-relaxed">
                          To serve as the democratic voice of students, ensuring transparent governance, advocating for student rights, and fostering an environment conducive to academic excellence and personal growth.
                      </p>
                  </div>
                  <div className="bg-accent p-8 rounded-lg shadow-lg">
                      <h3 className="text-2xl font-medium text-white mb-6">Our Vision</h3>
                      <p className="text-white leading-relaxed">
                          To create a vibrant, inclusive, and progressive campus community where every student&apos;s voice is heard, rights are protected, and opportunities for growth are maximized.
                      </p>
                  </div>
              </div>
          </div>
      </section>
    </main>
  );
}