import Link from "next/link";

export default function Hero() {
  return (
    <section id="home" className="px-5 flex justify-center overflow-hidden lg:block">
      <div className="w-full max-w-[1280px] mx-auto min-h-[calc(100vh-80px)] flex items-center justify-center">
        <div className="relative flex flex-col items-center" id="hero">
            <div className="row items-center py-5 md:pb-20 md:pt-10">
                <div className="text-center space-y-3">
                    <h1 className="text-4xl font-medium leading-none md:text-6xl text-accent">Empowering Student <br /> Voices at <br /> IIT BHU</h1>
                    <p className="mt-6 mb-8 text-lg font-normal leading-7 sm:mb-12 text-gray-700">The Students Parliament IIT BHU serves as the democratic voice of students, working towards academic excellence, student welfare, and institutional development through transparent governance and active participation.</p>
                    <div className="w-full justify-center items-center inline-flex">
                        <Link href="/contact" className="px-8 py-5 bg-accent hover:bg-primary rounded-2xl text-center text-white hover:text-accent border text-xl font-normal leading-7">Get Involved
                        </Link>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </section>
  );
}