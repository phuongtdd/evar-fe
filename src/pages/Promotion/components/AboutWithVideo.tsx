import React from "react";

const AboutWithVideo: React.FC = () => {
  return (
    <section className="relative bg-[#f4f4f4] py-20 px-4 lg:py-16 md:py-12 sm:py-8">
      {/* Background virtual office environment */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute left-0 top-0 h-full w-1/3 bg-gradient-to-r from-blue-50/30 to-transparent"></div>
        <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-blue-50/30 to-transparent"></div>
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="h-full w-full"
            style={{
              backgroundImage: `
              linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
            `,
              backgroundSize: "50px 50px",
            }}
          ></div>
        </div>
      </div>

      <div className="relative w-full h-[1090px] bg-transparent">
        <div className="bg-[#f4f4f4] absolute left-0  w-[10%] h-full"></div>
        <div className="bg-[#f4f4f4] absolute right-0  w-[10%] h-full"></div>
        <iframe
          src="https://player.cloudinary.com/embed/?cloud_name=dxt8ylemj&public_id=waves_p5cxyt&autoplay_mode=on-scroll&loop=true&picture_in_picture_toggle=true&controls=false"
          className="w-full h-full pointer-events-none"
          allow="autoplay; encrypted-media"
          allowFullScreen
        ></iframe>
      </div>

      <div className="container relative z-10 mx-auto max-w-7xl">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-6 text-5xl font-bold leading-tight text-black lg:text-4xl md:text-3xl sm:text-2xl">
            Work together. Like in the office.
          </h2>
          <p className="mx-auto mb-16 max-w-2xl text-lg leading-relaxed text-gray-700 lg:text-base md:text-sm">
            Create customized virtual office spaces for any department or event
            with high quality audio and video conferencing.
          </p>

          {/* Video Conferencing Interface */}
          <div className="relative mx-auto mb-16 max-w-4xl">
            {/* Main video call container */}
            {/* <div className="relative mx-auto aspect-video max-w-4xl overflow-hidden rounded-xl bg-gray-900 shadow-2xl">
            
              <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-blue-200">
               
               <iframe src=""/>

               

              
              </div>
            </div> */}
          </div>
          {/* Description paragraph */}
          <p className="mx-auto mb-12 max-w-3xl text-center text-lg leading-relaxed text-gray-700 lg:text-base md:text-sm">
            Collaborating with remote teams is easy in your virtual office
            environment. Enjoy real-time communication within your workspace
            without additional software hassle.
          </p>

          {/* Features section */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3 lg:gap-12">
            {/* Feature 1: Customize workspace */}
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-lg bg-blue-100">
                <svg
                  className="h-8 w-8 text-blue-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1V8zm0 4a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1v-2zm8-4a1 1 0 011-1h4a1 1 0 110 2h-4a1 1 0 01-1-1V8zm0 4a1 1 0 011-1h4a1 1 0 110 2h-4a1 1 0 01-1-1v-2z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h3 className="mb-3 text-xl font-semibold text-gray-900">
                Customize workspace
              </h3>
              <p className="text-gray-600">
                Create your own offices and meeting rooms to suit your team's
                needs.
              </p>
            </div>

            {/* Feature 2: Audio and video calls */}
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-lg bg-blue-100">
                <svg
                  className="h-8 w-8 text-blue-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                </svg>
              </div>
              <h3 className="mb-3 text-xl font-semibold text-gray-900">
                Audio and video calls
              </h3>
              <p className="text-gray-600">
                Collaborate efficiently and seamlessly with high quality virtual
                conferencing.
              </p>
            </div>

            {/* Feature 3: Invite guests */}
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-lg bg-blue-100">
                <svg
                  className="h-8 w-8 text-blue-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 11-2 0 1 1 0 012 0zM12 7a1 1 0 11-2 0 1 1 0 012 0z" />
                </svg>
              </div>
              <h3 className="mb-3 text-xl font-semibold text-gray-900">
                Invite guests
              </h3>
              <p className="text-gray-600">
                Meet with guests without ever needing to leave your workspace.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutWithVideo;
