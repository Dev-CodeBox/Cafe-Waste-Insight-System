import React from 'react'

function Blog() {
    const cardsData = [
        {
            id: 1,
            title: "Flavors of India",
            image:
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTiZN7c_EE1bv8-JZGdqWMGXw7w6PvzBKT_45_FFq7ohKouwFaS9RiLKyD1SHi8fsEvVbk&usqp=CAU",
            description:
                "A traditional Indian dining experience where vibrant colors and bold spices come together to create magic on your plate.",
        },
        {
            id: 2,
            title: "Cheers & Bites",
            image:
                "https://www.shutterstock.com/image-photo/leisure-celebration-drinks-people-holidays-260nw-675436801.jpg",
            description:
                "Lively vibes, chilled drinks, and global flavors—perfect for catching up with friends and celebrating small joys.",
        },
        {
            id: 3,
            title: "Family Feast Café",
            image:
                "https://www.shutterstock.com/image-photo/happy-family-having-fun-while-260nw-2459889567.jpg",
            description:
                "Bring your loved ones to a place where every meal feels like a celebration of togetherness and comfort food.",
        },
        {
            id: 4,
            title: "Date Night Diner",
            image:
                "https://www.shutterstock.com/image-photo/happy-couple-taking-selfie-smart-600nw-2258498871.jpg",
            description:
                "The perfect romantic spot with cozy vibes, photogenic plates, and an ambiance that makes every moment special.",
        },
        {
            id: 5,
            title: "Zen Bowl",
            image:
                "https://images.pexels.com/photos/9961871/pexels-photo-9961871.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
            description:
                "Minimalist Japanese cuisine in a peaceful setting—enjoy ramen, sushi, and the serene vibes of Kyoto dining.",
        },
        {
            id: 6,
            title: "The BBQ Joint",
            image:
                "https://t4.ftcdn.net/jpg/10/63/73/59/360_F_1063735958_Pp9pHLkhuODaSDKFPDGkQLakHa2Q8V9c.jpg",
            description:
                "Bold smoke, juicy meats, and grill-side passion—where every bite brings out the true essence of fire-cooked flavor.",
        },
    ];
    return (
        <section id='blog' className="bg-gray-50 dark:bg-gray-900 p-8 pt-20">
            <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8 pb-16">
                <span className='rounded-md bg-teal-600 px-5 py-2.5 text-lg font-medium text-white shadow-sm dark:hover:bg-teal-500'>
                    Blogs
                </span>
            </h1>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {cardsData.map((card) => (
                    <article key={card.id} className="group">
                        <img
                            alt={card.title}
                            src={card.image}
                            className="h-56 w-full rounded-xl object-cover shadow-xl transition group-hover:grayscale-[50%] dark:shadow-gray-700/25"
                        />

                        <div className="p-4">
                            <a href="#">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                    {card.title}
                                </h3>
                            </a>

                            <p className="mt-2 line-clamp-3 text-sm/relaxed text-gray-500 dark:text-gray-400">
                                {card.description}
                            </p>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    )
}

export default Blog