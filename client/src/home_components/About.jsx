import React from 'react'

function About() {
    return (
        <section id="about" className="overflow-hidden bg-gray-50 dark:bg-gray-900 sm:grid sm:grid-cols-2 sm:items-center pt-20">
            <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8 sm:col-span-2 ">
                <span className='rounded-md bg-teal-600 px-5 py-2.5 text-lg font-medium text-white shadow-sm dark:hover:bg-teal-500'>
                    About
                </span>
            </h1>
            <div className="p-8 md:p-12 lg:px-16 lg:py-24">
                <div className="mx-auto max-w-xl text-center sm:text-left">
                    <h2 className="text-2xl font-bold text-gray-900 md:text-3xl dark:text-white">
                        Cafe Waste Insight System helps cafés make smarter, greener decisions.
                    </h2>

                    <p className="mt-4 text-gray-500 md:block dark:text-gray-400">
                        We track food prep, consumption, and waste to boost efficiency, reduce costs, and support sustainability — all in one easy-to-use platform.
                    </p>

                    <div className="mt-8">
                        <a
                            href="#"
                            className="inline-block   px-12 py-3 text-sm font-medium text-white transition hover:bg-emerald-700 focus:ring-3 focus:ring-yellow-400 focus:outline-none
                                rounded-md bg-teal-600  shadow-sm dark:hover:bg-teal-500"
                        >
                            Welcoming you!
                        </a>
                    </div>
                </div>
            </div>
            <img
                alt="People enjoying a workspace"
                src="https://images.pexels.com/photos/1055058/pexels-photo-1055058.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                className="h-full w-full object-cover sm:h-[calc(100%_-_2rem)] sm:self-end sm:rounded-l-[30px] md:h-[calc(100%_-_4rem)] md:rounded-l-[60px]"
            />
        </section>
    )
}

export default About